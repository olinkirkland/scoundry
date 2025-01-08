<template>
    <div class="ability-card">
        <h2>{{ $t(`Abilities.${capitalize(ability)}.label`) }}</h2>
        <p
            class="description"
            v-html="$t(`Abilities.${capitalize(ability)}.description`)"
        ></p>
        <div class="overlay"></div>
    </div>
</template>

<script setup lang="ts">
import { capitalize } from '@/util/string-util';

const props = defineProps<{
    ability: string;
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
        font-size: 2.4rem;
        margin-bottom: 0.8rem;
        font-weight: normal;
        line-height: 1;
    }

    p.description {
        :deep(ul) {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            padding-left: 0.8rem;
            > li {
                &::before {
                    content: '❖';
                    margin-right: 0.4rem;
                }
            }
        }
        :deep(br) {
            margin-bottom: 0.8rem;
        }
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
