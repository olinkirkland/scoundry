<template>
    <div class="scoundrel-card">
        <p>{{ semanticName }}</p>
        <label v-if="props.lastUpdated"
            >Updated {{ props.lastUpdated.toLocaleDateString() }}</label
        >
        <div class="attributes-row">
            <li :style="{ backgroundColor: insightColor }">
                <span>{{ getAttributeValue(scoundrel, 'insight') }}</span>
            </li>
            <li :style="{ backgroundColor: prowessColor }">
                <span>{{ getAttributeValue(scoundrel, 'prowess') }}</span>
            </li>
            <li :style="{ backgroundColor: resolveColor }">
                <span> {{ getAttributeValue(scoundrel, 'resolve') }}</span>
            </li>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Scoundrel } from '@/scoundrel';
import { insightColor, prowessColor, resolveColor } from '@/util/action-util';
import {
    getAttributeValue,
    getSemanticScoundrelName,
} from '@/util/scoundrel-util';
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

    .attributes-row {
        margin-top: 0.4rem;
        display: flex;
        justify-content: center;
        gap: 0.4rem;

        > li {
            // Colored circle
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;

            span {
                margin-top: 0.1rem;
                font-size: 1.2rem;
                font-weight: bold;
                font-family: var(--font-body);
            }
        }
    }
}

@media (max-width: 768px) {
}
</style>
