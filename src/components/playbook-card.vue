<template>
  <div class="playbook-card">
    <h1>{{ playbook.name }}</h1>
    <p class="tagline">{{ playbook.tagline }}</p>
    <p class="description">{{ playbook.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { Playbook } from '@/assets/data/data-types';

const props = defineProps<{
  playbook: Playbook;
}>();
</script>

<style scoped lang="scss">
.playbook-card {
  box-shadow: var(--shadow-sm);
  padding: 1.6rem;
  background-color: var(--color-surface);
  transition: box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;

  * {
    color: inherit;
  }

  h1 {
    font-family: var(--font-family-logo);
    font-size: 4.8rem;
  }

  p.tagline {
    font-size: 1.4rem;
    text-align: center;
    font-style: italic;
  }

  p.description

  &:hover {
    box-shadow: var(--shadow-md);
  }

  &.active {
    transition: none;
    color: var(--color-primary);
    background-color: transparent;
    box-shadow: none !important;
  }
}

@media (max-width: 768px) {
  .playbook-card {
    h1 {
      font-size: 3.2rem;
    }
  }
}
</style>
