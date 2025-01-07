<template>
    <div class="page page--home page-in" ref="page">
        <div class="page-content">
            <h1>Scoundry</h1>
            <p>
                A character keeper for
                <a href="https://bladesinthedark.com/" target="_blank"
                    >Blades in the Dark</a
                >
            </p>

            <div class="row center">
                <div class="minis">
                    <button
                        class="btn btn--mini"
                        @click="ModalController.open(LanguageModal)"
                    >
                        <img
                            :src="`/assets/icons/flag-${useI18n().locale.value}.png`"
                        />
                    </button>
                    <button
                        class="btn btn--mini"
                        @click="ModalController.open(SettingsModal)"
                    >
                        <img src="/assets/icons/gear.png" />
                    </button>
                </div>

                <button class="btn" @click="onClickMakeNewScoundrel">
                    <span>Make a new Scoundrel</span>
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

            <label class="scroll-note">Scroll down to see attribution</label>
        </div>
        <div class="footer-container">
            <footer>
                <div class="logo-and-olin">
                    <h2>
                        www.scoundry.com
                        <span class="version">v{{ APP_VERSION }}</span>
                    </h2>
                    <p>
                        Code & design by
                        <a href="https://olinkirk.land" target="_blank"
                            >Olin Kirkland</a
                        >
                    </p>
                    <p>
                        <a @click="ModalController.open(NewsModal)"
                            >News & Updates</a
                        >
                    </p>
                    <p class="muted">
                        Copyright © {{ new Date().getFullYear() }} Olin
                        Kirkland
                    </p>
                </div>
                <div>
                    <p>
                        This work is based on
                        <a
                            href="http://www.bladesinthedark.com/"
                            target="_blank"
                            >Blades in the Dark</a
                        >
                        — a product of One Seven Design, developed and authored
                        by John Harper, and licensed for our use under the
                        <a
                            href="http://creativecommons.org/licenses/by/3.0"
                            target="_blank"
                            >Creative Commons Attribution 3.0 license</a
                        >
                    </p>
                </div>
                <div>
                    <p>
                        Portrait images are from
                        <a
                            href="https://guides.loc.gov/p-and-p-rights-and-restrictions/risk-assessment"
                            target="_blank"
                            >The Library of Congress</a
                        >
                        with no known restrictions their use.
                    </p>
                    <p>
                        Icons are from
                        <a href="https://icons8.com" target="_blank"
                            >Icons8.com</a
                        >
                    </p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script setup lang="ts">
import NewsModal from '@/components/modals/templates/news-modal.vue';
import ScoundrelCard from '@/components/scoundrel-card.vue';
import ModalController from '@/controllers/modal-controller';
import {
    getSavedMetadata,
    getSavedScoundrels,
    Metadata,
} from '@/controllers/storage-controller';
import { APP_VERSION } from '@/main';
import { PageName, router } from '@/router';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Scoundrel } from '../scoundrel';
import LanguageModal from '@/components/modals/templates/language-modal.vue';
import SettingsModal from '@/components/modals/templates/settings-modal.vue';

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
        params: { scoundrelId: scoundrel.id },
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

.minis {
    display: flex;
    gap: 0.4rem;
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

    .row {
        flex-direction: column;
    }
}
</style>
