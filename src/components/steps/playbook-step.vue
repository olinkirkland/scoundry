<template>
    <step-header>
        <h2 v-html="$t('User-interface.Steps.Playbook.title')"></h2>
        <p v-html="$t('User-interface.Steps.Playbook.subtitle')"></p>
    </step-header>
    <ul class="playbook-list">
        <playbook-card
            v-for="(actions, playbook) in playbooksActions"
            :key="playbook"
            :playbook="playbook"
            :actions="actions"
            :class="{ active: playbook === scoundrel.playbook }"
            @click="onClickPlaybook(playbook)"
        />
    </ul>
</template>

<script setup lang="ts">
import playbooksData from '@/assets/data/playbooks.json';
import PlaybookCard from '@/components/playbook-card.vue';
import StepHeader from '@/components/step-header.vue';
import { getLanguage } from '@/i18n/locale';
import { Scoundrel } from '@/scoundrel';
import { useI18n } from 'vue-i18n';

const playbooksActions = playbooksData as unknown as Record<
    string,
    Record<string, number>
>;

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

function onClickPlaybook(playbook: string) {
    props.scoundrel.playbook = playbook;
    props.scoundrel.language = getLanguage();

    // Remove all 'playbook' keys from scoundrel.actions
    Object.keys(props.scoundrel.actions).forEach((action) => {
        delete props.scoundrel.actions[action].playbook;
    });

    const actions = playbooksActions[playbook];

    // Add the new playbook's actions to scoundrel.actions
    Object.keys(actions).forEach((action) => {
        const modifier = actions[action];
        props.scoundrel.actions[action].playbook = modifier;
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
