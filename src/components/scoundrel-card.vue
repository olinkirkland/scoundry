<template>
    <div class="scoundrel-card">
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
    background-color: var(--color-surface);
    border-radius: 5px;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    transition: all 0.2s;
    text-align: center;

    > * {
        cursor: inherit;
        margin: 0;
    }

    &:hover {
        box-shadow: var(--shadow-sm);
    }
}

@media (max-width: 768px) {
}
</style>
