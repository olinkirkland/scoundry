<template>
  <div class="playbook-card">
    <h2>{{ playbook.name }}</h2>
    <p class="tagline">{{ playbook.tagline }}</p>
    <ul class="action-tags">
      <action-tag
        v-for="action in Object.keys(playbook.actions)"
        :key="action"
        :action="action"
        :number="playbook.actions[action as Action]"
      />
    </ul>
    <p class="description">{{ playbook.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { Action, Playbook } from '@/assets/data/data-types';
import ActionTag from './action-tag.vue';

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

  h2 {
    font-family: var(--font-display);
    text-transform: uppercase;
    font-size: 6.4rem;
  }

  p.tagline {
    font-size: 1.2rem;
    text-align: center;
    font-style: italic;
  }

  p.description &:hover {
    box-shadow: var(--shadow-md);
  }

  &.active {
    transition: none;
    color: var(--color-primary);
    background-color: transparent;
    box-shadow: none !important;

    h2 {
      text-shadow: var(--shadow-text);
    }

    :deep(.action-tag) {
      border: 1px solid var(--color-primary) !important;
      background-color: transparent !important;

      ul.circles-list {
        > li::before {
          background-color: var(--color-surface-lighter);
        }
        > li::after {
          background-color: var(--color-primary);
        }
      }
    }
  }
}

.action-tags {
  display: flex;
  gap: 1.2rem;
  padding-top: 1.2rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .playbook-card {
    h1 {
      font-size: 3.2rem;
    }
  }
}
</style>
