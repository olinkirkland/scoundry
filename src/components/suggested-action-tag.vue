<template>
    <div class="suggested-action-tag">
        <p :style="{ color }">{{ actionRating.label }}</p>
    </div>
</template>

<script setup lang="ts">
import { Action } from '@/assets/data/data-types';
import { getActionRating, getAttributeColor } from '@/util/action-util';

const props = defineProps<{
    action: Action;
}>();

const actionRating = getActionRating(props.action)!;
const color = getAttributeColor(actionRating.attribute);
</script>

<style scoped lang="scss"></style>
