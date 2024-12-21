<template>
    <div class="scoundrel-card">
        <img
            class="portrait"
            v-if="props.scoundrel.portrait"
            :src="`/assets/${props.scoundrel.portrait}`"
        />
        <p>{{ semanticName }}</p>
        <label v-if="props.lastUpdated"
            >Updated {{ props.lastUpdated.toLocaleDateString() }}</label
        >
    </div>
</template>

<script setup lang="ts">
import { Scoundrel } from '@/scoundrel';
import { getSemanticScoundrelName } from '@/util/scoundrel-util';
import { computed } from 'vue';

const props = defineProps<{
    scoundrel: Scoundrel;
    lastUpdated: Date | null;
}>();

const semanticName = computed(() => {
    return getSemanticScoundrelName(props.scoundrel);
});
</script>

<style scoped lang="scss">
.scoundrel-card {
    cursor: pointer;
    min-width: 14rem;
    width: 12rem;
    background-color: var(--color-surface);
    border-radius: 5px;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;

    gap: 0.4rem;
    transition: all 0.2s;
    text-align: center;

    img.portrait {
        width: 6.4rem;
        height: 6.4rem;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 1rem;
    }

    > * {
        cursor: inherit;
        margin: 0;
    }

    &:hover {
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--color-on-surface);
    }
}

@media (max-width: 768px) {
}
</style>
