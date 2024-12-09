<template>
    <step-header>
        <h2>What did you do before you joined the crew?</h2>
        <p>Pick a background and write a detail specific to you.</p>
    </step-header>
    <div class="list-container">
        <ul class="backgrounds-list">
            <trait-card
                v-for="background in backgrounds"
                :key="background.id"
                :trait="background"
                :selected="background.id === scoundrel.background"
                @click="onClickBackground(background)"
            />
        </ul>
    </div>
    <p v-if="selectedBackground" class="description">
        {{ selectedBackground.description }}
    </p>
    <p v-else class="description">
        Select a background to see its description and suggested details.
    </p>
    <section v-if="scoundrel.background" class="selected-background">
        <div class="input-block">
            <label>A detail about your background</label>
            <input type="text" v-model="scoundrel.backgroundDetail" />
        </div>

        <ul class="background-details-list">
            <trait-detail-card
                v-for="detail in filteredBackgroundDetails"
                :key="detail.id"
                :selected="detail.label === scoundrel.backgroundDetail"
                :traitDetail="detail"
                @click="onClickBackgroundDetail(detail)"
            />
        </ul>
    </section>
</template>

<script setup lang="ts">
import backgroundDetailsData from '@/assets/data/background-details.json';
import backgroundsData from '@/assets/data/backgrounds.json';
import { Trait, TraitDetail } from '@/assets/data/data-types';
import StepHeader from '@/components/step-header.vue';
import TraitCard from '@/components/trait-card.vue';
import { Scoundrel } from '@/scoundrel';
import { computed } from 'vue';
import TraitDetailCard from '../trait-detail-card.vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const backgrounds = backgroundsData as unknown as Trait[];
const backgroundDetails = backgroundDetailsData as unknown as TraitDetail[];

const selectedBackground = computed(() =>
    backgrounds.find((b) => b.id === props.scoundrel.background)
);

const filteredBackgroundDetails = computed(() => {
    if (!selectedBackground.value) return [];
    let backgroundDetailsFilter = selectedBackground.value.id;

    // Law and military are grouped together in the data
    if (['law', 'military'].includes(selectedBackground.value.id))
        backgroundDetailsFilter = 'law-and-military';

    return backgroundDetails.filter(
        (backgroundDetail) =>
            backgroundDetail.trait === backgroundDetailsFilter ||
            !backgroundDetail.trait
    );
});

function onClickBackground(background: Trait) {
    // Choose the background, and clear the background detail
    props.scoundrel.background = background.id;
    props.scoundrel.backgroundDetail = '';
}

function onClickBackgroundDetail(backgroundDetail: TraitDetail) {
    // Set the background detail to empty if it's already selected
    if (props.scoundrel.backgroundDetail === backgroundDetail.label) {
        props.scoundrel.backgroundDetail = '';
        return;
    }

    // Choose the background detail
    props.scoundrel.backgroundDetail = backgroundDetail.label;
}
</script>

<style scoped lang="scss">
.step-container > .list-container {
    display: flex;
    justify-content: center;
    margin: 1.2rem auto;
    border-radius: 5px;
    overflow: hidden;
    max-width: calc(100% - 2.4rem);
}

ul.backgrounds-list {
    display: flex;
    gap: 0.4rem;
}

p.description {
    text-align: center;
    width: 100%;
    opacity: 0.8;
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
    max-width: 48rem;
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

@media (max-width: 1024px) {
    ul.backgrounds-list {
        width: 100%;
        justify-content: flex-start;
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
    }

    section.selected-background {
        p.description {
            max-width: 100%;
            text-align: left;
        }
    }
}
</style>
