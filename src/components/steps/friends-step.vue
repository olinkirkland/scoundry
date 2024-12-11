<template>
    <step-header>
        <h2>Who owes you one and who's your bitter enemy?</h2>
        <p>
            Who is a long-time ally, family relation, or lover? And who is a
            rival, enemy, scorned lover, or betrayed partner?
        </p>
    </step-header>
    <ul class="friends-list">
        <li v-for="friendOrRival in friendsAndRivals">
            <div class="row">
                <button class="btn btn--icon">
                    <img src="/assets/icons/minus.png" />
                </button>
                <button class="btn btn--icon">
                    <img src="/assets/icons/plus.png" />
                </button>
            </div>
            <p>{{ friendOrRival.label }}</p>
            <label>{{ friendOrRival.description }}</label>
        </li>
    </ul>
</template>

<script setup lang="ts">
import StepHeader from '@/components/step-header.vue';
import dataFriendsAndRivals from '@/assets/data/friends-and-rivals.json';
import { computed } from 'vue';
import { Trait } from '@/assets/data/data-types';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const friendsAndRivals = computed(() => {
    const allFriendsAndRivals = dataFriendsAndRivals as unknown as Trait[];
    return allFriendsAndRivals.filter(
        (c) => c.category === props.scoundrel.playbook
    );
});
</script>

<style scoped lang="scss"></style>
