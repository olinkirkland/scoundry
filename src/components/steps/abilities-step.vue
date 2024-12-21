<template>
    <step-header>
        <h2>Choose a <strong>special ability</strong></h2>
        <p>What ability sets your character apart in the crew?</p>
    </step-header>
    <ul class="abilities-list" v-if="scoundrel.abilities">
        <ability-card
            v-for="ability in abilities"
            :key="ability.id"
            :ability="ability"
            :class="{ active: scoundrel.abilities.includes(ability.id) }"
            @click="onClickAbility(ability)"
        />
    </ul>
    <section class="veteran hidden">
        <p>
            You can add a special ability from another playbook by using a
            <strong>veteran advance</strong>.
        </p>
        <button class="btn btn--alt disabled">Use a Veteran Advance</button>
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
    scoundrel: Partial<Scoundrel>;
}>();

if (!props.scoundrel.abilities) props.scoundrel.abilities = [];

function onClickAbility(ability: Trait) {
    // Toggle the ability in the scoundrel's abilities array
    const index = props.scoundrel.abilities!.indexOf(ability.id);
    if (index === -1) props.scoundrel.abilities!.push(ability.id);
    else props.scoundrel.abilities!.splice(index, 1);
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

section.veteran {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.2rem;
    gap: 1rem;
}
</style>
