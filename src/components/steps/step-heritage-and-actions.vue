<template>
  <step-header>
    <h2>Choose your heritage</h2>
    <p>
      Your character's heritage describes their origins, and their action dots
      describe their strengths.
    </p>
  </step-header>
</template>

<script setup lang="ts">
import StepHeader from '@/components/step-header.vue';
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
</style>
