<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h3>{{ $t('User-interface.Modals.Settings.title') }}</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="settings">
                <!-- Select Language -->
                <section>
                    <label>
                        {{
                            $t('User-interface.Modals.Settings.Language.label')
                        }}
                    </label>
                    <div class="languages">
                        <button
                            v-for="language in languages"
                            @click="changeLanguage(language)"
                            class="flag"
                            :class="{
                                selected: useI18n().locale.value === language,
                            }"
                        >
                            <img :src="`/assets/icons/flag-${language}.png`" />
                            <span>{{
                                $t(
                                    `User-interface.Modals.Settings.Language.Languages.${language}`
                                )
                            }}</span>
                        </button>
                    </div>
                </section>
                <section>
                    <!-- Enable Tracking -->
                    <label for="settingEnableTracking">
                        {{
                            $t('User-interface.Modals.Settings.Tracking.label')
                        }}
                    </label>
                    <div class="checkbox-group">
                        <input
                            type="checkbox"
                            id="settingEnableTracking"
                            @change="onChangeEnableTracking"
                            v-model="isTrackingEnabled"
                        />
                        <label for="settingEnableTracking">
                            {{
                                $t(
                                    'User-interface.Modals.Settings.Tracking.description'
                                )
                            }}
                        </label>
                    </div>
                </section>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { changeLanguage } from '@/i18n/locale';
import { startTracking, stopTracking } from '@/tracker';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const languages = ['en', 'es'];

const isTrackingEnabled = ref(
    localStorage.getItem('enableTracking') === 'true'
);

function onChangeEnableTracking(e: any) {
    const allowTracking = e.target.checked;
    localStorage.setItem('enableTracking', allowTracking.toString());
    if (allowTracking) startTracking();
    else stopTracking();
}
</script>

<style scoped lang="scss">
.settings {
    display: flex;
    max-width: 64rem;
    flex-direction: column;
    gap: 1.6rem;
    height: 100%;
}

section {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    border-radius: 5px;
    padding: 1.2rem;
    background-color: rgba(0, 0, 0, 0.2);
}

.languages {
    display: flex;
    gap: 1rem;

    button.flag {
        background-color: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 1.2rem;
        border-radius: 5px;
        border: 1px solid transparent;
        gap: 0.2rem;

        &.selected {
            background-color: rgba(0, 0, 0, 0.2);
        }

        &:active {
            filter: brightness(0.8);
        }

        img {
            width: 3.2rem;
            height: 3.2rem;
        }
    }
}

@media (max-width: 768px) {
    .settings {
        min-width: unset;

        .languages {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
        }
    }
}
</style>
