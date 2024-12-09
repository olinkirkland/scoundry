<template>
    <step-header>
        <h2>What are your origins?</h2>
        <p>Pick a heritage and write a detail specific to you.</p>
    </step-header>
    <div class="list-container">
        <ul class="heritages-list">
            <heritage-card
                v-for="heritage in heritages"
                :key="heritage.id"
                :heritage="heritage"
                :class="{ active: heritage.id === scoundrel.heritage }"
                @click="onClickHeritage(heritage)"
            />
        </ul>
    </div>
    <section v-if="scoundrel.heritage" class="selected-heritage">
        <p class="description">
            {{
                heritages.find((h) => h.id === scoundrel.heritage)?.description
            }}
        </p>

        <label for="heritageSpecialization">A note about your heritage</label>
        <input
            id="heritageSpecialization"
            class="input-heritage-detail"
            type="text"
            v-model="scoundrel.backgroundDetail"
        />

        <label>Suggestions (click to apply)</label>
        <ul class="specific-heritages">
            <li
                v-for="specificHeritage in heritageDetails"
                :key="specificHeritage.label"
                @click="onClickSpecificHeritage(specificHeritage.label)"
                :class="{
                    active: specificHeritage.label === scoundrel.backgroundDetail,
                }"
            >
                <p>{{ specificHeritage.label }}</p>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { Trait, TraitDetail } from '@/assets/data/data-types';
import specificHeritagesData from '@/assets/data/heritage-details.json';
import heritagesData from '@/assets/data/heritages.json';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import { computed } from 'vue';
import HeritageCard from '../heritage-card.vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const heritages = heritagesData as unknown as Trait[];
const heritageDetails = computed(() => {
    const allSpecificHeritages =
        specificHeritagesData as unknown as TraitDetail[];
    return allSpecificHeritages.filter(
        (sh) => sh.trait === props.scoundrel.heritage || sh.trait === 'any'
    );
});

function onClickHeritage(heritage: Trait) {
    props.scoundrel.heritage = heritage.id;
    // Put the caret at the end of the input
    const input = document.querySelector('input');
    input?.focus();
}

function onClickSpecificHeritage(specificHeritage: string) {
    props.scoundrel.backgroundDetail = specificHeritage;
    // Put the caret at the end of the input
    const input = document.querySelector('input');
    input?.focus();
    // Scroll the input into view
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

ul.heritages-list {
    display: flex;
    gap: 0.4rem;
}

p.description {
    text-align: center;
    width: 100%;
    opacity: 0.8;
    padding: 0 1.2rem;
    margin: 0 auto;
    margin-bottom: 1.2rem;
    max-width: 48rem;
}

section.selected-heritage {
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

input.input-heritage-detail {
    max-width: 48rem;
    margin-bottom: 2rem;
}

pre {
    width: 100%;
}

ul.specific-heritages {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 0.4rem;

    li {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1.2rem;
        background-color: var(--color-surface);
        border-radius: 5px;
        cursor: pointer;
        box-shadow: none;
        transition: box-shadow 0.4s;
        text-align: center;
        height: 8rem;

        &:hover {
            box-shadow: var(--shadow-sm);
        }

        &.active {
            box-shadow: none;
            background-color: transparent;
            p {
                color: var(--color-primary) !important;
            }
        }
    }
}

@media (max-width: 1024px) {
    ul.heritages-list {
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none;
    }

    section.selected-heritage {
        p.description {
            max-width: 100%;
            text-align: left;
        }
    }
}
</style>
