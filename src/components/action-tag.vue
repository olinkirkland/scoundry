<template>
    <div
        class="action-tag"
        :style="{ backgroundColor: color, borderColor: color }"
    >
        <ul class="circles-list">
            <li v-for="i in number" :key="i" :style="{ color }"></li>
        </ul>
        <p class="label">{{ label }}</p>
    </div>
</template>

<script lang="ts" setup>
import { getActionColorBySlug, getActionLabelBySlug } from '@/util/action-util'
import { computed } from 'vue'

const props = defineProps<{
    action: string
    number: number
}>()

const label = computed(() => {
    return getActionLabelBySlug(props.action)
})

const color = computed(() => {
    return getActionColorBySlug(props.action)
})
</script>

<style lang="scss" scoped>
.action-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0rem 0.8rem 0rem 0.6rem;
    height: 2rem;
    border-radius: 99px;
    color: var(--color-on-surface);
    border: 1px solid currentColor;

    ul.circles-list {
        display: flex;
        margin-right: 0.8rem;

        > li {
            width: 0.8rem;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;

            &::before {
                content: '';
                position: absolute;
                display: block;
                width: 1.25rem;
                height: 1.25rem;
                border-radius: 50%;
                background-color: currentColor;
            }

            &::after {
                content: '';
                position: absolute;
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                background-color: var(--color-on-surface);
            }
        }
    }

    p {
        position: relative;
        font-size: 1.2rem;
        top: 0.05rem;
    }
}

@media (max-width: 768px) {
    .action-tag {
        padding: 0 0.8rem 0 0.8rem;
    }
}
</style>
