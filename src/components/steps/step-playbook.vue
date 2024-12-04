<template>
  <div class="header">
    <h2>Choose a playbook</h2>
    <p>
      Your playbook represents your character's reputation in the underworld,
      their special abilities, and how they advance.
    </p>
  </div>
  <ul class="playbook-list">
    <playbook-card
      v-for="playbook in playbooks"
      :key="playbook.slug"
      :playbook="playbook"
      :class="{ active: playbook.slug === scoundrel.playbook }"
      @click="onClickPlaybook(playbook)"
    />
  </ul>
</template>

<script setup lang="ts">
import { Playbook } from '@/assets/data/data-types';
import playbooksData from '@/assets/data/playbooks.json';
import { Scoundrel } from '@/scoundrel';
import PlaybookCard from '../playbook-card.vue';

const playbooks = playbooksData as unknown as Playbook[];

const props = defineProps<{
  scoundrel: Scoundrel;
}>();

function onClickPlaybook(playbook: Playbook) {
  props.scoundrel.playbook = playbook.slug;
}
</script>

<style scoped lang="scss">
.playbook-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.2rem;
  padding: 1.2rem;
}
</style>
