<template>
    <step-header>
        <h2>Choose a <strong>special ability</strong></h2>
        <p>What ability sets your character apart in the crew?</p>
    </step-header>
    <ul class="abilities-list">
        <ability-card
            v-for="ability in abilities"
            :key="ability.id"
            :ability="ability"
            :class="{ active: scoundrel.abilities.includes(ability.id) }"
            @click="onClickAbility(ability)"
        />
    </ul>
    <section class="veteran">
        <p>
            You can add an Ability from another Playbook by using a
            <strong>Veteran Advance</strong>.
        </p>
        <button class="btn btn--alt">Add another Ability</button>
    </section>
</template>

<script setup lang="ts">
import abilitiesData from '@/assets/data/abilities.json';
import { Trait } from '@/assets/data/data-types';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import AbilityCard from '../ability-card.vue';
import { computed } from 'vue';

const abilities = computed(() =>
    (abilitiesData as unknown as Trait[]).filter(
        (a) => a.category === props.scoundrel.playbook
    )
);

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

if (!props.scoundrel.abilities) props.scoundrel.abilities = [];

function onClickAbility(ability: Trait) {
    // Toggle the ability in the scoundrel's abilities array
    const index = props.scoundrel.abilities.indexOf(ability.id);
    if (index === -1) props.scoundrel.abilities.push(ability.id);
    else props.scoundrel.abilities.splice(index, 1);
}
</script>

<style scoped lang="scss">
.abilities-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 0.4rem;
    margin-bottom: 1.2rem;
    padding: 1.2rem;
}
</style>
