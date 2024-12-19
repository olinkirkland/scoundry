<template>
    <step-header>
        <h2>Choose your vice</h2>
        <p>
            Every scoundrel is in thrall to some vice or another, which they
            indulge to deal with stress. Record the name and location of your
            vice purveyor.
        </p>
    </step-header>
    <div class="list-container-frame">
        <div class="list-container">
            <ul class="vices-list">
                <trait-card
                    v-for="vice in vices"
                    :key="vice.id"
                    :trait="vice"
                    :selected="vice.id === scoundrel.vice"
                    @click="onClickVice(vice)"
                />
            </ul>
        </div>
    </div>

    <p v-if="selectedVice" class="description">
        {{ selectedVice.description }}
    </p>
    <p v-else class="description">
        Select a vice to see its description and suggested purveyors.
    </p>
    <section v-if="scoundrel.vice" class="selected-vice">
        <div class="input-block">
            <label>A description of where you go to indulge</label>
            <input type="text" v-model="scoundrel.viceDetail" />
        </div>

        <ul class="vice-details-list">
            <li
                v-for="detail in filteredViceDetails"
                :key="detail.id"
                class="vice-detail"
                :class="{ selected: detail.label === scoundrel.viceDetail }"
                @click="onClickViceDetail(detail)"
            >
                <h2>{{ detail.name }}</h2>
                <p v-if="detail.description">{{ detail.description }}</p>
                <label v-if="detail.district">{{ detail.district }}</label>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import viceDetailsData from '@/assets/data/vice-details.json';
import vicesData from '@/assets/data/vices.json';
import { Trait, Address } from '@/assets/data/data-types';
import StepHeader from '@/components/step-header.vue';
import TraitCard from '@/components/trait-card.vue';
import { Scoundrel } from '@/scoundrel';
import { computed } from 'vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const vices = vicesData as unknown as Trait[];
const viceDetails = viceDetailsData as unknown as Address[];

const selectedVice = computed(() =>
    vices.find((b) => b.id === props.scoundrel.vice)
);

const filteredViceDetails = computed(() => {
    if (!selectedVice.value) return [];
    let viceDetailsFilter = selectedVice.value.id;

    return viceDetails.filter(
        (viceDetail) =>
            !viceDetail.trait ||
            viceDetail.trait === viceDetailsFilter ||
            viceDetail.trait.includes(viceDetailsFilter)
    );
});

function onClickVice(vice: Trait) {
    // Choose the vice, and clear the vice detail
    props.scoundrel.vice = vice.id;
    props.scoundrel.viceDetail = '';
}

function onClickViceDetail(viceDetail: Address) {
    // Set the vice detail to empty if it's already selected
    if (props.scoundrel.viceDetail === viceDetail.label) {
        props.scoundrel.viceDetail = '';
        return;
    }

    // Choose the vice detail
    props.scoundrel.viceDetail = viceDetail.label;
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
        > ul.vices-list {
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

section.selected-vice {
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
}

ul.vice-details-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
    grid-auto-rows: 1fr;
    gap: 0.4rem;
}

ul.vice-details-list > li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    background-color: var(--color-surface);

    > h2 {
        font-size: 1.6rem;
    }

    &.selected {
        background-color: transparent;
        > * {
            color: var(--color-primary);
        }
    }
}

p.reference {
    margin: 0.8rem;
    text-align: center;
}

@media (max-width: 1024px) {
    ul.vices-list {
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
