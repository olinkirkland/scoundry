<template>
    <step-header>
        <h2>What are your origins?</h2>
        <p>Pick a heritage and write a detail specific to you.</p>
    </step-header>
    <div class="list-container-frame">
        <div class="list-container">
            <ul class="heritages-list">
                <trait-card
                    v-for="heritage in heritages"
                    :key="heritage.id"
                    :trait="heritage"
                    :selected="heritage.id === scoundrel.heritage"
                    @click="onClickHeritage(heritage)"
                />
            </ul>
        </div>
    </div>
    <p v-if="selectedHeritage" class="description">
        {{ selectedHeritage.description }}
    </p>
    <p v-else class="description">
        Select a heritage to see its description and suggested details.
    </p>
    <section v-if="scoundrel.heritage" class="selected-heritage">
        <div class="input-block">
            <label>A detail about your heritage</label>
            <input type="text" v-model="scoundrel.heritageDetail" />
        </div>

        <ul class="heritage-details-list">
            <trait-detail-card
                v-for="detail in filteredHeritageDetails"
                :key="detail.id"
                :selected="detail.label === scoundrel.heritageDetail"
                :traitDetail="detail"
                @click="onClickHeritageDetail(detail)"
            />
        </ul>

        <p class="reference">
            Full descriptions of these heritages can be found in the
            <a href="https://johnharper.itch.io/deep-cuts" target="_blank"
                >Deep Cuts</a
            >
            Blades in the Dark expansion.
        </p>
    </section>
</template>

<script setup lang="ts">
import { Trait, TraitDetail } from '@/assets/data/data-types';
import heritageDetailsData from '@/assets/data/heritage-details.json';
import heritagesData from '@/assets/data/heritages.json';
import StepHeader from '@/components/step-header.vue';
import TraitCard from '@/components/trait-card.vue';
import { Scoundrel } from '@/scoundrel';
import { computed } from 'vue';
import TraitDetailCard from '../trait-detail-card.vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const heritages = heritagesData as unknown as Trait[];
const heritageDetails = heritageDetailsData as unknown as TraitDetail[];

const selectedHeritage = computed(() =>
    heritages.find((b) => b.id === props.scoundrel.heritage)
);

const filteredHeritageDetails = computed(() => {
    if (!selectedHeritage.value) return [];
    let heritageDetailsFilter = selectedHeritage.value.id;
    return heritageDetails.filter(
        (heritageDetail) =>
            heritageDetail.trait === heritageDetailsFilter ||
            !heritageDetail.trait
    );
});

function onClickHeritage(heritage: Trait) {
    // Choose the heritage, and clear the heritage detail
    props.scoundrel.heritage = heritage.id;
    props.scoundrel.heritageDetail = '';
}

function onClickHeritageDetail(heritageDetail: TraitDetail) {
    // Set the heritage detail to empty if it's already selected
    if (props.scoundrel.heritageDetail === heritageDetail.label) {
        props.scoundrel.heritageDetail = '';
        return;
    }

    // Choose the heritage detail
    props.scoundrel.heritageDetail = heritageDetail.label;
}
</script>

<style scoped lang="scss">
.list-container-frame {
    display: flex;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 1rem !important;
    > .list-container {
        border-radius: 5px;
        display: flex;
        justify-content: center;
        margin: 0 1.2rem;
        overflow: hidden;
        > ul.heritages-list {
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

section.selected-heritage {
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
}

ul.heritage-details-list {
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
    ul.heritages-list {
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
