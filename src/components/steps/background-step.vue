<template>
    <step-header>
        <h2 v-html="$t('User-interface.Steps.Background.title')"></h2>
        <p v-html="$t('User-interface.Steps.Background.subtitle')"></p>
    </step-header>
    <div class="list-container-frame">
        <div class="list-container">
            <ul class="backgrounds-list">
                <trait-card
                    v-for="background in backgrounds"
                    :key="background"
                    :label="
                        useI18n().t(
                            `Backgrounds.${capitalize(background)}.label`
                        )
                    "
                    :selected="background === scoundrel.background"
                    @click="onClickBackground(background)"
                />
            </ul>
        </div>
    </div>

    <p v-if="selectedBackground" class="description">
        {{ $t(`Backgrounds.${capitalize(selectedBackground)}.tagline`) }}
    </p>
    <p
        v-else
        class="description"
        v-html="$t('User-interface.Steps.Background.select-prompt')"
    ></p>

    <section v-if="scoundrel.background" class="selected-background">
        <div class="input-block">
            <label>
                {{ $t('User-interface.Steps.Background.detail-prompt') }}
            </label>
            <input type="text" v-model="scoundrel.backgroundDetail" />
        </div>

        <ul class="background-details-list">
            <trait-detail-card
                v-for="detail in filteredBackgroundDetails"
                :key="detail.id"
                :label="useI18n().t(`Background-suggestions.${detail.id}`)"
                :selected="
                    useI18n().t(`Background-suggestions.${detail.id}`) ===
                    scoundrel.backgroundDetail
                "
                :traitDetail="detail"
                @click="onClickBackgroundDetail(detail)"
            />
        </ul>

        <p
            class="reference"
            v-html="$t('User-interface.Steps.Background.deep-cuts-tagline')"
        ></p>
    </section>
</template>

<script setup lang="ts">
import backgroundDetailsData from '@/assets/data/background-suggestions.json';
import backgrounds from '@/assets/data/backgrounds.json';
import { TraitDetail } from '@/assets/data/data-types';
import StepHeader from '@/components/step-header.vue';
import TraitCard from '@/components/trait-card.vue';
import i18n from '@/i18n/locale';
import { Scoundrel } from '@/scoundrel';
import { capitalize } from '@/util/string-util';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TraitDetailCard from '../trait-detail-card.vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const backgroundDetails = backgroundDetailsData as unknown as TraitDetail[];

const selectedBackground = computed(() =>
    backgrounds.find((b) => b === props.scoundrel.background)
);

const filteredBackgroundDetails = computed(() => {
    if (!selectedBackground.value) return [];
    let backgroundDetailsFilter = selectedBackground.value;

    // Law and military are grouped together in the data
    if (['law', 'military'].includes(selectedBackground.value))
        backgroundDetailsFilter = 'law-and-military';

    return backgroundDetails.filter(
        (backgroundDetail) =>
            backgroundDetail.trait === backgroundDetailsFilter ||
            !backgroundDetail.trait
    );
});

function onClickBackground(background: string) {
    // Choose the background, and clear the background detail
    props.scoundrel.background = background;
    props.scoundrel.backgroundDetail = '';
}

function onClickBackgroundDetail(backgroundDetail: TraitDetail) {
    const label = i18n.global.t(
        `Background-suggestions.${backgroundDetail.id}`
    );

    // Set the background detail to empty if it's already selected
    if (props.scoundrel.backgroundDetail === label) {
        props.scoundrel.backgroundDetail = '';
        return;
    }

    // Choose the background detail
    props.scoundrel.backgroundDetail = label;
}
</script>

<style scoped lang="scss">
.list-container-frame {
    display: flex;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 1rem !important;
    > .list-container {
        display: flex;
        justify-content: center;
        margin: 0 1.2rem;
        overflow: hidden;
        > ul.backgrounds-list {
            display: flex;
            width: fit-content;
            margin: 0 auto;
            gap: 0.4rem;
        }
    }
}

p.description {
    text-align: center;
    width: 100%;
    opacity: 0.8;
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
    max-width: 64rem;
}

input {
    margin-bottom: 1.2rem;
}

section.selected-background {
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
}

ul.background-details-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
    grid-auto-rows: 1fr;
    gap: 0.4rem;
}

p.reference {
    margin: 0.8rem;
    text-align: center;
}

@media (max-width: 1024px) {
    ul.backgrounds-list {
        overflow-x: auto;
        scrollbar-width: none;
    }
}

@media (max-width: 768px) {
    p.description {
        text-align: left;
    }
}
</style>
