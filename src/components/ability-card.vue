<template>
    <div class="ability-card">
        <h2>{{ ability.label }}</h2>
        <p class="description">{{ ability.description }}</p>
        <div class="overlay"></div>
    </div>
</template>

<script setup lang="ts">
import { Trait } from '@/assets/data/data-types';

const props = defineProps<{
    ability: Trait;
}>();
</script>

<style scoped lang="scss">
.ability-card {
    box-shadow: var(--shadow-sm);
    padding: 1.6rem;
    background-color: var(--color-surface);
    transition: box-shadow 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid transparent;
    position: relative;

    > .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: var(--color-primary);
        opacity: 0;
    }

    * {
        color: inherit;
    }

    h2 {
        font-family: var(--font-display);
        text-transform: uppercase;
        text-align: center;
        font-size: 2rem;
        margin-bottom: 0.8rem;
        border-bottom: 1px solid currentColor;
        font-weight: normal;
    }

    p.tagline {
        text-align: center;
        font-style: italic;
    }

    p.description &:hover {
        box-shadow: var(--shadow-md);
    }

    &.active {
        transition: none;
        color: var(--color-primary);
        border: 1px solid var(--color-primary);
        box-shadow: none !important;

        h2 {
            text-shadow: var(--shadow-text);
        }

        > .overlay {
            opacity: 0.05;
        }

        :deep(.action-tag) {
            border: 1px solid var(--color-primary) !important;
            background-color: transparent !important;

            ul.circles-list {
                > li::before {
                    background-color: var(--color-surface);
                }
                > li::after {
                    background-color: var(--color-primary);
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .ability-card {
        h1 {
            font-size: 2rem;
        }
    }
}
</style>
