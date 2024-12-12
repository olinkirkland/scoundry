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
                    <img src="/assets/icons/down.png" />
                </button>
                <button class="btn btn--icon">
                    <img src="/assets/icons/up.png" />
                </button>
            </div>
            <p>{{ friendOrRival.label }}</p>
            <label>{{ friendOrRival.description }}</label>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { Trait } from '@/assets/data/data-types';
import dataFriendsAndRivals from '@/assets/data/friends-and-rivals.json';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import { computed } from 'vue';

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
