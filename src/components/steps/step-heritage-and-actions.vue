<template>
    <step-header>
        <h2>Choose your heritage</h2>
        <p>
            Your character's heritage describes their origins, and their action
            dots describe their strengths.
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
</template>

<script setup lang="ts">
import { Heritage } from '@/assets/data/data-types'
import heritagesData from '@/assets/data/heritages.json'
import StepHeader from '@/components/step-header.vue'
import { Scoundrel } from '@/scoundrel'
import HeritageCard from '../heritage-card.vue'

const heritages = heritagesData as unknown as Heritage[]

const props = defineProps<{
    scoundrel: Scoundrel
}>()

const onClickHeritage = (heritage: Heritage) => {
    props.scoundrel.heritage = heritage.slug
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
    font-style: italic;
    width: 100%;
    opacity: 0.8;
    font-size: 1.4rem;
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
}

section.selected-heritage {
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
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
            text-align: left;
        }
    }
}
</style>
