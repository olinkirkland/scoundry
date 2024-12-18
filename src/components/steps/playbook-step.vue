<template>
    <step-header>
        <h2>What kind of <strong>scoundrel</strong> are you?</h2>
        <p>
            Your playbook represents your character's reputation in the
            underworld, their special abilities, and how they advance.
        </p>
    </step-header>
    <ul class="playbook-list">
        <playbook-card
            v-for="playbook in playbooks"
            :key="playbook.id"
            :playbook="playbook"
            :class="{ active: playbook.id === scoundrel.playbook }"
            @click="onClickPlaybook(playbook)"
        />
    </ul>
</template>

<script setup lang="ts">
import { Action, Playbook } from '@/assets/data/data-types';
import playbooksData from '@/assets/data/playbooks.json';
import PlaybookCard from '@/components/playbook-card.vue';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';

const playbooks = playbooksData as unknown as Playbook[];

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

function onClickPlaybook(playbook: Playbook) {
    props.scoundrel.playbook = playbook.id;

    // Remove all 'playbook' keys from scoundrel.actions
    Object.keys(props.scoundrel.actions).forEach((action) => {
        delete props.scoundrel.actions[action as Action].playbook;
    });

    // Add the new playbook's actions to scoundrel.actions
    Object.keys(playbook.actions).forEach((action) => {
        const modifier = playbook.actions[action as Action];
        props.scoundrel.actions[action as Action].playbook = modifier;
    });

    // Clear the abilities array
    props.scoundrel.abilities = [];

    // Remove all friends and rivals
    props.scoundrel.friends = [];
    props.scoundrel.rivals = [];
}
</script>

<style scoped lang="scss">
.playbook-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
    gap: 0.4rem;
    margin-bottom: 1.2rem;
    padding: 1.2rem;
}
</style>
