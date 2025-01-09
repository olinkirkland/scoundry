<template>
    <div class="page page--home page-in" ref="page">
        <div class="page-content">
            <h1>Scoundry</h1>
            <p v-html="$t('User-interface.Home-page.description')"></p>

            <div class="row controls">
                <button class="btn" @click="onClickMakeNewScoundrel">
                    <span>
                        {{
                            $t('User-interface.Home-page.new-scoundrel-button')
                        }}
                    </span>
                </button>
                <button
                    class="btn btn--alt"
                    @click="ModalController.open(SettingsModal)"
                >
                    {{ $t('User-interface.Home-page.settings-button') }}
                </button>
            </div>

            <ul class="saved-scoundrels-list" v-if="savedScoundrels.length">
                <scoundrel-card
                    v-for="scoundrel in savedScoundrels"
                    :key="scoundrel.id"
                    :scoundrel="scoundrel"
                    :lastUpdated="getLastUpdated(scoundrel.id)"
                    @click="onClickLoadScoundrel(scoundrel)"
                ></scoundrel-card>
            </ul>

            <label class="scroll-note">
                {{ $t('User-interface.Home-page.scroll-prompt') }}
            </label>
        </div>
        <div class="footer-container">
            <footer>
                <div class="logo-and-olin">
                    <h2>
                        www.scoundry.com
                        <span class="version">v{{ APP_VERSION }}</span>
                    </h2>
                    <p
                        v-html="
                            $t(
                                'User-interface.Home-page.Attribution.code-and-design'
                            )
                        "
                    ></p>
                    <p>
                        <a @click="ModalController.open(NewsModal)">
                            {{
                                $t(
                                    'User-interface.Home-page.Attribution.news-and-updates'
                                )
                            }}
                        </a>
                    </p>
                    <p
                        class="muted"
                        v-html="
                            $t(
                                'User-interface.Home-page.Attribution.copyright',
                                {
                                    year: new Date().getFullYear()
                                }
                            )
                        "
                    ></p>
                </div>
                <div>
                    <p
                        v-html="
                            $t(
                                'User-interface.Home-page.Attribution.license-blades-in-the-dark'
                            )
                        "
                    ></p>
                </div>
                <div>
                    <p
                        v-html="
                            $t(
                                'User-interface.Home-page.Attribution.license-portraits'
                            )
                        "
                    ></p>
                    <p
                        v-html="
                            $t(
                                'User-interface.Home-page.Attribution.license-icons'
                            )
                        "
                    ></p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import NewsModal from '@/components/modals/templates/news-modal.vue';
import SettingsModal from '@/components/modals/templates/settings-modal.vue';
import ScoundrelCard from '@/components/scoundrel-card.vue';
import ModalController from '@/controllers/modal-controller';
import {
    getSavedMetadata,
    getSavedScoundrels,
    Metadata
} from '@/controllers/storage-controller';
import { APP_VERSION } from '@/main';
import { PageName, router } from '@/router';
import { onMounted, ref } from 'vue';
import { Scoundrel } from '../scoundrel';
import ConfirmModal from '@/components/modals/templates/confirm-modal.vue';

const page = ref<HTMLElement | null>(null);
const savedScoundrels = ref<Scoundrel[]>([]);
savedScoundrels.value = getSavedScoundrels().filter(
    (scoundrel: Scoundrel) => !!scoundrel
); // Remove any nulls
const savedMetadata = ref<Metadata[]>(getSavedMetadata()); // Use for timestamps

onMounted(() => {
    fetch('/assets/news.json?_t=' + Date.now())
        .then((response) => response.json())
        .then((data) => {
            const lastNewsIdSeen = localStorage.getItem('lastNewsIdSeen');
            const newsIds = data.map((n: any) => n.id);
            const newestNewsId = newsIds[0].toString();
            if (newestNewsId !== lastNewsIdSeen)
                ModalController.open(NewsModal);
        });
});
async function onClickMakeNewScoundrel() {
    page.value?.classList.remove('page-in');
    page.value?.classList.add('page-out');

    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push({ name: PageName.MAKE });
}

function onClickLoadScoundrel(scoundrel: Scoundrel) {
    router.replace({
        name: PageName.EDIT,
        params: { scoundrelId: scoundrel.id }
    });
}

function getLastUpdated(scoundrelId: string) {
    const metadata = savedMetadata.value!.find((m) => m.id === scoundrelId);
    if (!metadata) return null;
    return new Date(metadata?.lastUpdated);
}
</script>

<style lang="scss" scoped>
.page--home {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: none;
}

.page--home > .page-content {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > .scroll-note {
        position: absolute;
        bottom: 1rem;
    }
}

.page-in {
    animation: pageIn 0.4s ease-out forwards;
}

.page-out {
    animation: pageOut 0.2s ease-out forwards;
    pointer-events: none;
}

h1 {
    position: relative;
    font-family: var(--font-display);
    color: var(--color-on-surface);
    font-size: 12rem;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    text-align: center;
}

h1 + p,
a {
    margin-bottom: 4rem;
    text-align: center;
}

@keyframes pageIn {
    from {
        opacity: 0;
        transform: translateY(1rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pageOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.footer-container {
    width: 100%;
    background-color: var(--color-surface);
    padding: 0.8rem;
    border-top: 1px solid var(--color-surface-lighter);
    box-shadow: var(--shadow-lg);
}

footer {
    max-width: 96rem;
    margin: 0 auto;
    padding: 1.2rem;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    color: var(--color-on-secondary);

    p,
    a {
        font-size: 1.4rem;
        line-height: 1.6;
    }

    > div {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
    }

    > .logo-and-olin {
        h2 {
            font-family: var(--font-display);
            font-size: 2.4rem;
            opacity: 0.4;
            text-transform: uppercase;
        }
    }
}

footer > button {
    display: block;
    margin: 1.2rem auto;
    font-size: 1.2rem;
}

.version {
    font-size: 1.2rem;
    text-transform: none;
}

ul.saved-scoundrels-list {
    margin: 0 auto;
    margin-top: 2.4rem;
    overflow-x: auto;
    max-width: calc(100% - 4rem);
    display: flex;
    gap: 1.2rem;
    padding: 1.2rem;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .controls {
        flex-direction: column;
        gap: 0.8rem;
        width: 100%;
        padding: 0 1.2rem;
    }

    footer {
        grid-template-columns: 1fr;

        // Add lines between sections
        > div:not(:last-child) {
            border-bottom: 1px solid var(--color-surface-lighter);
            padding-bottom: 2rem;
        }
    }

    h1 {
        font-size: 5.2rem;
    }

    h1 + p,
    a {
        font-size: 1.4rem;
    }
}
</style>
