<template>
    <div class="trait-detail-card" :class="{ selected }">
        <h2>{{ label }}</h2>
        <ul class="action-tags">
            <suggested-action-tag
                v-for="action in traitDetail.suggestedActions"
                :key="action"
                :action="action"
            />
        </ul>
    </div>
</template>

<script setup lang="ts">
import { TraitDetail } from '@/assets/data/data-types';
import SuggestedActionTag from './suggested-action-tag.vue';

const props = defineProps<{
    traitDetail: TraitDetail;
    label?: string;
    selected: boolean;
}>();
</script>

<style scoped lang="scss">
.trait-detail-card {
    box-shadow: var(--shadow-sm);
    background-color: var(--color-surface);
    border-radius: 5px;
    transition: box-shadow 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 1.2rem;

    * {
        color: inherit;
    }

    h2 {
        width: 100%;
        text-align: center;
        font-family: var(--font-body);
        font-weight: normal;
        font-size: 1.6rem;
        margin-bottom: 0.8rem;
    }

    p {
        color: var(--color-on-surface);
    }

    ul.action-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
    }

    &.selected {
        transition: none;
        color: var(--color-primary);
        background-color: transparent;

        h2 {
            width: fit-content;
            text-shadow: var(--shadow-text);
        }

        :deep(.suggested-action-tag p) {
            color: var(--color-primary) !important;
        }
    }
}
</style>
