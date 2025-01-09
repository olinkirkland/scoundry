<template>
    <div class="playbook-card">
        <h2>{{ $t(`Playbooks.${playbookCapitalized}.label`) }}</h2>
        <p class="description">
            {{ $t(`Playbooks.${playbookCapitalized}.description`) }}
        </p>

        <ul class="action-tags">
            <action-tag
                v-for="action in Object.keys(actions)"
                :key="action"
                :action="action"
                :value="actions[action]"
            />
        </ul>
    </div>
</template>

<script setup lang="ts">
import ActionTag from './action-tag.vue';

const props = defineProps<{
    playbook: string;
    actions: Record<string, number>;
}>();

const playbookCapitalized =
    props.playbook.charAt(0).toUpperCase() + props.playbook.slice(1);
</script>

<style scoped lang="scss">
.playbook-card {
    box-shadow: var(--shadow-sm);
    padding: 1.6rem;
    background-color: var(--color-surface);
    transition: box-shadow 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;

    * {
        color: inherit;
    }

    h2 {
        font-family: var(--font-display);
        text-transform: uppercase;
        font-size: 4.8rem;
    }

    p.description {
        text-align: center;
        font-style: italic;
    }

    p.description &:hover {
        box-shadow: var(--shadow-md);
    }

    &.active {
        transition: none;
        color: var(--color-primary);
        background-color: transparent;
        box-shadow: none !important;

        h2 {
            text-shadow: var(--shadow-text);
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

.action-tags {
    display: flex;
    gap: 0.8rem;
    padding-top: 1.2rem;
    margin-top: auto;
}

@media (max-width: 768px) {
    .playbook-card {
        h1 {
            font-size: 3.2rem;
        }
    }
}
</style>
