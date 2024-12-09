<template>
    <div class="suggested-action-tag">
        <p :style="{ color }">{{ label }}</p>
    </div>
</template>

<script setup lang="ts">
import { Action } from '@/assets/data/data-types';
import { getActionColorBySlug, getActionLabelBySlug } from '@/util/action-util';

const props = defineProps<{
    action: Action;
}>();

const color = getActionColorBySlug(props.action);
const label = getActionLabelBySlug(props.action);
</script>

<style scoped lang="scss"></style>
