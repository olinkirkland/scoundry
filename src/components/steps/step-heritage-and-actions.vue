<template>
    <step-header>
        <h2>Choose your heritage</h2>
        <p>
            Your character's heritage describes their origins and family line.
        </p>
    </step-header>
    <ul class="heritages-list">
        <heritage-card
            v-for="heritage in heritages"
            :key="heritage.slug"
            :heritage="heritage"
            :class="{ active: heritage.slug === scoundrel.heritage }"
            @click="onClickHeritage(heritage)"
        />
    </ul>
    <section v-if="scoundrel.heritage" class="selected-heritage">
        <p class="description">
            {{
                heritages.find((h) => h.slug === scoundrel.heritage)
                    ?.description
            }}
        </p>

        <label for="heritageSpecialization">A note about your heritage</label>
        <input
            id="heritageSpecialization"
            class="input-heritage-detail"
            type="text"
            v-model="scoundrel.heritageSpecialization"
        />

        <label>Suggestions (click to apply)</label>
        <ul class="specific-heritages">
            <li
                v-for="specificHeritage in specificHeritages"
                :key="specificHeritage.name"
                @click="onClickSpecificHeritage(specificHeritage.name)"
                :class="{
                    active:
                        specificHeritage.name ===
                        scoundrel.heritageSpecialization,
                }"
            >
                <p>{{ specificHeritage.name }}</p>
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import { Heritage, SpecificHeritage } from '@/assets/data/data-types';
import specificHeritagesData from '@/assets/data/heritages-specific.json';
import heritagesData from '@/assets/data/heritages.json';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import { computed } from 'vue';
import HeritageCard from '../heritage-card.vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const heritages = heritagesData as unknown as Heritage[];
const specificHeritages = computed(() => {
    const allSpecificHeritages =
        specificHeritagesData as unknown as SpecificHeritage[];
    return allSpecificHeritages.filter(
        (sh) =>
            sh.category === props.scoundrel.heritage || sh.category === 'any'
    );
});

function onClickHeritage(heritage: Heritage) {
    props.scoundrel.heritage = heritage.slug;
    // Put the caret at the end of the input
    const input = document.querySelector('input');
    input?.focus();
}

function onClickSpecificHeritage(specificHeritage: string) {
    props.scoundrel.heritageSpecialization = specificHeritage;
    // Put the caret at the end of the input
    const input = document.querySelector('input');
    input?.focus();
}
</script>

<style scoped lang="scss">
ul.heritages-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    width: fit-content;
    gap: 0.4rem;
    padding: 1.2rem;
}

p.description {
    text-align: center;
    width: 100%;
    opacity: 0.8;
    font-size: 1.2rem;
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
        width: 100%;
        justify-content: flex-start;
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
