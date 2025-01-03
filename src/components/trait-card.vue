<template>
    <div class="trait-card" :class="{ selected }">
        <div class="overlay"></div>
        <h2>{{ trait.label }}</h2>
    </div>
</template>

<script setup lang="ts">
import { Trait } from '@/assets/data/data-types';

const props = defineProps<{
    trait: Trait;
    selected: boolean;
}>();
</script>

<style scoped lang="scss">
.trait-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    width: 12rem;
    min-width: 12rem;
    height: 6.4rem;

    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;

    background-color: var(--color-surface);
    border-radius: 5px;

    * {
        color: inherit;
    }

    > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: var(--color-primary);
        opacity: 0;
    }

    h2 {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        font-family: var(--font-body);
        font-weight: normal;
    }

    &:hover {
        &:not(.selected) {
            text-decoration: underline;
        }
    }

    &.selected {
        transition: none;
        color: var(--color-primary);
        border: 1px solid var(--color-primary);

        .overlay {
            opacity: 0.05;
        }

        h2 {
            width: fit-content;
            text-shadow: var(--shadow-text);
        }
    }
}
</style>
