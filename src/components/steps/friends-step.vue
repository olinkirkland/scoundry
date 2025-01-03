<template>
    <step-header>
        <h2>Who owes you one and who's your bitter enemy?</h2>
        <p>
            Who is a long-time ally, family relation, or lover? And who is a
            rival, enemy, scorned lover, or betrayed partner?
        </p>
    </step-header>
    <ul class="friends-list">
        <li
            v-for="person in friendsAndRivals"
            class="person-card"
            :class="{
                'person-card--selected':
                    scoundrel.friends.includes(person.id) ||
                    scoundrel.rivals.includes(person.id),
            }"
        >
            <div class="background-fill"></div>
            <div class="body">
                <p>{{ person.label }}</p>
                <label>{{ person.description }}</label>
            </div>
            <div class="checkboxes">
                <div
                    class="checkbox-group"
                    @click="togglePersonRole(person.id, 'friends')"
                >
                    <input
                        type="checkbox"
                        :checked="scoundrel.friends.includes(person.id)"
                    />
                    <label>Friend</label>
                </div>
                <div
                    class="checkbox-group"
                    @click="togglePersonRole(person.id, 'rivals')"
                >
                    <input
                        type="checkbox"
                        :checked="scoundrel.rivals.includes(person.id)"
                    />
                    <label>Rival</label>
                </div>
            </div>
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

if (!props.scoundrel.friends) props.scoundrel.friends = [];
if (!props.scoundrel.rivals) props.scoundrel.rivals = [];

const friendsAndRivals = computed(() => {
    const allFriendsAndRivals = dataFriendsAndRivals as unknown as Trait[];
    return allFriendsAndRivals.filter(
        (c) => c.category === props.scoundrel.playbook
    );
});

function togglePersonRole(id: string, role: 'friends' | 'rivals') {
    const personIndex = props.scoundrel[role].indexOf(id);
    if (personIndex === -1) props.scoundrel[role].push(id);
    else props.scoundrel[role].splice(personIndex, 1);
    // Ensure that a person can't be both a friend and a rival
    const otherRole = role === 'friends' ? 'rivals' : 'friends';
    const otherRoleIndex = props.scoundrel[otherRole].indexOf(id);
    if (otherRoleIndex !== -1)
        props.scoundrel[otherRole].splice(otherRoleIndex, 1);
}
</script>

<style scoped lang="scss">
ul.friends-list {
    padding: 1.2rem;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 1rem;
}

li.person-card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    border: 1px solid var(--color-on-surface);
    align-items: center;
    > .background-fill {
        position: absolute;
        transition: all 0.2s;
        top: 0;
        left: 0;
        background-color: var(--color-primary);
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    &.person-card--selected {
        border-color: var(--color-primary);
        > .background-fill {
            opacity: 0.05;
        }

        * {
            color: var(--color-primary);
        }

        .checkboxes .checkbox-group {
            input[type='checkbox'] {
                &:checked + label::before {
                    background-image: url('/assets/icons/checkbox-checked__primary.png');
                }
                &:not(:checked) + label::before {
                    background-image: url('/assets/icons/checkbox-unchecked__primary.png');
                }
            }
        }
    }

    > .body {
        flex: 1;
        text-align: center;
    }

    .checkboxes {
        display: flex;
        gap: 1rem;
    }
}
</style>
