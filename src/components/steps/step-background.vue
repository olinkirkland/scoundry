<template>
    <step-header>
        <h2>Choose a background</h2>
        <p>Describe what your character did before they joined the crew.</p>
    </step-header>
    <ul class="backgrounds-list">
        <background-card
            v-for="background in backgrounds"
            :key="background.slug"
            :background="background"
            :class="{ active: background.slug === scoundrel.background }"
            @click="onClickBackground(background)"
        />
    </ul>
    <p v-if="scoundrel.background" class="description">
        {{
            backgrounds.find((b) => b.slug === scoundrel.background)
                ?.description
        }}
    </p>
    <p v-else class="description">
        Select a background to see its description and specializations.
    </p>
    <section v-if="scoundrel.background" class="selected-background">
        <ul class="specific-backgrounds-list">
            <specific-background-card
                v-for="specificBackground in filteredSpecificBackgrounds"
                :key="specificBackground.name"
                :class="{
                    active:
                        specificBackground.slug ===
                        scoundrel.backgroundSpecialization,
                }"
                :specificBackground="specificBackground"
                @click="onClickSpecificBackground(specificBackground)"
            />
        </ul>
    </section>
</template>

<script setup lang="ts">
import specificBackgroundsData from '@/assets/data/backgrounds-specific.json'
import backgroundsData from '@/assets/data/backgrounds.json'
import {
    Action,
    Background,
    SpecificBackground,
} from '@/assets/data/data-types'
import BackgroundCard from '@/components/background-card.vue'
import StepHeader from '@/components/step-header.vue'
import { Scoundrel } from '@/scoundrel'
import { computed } from 'vue'
import SpecificBackgroundCard from '../specific-background-card.vue'

const backgrounds = backgroundsData as unknown as Background[]
const specificBackgrounds =
    specificBackgroundsData as unknown as SpecificBackground[]

const props = defineProps<{
    scoundrel: Scoundrel
}>()

const filteredSpecificBackgrounds = computed(() => {
    let filterCategory = props.scoundrel.background
    if (['law', 'military'].includes(filterCategory))
        filterCategory = 'law-and-military'

    return specificBackgrounds.filter(
        (specificBackground) => specificBackground.category === filterCategory
    )
})

function onClickBackground(background: Background) {
    props.scoundrel.background = background.slug
    props.scoundrel.backgroundSpecialization = ''
    // Remove all 'background' keys from scoundrel.actions
    Object.keys(props.scoundrel.actions).forEach((action) => {
        delete props.scoundrel.actions[action as Action].background
    })
}

function onClickSpecificBackground(specificBackground: SpecificBackground) {
    // Remove all 'background' keys from scoundrel.actions
    Object.keys(props.scoundrel.actions).forEach((action) => {
        delete props.scoundrel.actions[action as Action].background
    })

    if (props.scoundrel.backgroundSpecialization === specificBackground.slug) {
        props.scoundrel.backgroundSpecialization = ''
        return
    }

    props.scoundrel.backgroundSpecialization = specificBackground.slug

    // Add the new actions
    for (const action of Object.keys(specificBackground.actions))
        props.scoundrel.actions[action as Action]['background'] =
            specificBackground.actions[action as Action]
}
</script>

<style scoped lang="scss">
ul.backgrounds-list {
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
    margin-bottom: 1.2rem;
    max-width: 48rem;
}

section.selected-background {
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
}

ul.specific-backgrounds-list {
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
