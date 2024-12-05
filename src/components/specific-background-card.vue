<template>
  <div class="specific-background-card">
    <h2>{{ specificBackground.name }}</h2>
    <ul class="action-tags">
      <action-tag
        v-for="action in Object.keys(specificBackground.actions)"
        :key="action"
        :action="action"
        :number="specificBackground.actions[action as Action]"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Action, SpecificBackground } from '@/assets/data/data-types';
import ActionTag from './action-tag.vue';

const props = defineProps<{
  specificBackground: SpecificBackground;
}>();
</script>

<style scoped lang="scss">
.specific-background-card {
  box-shadow: var(--shadow-sm);
  background-color: var(--color-surface);
  border-radius: 5px;
  transition: box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 1.2rem;

  * {
    color: inherit;
  }

  h2 {
    width: 100%;
    text-align: center;
    font-family: var(--font-body);
    font-weight: normal;
    font-size: 1.6rem;
    margin-bottom: 0.8rem;
  }

  p {
    font-size: 1.4rem;
    color: var(--color-on-surface);
  }

  ul.action-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  &.active {
    transition: none;
    color: var(--color-primary);

    h2 {
      width: fit-content;
      text-shadow: var(--shadow-text);
    }
  }
}
</style>
