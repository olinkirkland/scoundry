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
  <section v-if="scoundrel.background" class="selected-background">
    <p class="description">
      {{
        backgrounds.find((b) => b.slug === scoundrel.background)?.description
      }}
    </p>
  </section>
</template>

<script setup lang="ts">
import backgroundsData from '@/assets/data/backgrounds.json';
import { Background } from '@/assets/data/data-types';
import BackgroundCard from '@/components/background-card.vue';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';

const backgrounds = backgroundsData as unknown as Background[];

const props = defineProps<{
  scoundrel: Scoundrel;
}>();

function onClickBackground(background: Background) {
  props.scoundrel.background = background.slug;
}
</script>

<style scoped lang="scss">
.backgrounds-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  width: fit-content;

  gap: 1.2rem;
  margin-bottom: 1.2rem;
  padding: 1.2rem;
}

section.selected-background {
  padding: 0 1.2rem;
  margin-bottom: 1.2rem;

  p.description {
    text-align: center;
    font-style: italic;
    opacity: 0.8;
    font-size: 1.4rem;
  }
}

@media (max-width: 1024px) {
  .backgrounds-list {
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
</style>
