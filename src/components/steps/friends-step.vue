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
            <div class="buttons">
                <button
                    class="btn btn--icon"
                    :class="{
                        disabled: scoundrel.friends.includes(person.id),
                        selected: scoundrel.rivals.includes(person.id),
                    }"
                    @click="togglePersonRole(person.id, 'rivals')"
                >
                    <img src="/assets/icons/triangle-down.png" />
                </button>
                <button
                    class="btn btn--icon"
                    :class="{
                        disabled: scoundrel.rivals.includes(person.id),
                        selected: scoundrel.friends.includes(person.id),
                    }"
                    @click="togglePersonRole(person.id, 'friends')"
                >
                    <img src="/assets/icons/triangle-up.png" />
                </button>
            </div>
            <div class="body">
                <p>{{ person.label }}</p>
                <label>{{ person.description }}</label>
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
    display: flex;
    gap: 1rem;
    border: 1px solid var(--color-on-surface);
    padding: 1.2rem;
    align-items: center;
    > .background-fill {
        transition: all 0.2s;
        background-color: var(--color-primary);
        opacity: 0;
    }

    &.person-card--selected {
        border-color: var(--color-primary);
        > .background-fill {
            opacity: 0.1;
        }
    }

    > .buttons {
        display: flex;

        > button.btn {
            border: none;
            box-shadow: none;
            padding: 0;
            transition: all 0.2s;

            &:after {
                display: none;
            }

            &.disabled > img {
                width: 1.4rem;
                height: 1.4rem;
            }
        }
    }

    > .body {
        flex: 1;
    }
}
</style>
