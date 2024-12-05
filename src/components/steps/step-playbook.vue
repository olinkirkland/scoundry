<template>
  <step-header>
    <h2>Choose a playbook</h2>
    <p>
      Your playbook represents your character's reputation in the underworld,
      their special abilities, and how they advance.
    </p>
  </step-header>
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
import { Action, Playbook } from '@/assets/data/data-types';
import playbooksData from '@/assets/data/playbooks.json';
import { Scoundrel } from '@/scoundrel';
import PlaybookCard from '@/components/playbook-card.vue';
import StepHeader from '@/components/step-header.vue';

const playbooks = playbooksData as unknown as Playbook[];

const props = defineProps<{
  scoundrel: Scoundrel;
}>();

function onClickPlaybook(playbook: Playbook) {
  props.scoundrel.playbook = playbook.slug;

  // Remove all 'playbook' keys from scoundrel.actions
  Object.keys(props.scoundrel.actions).forEach((action) => {
    delete props.scoundrel.actions[action as Action].playbook;
  });

  // Add the new playbook's actions to scoundrel.actions
  Object.keys(playbook.actions).forEach((action) => {
    const modifier = playbook.actions[action as Action];
    props.scoundrel.actions[action as Action].playbook = modifier;
  });
}
</script>

<style scoped lang="scss">
.playbook-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
  gap: 1.2rem;
  margin-bottom: 1.2rem;
  padding: 1.2rem;
}
</style>
