<template>
    <div class="playbook-card" :class="{ selected }">
        <img :src="`/assets/images/${trait.image}`" alt="" />
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
.playbook-card {
    box-shadow: var(--shadow-sm);
    background-color: var(--color-surface);
    transition: box-shadow 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    overflow: hidden;
    width: max-content;
    min-width: 12rem;
    height: 6.4rem;

    position: relative;
    display: flex;
    justify-content: center;
    align-content: center;

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
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.8)
        );
        transition: opacity 0.2s ease-in-out;
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
        box-shadow: var(--shadow-md);

        .overlay {
            opacity: 0.8;
        }
    }

    &.selected {
        transition: none;
        color: var(--color-primary);
        background: none;
        box-shadow: none;

        img,
        .overlay {
            display: none;
        }

        h2 {
            width: fit-content;
            text-shadow: var(--shadow-text);
            border-bottom: 2px solid var(--color-primary);
        }
    }
}
</style>
