<template>
    <step-header>
        <h2 v-html="$t('User-interface.Steps.Friends.title')"></h2>
        <p v-html="$t('User-interface.Steps.Friends.subtitle')"></p>
    </step-header>
    <ul class="friends-list">
        <li
            v-for="person in friendsAndRivals"
            class="person-card"
            :class="{
                'person-card--selected':
                    scoundrel.friends.includes(person) ||
                    scoundrel.rivals.includes(person),
            }"
        >
            <div class="background-fill"></div>
            <div class="body">
                <p>{{ $t(`Friends.${capitalize(person)}.label`) }}</p>
                <label>{{
                    $t(`Friends.${capitalize(person)}.description`)
                }}</label>
            </div>
            <div class="checkboxes">
                <div
                    class="checkbox-group"
                    @click="togglePersonRole(person, 'friends')"
                >
                    <input
                        type="checkbox"
                        :checked="scoundrel.friends.includes(person)"
                    />
                    <label>
                        {{ $t('User-interface.Steps.Friends.friend-button') }}
                    </label>
                </div>
                <div
                    class="checkbox-group"
                    @click="togglePersonRole(person, 'rivals')"
                >
                    <input
                        type="checkbox"
                        :checked="scoundrel.rivals.includes(person)"
                    />
                    <label>
                        {{ $t('User-interface.Steps.Friends.rival-button') }}
                    </label>
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import dataFriendsAndRivals from '@/assets/data/friends-and-rivals.json';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import { capitalize } from '@/util/string-util';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

if (!props.scoundrel.friends) props.scoundrel.friends = [];
if (!props.scoundrel.rivals) props.scoundrel.rivals = [];

const friendsAndRivals =
    dataFriendsAndRivals[
        props.scoundrel.playbook as keyof typeof dataFriendsAndRivals
    ];

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
    grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
    gap: 0.4rem;
}

li.person-card {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    border: 1px solid transparent;
    background-color: var(--color-surface);
    align-items: center;
    border-radius: 5px;
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
