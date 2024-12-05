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
    {{ backgrounds.find((b) => b.slug === scoundrel.background)?.description }}
  </p>
  <p v-else class="description">
    Select a background to see its description and specializations.
  </p>
  <section v-if="scoundrel.background" class="selected-background">
    <ul class="specific-backgrounds-list">
      <specific-background-card
        v-for="specificBackground in filteredSpecificBackgrounds"
        :key="specificBackground.name"
        :specificBackground="specificBackground"
      />
    </ul>
  </section>
</template>

<script setup lang="ts">
import specificBackgroundsData from '@/assets/data/backgrounds-specific.json';
import backgroundsData from '@/assets/data/backgrounds.json';
import { Background, SpecificBackground } from '@/assets/data/data-types';
import BackgroundCard from '@/components/background-card.vue';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import SpecificBackgroundCard from '../specific-background-card.vue';
import { computed } from 'vue';

const backgrounds = backgroundsData as unknown as Background[];
const specificBackgrounds =
  specificBackgroundsData as unknown as SpecificBackground[];

const props = defineProps<{
  scoundrel: Scoundrel;
}>();

const filteredSpecificBackgrounds = computed(() => {
  let filterCategory = props.scoundrel.background;
  if (['law', 'military'].includes(filterCategory))
    filterCategory = 'law-and-military';

  return specificBackgrounds.filter(
    (specificBackground) => specificBackground.category === filterCategory
  );
});

function onClickBackground(background: Background) {
  props.scoundrel.background = background.slug;
}
</script>

<style scoped lang="scss">
ul.backgrounds-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  width: fit-content;

  gap: 1.2rem;
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

section.selected-background {
  padding: 0 1.2rem;
  margin-bottom: 1.2rem;
}

ul.specific-backgrounds-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
  grid-auto-rows: 1fr;
  gap: 0.2rem;
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
      text-align: left;
    }
  }
}

@media (max-width: 768px) {
  ul.specific-backgrounds-list {
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  }
}
</style>
