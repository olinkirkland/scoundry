<template>
    <div class="suggested-action-tag">
        <p :style="{ color }">
            {{ $t(`Actions.${capitalize(action)}.label`) }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { getAttribute, getAttributeColor } from '@/util/action-util';
import { capitalize } from '@/util/string-util';

const props = defineProps<{
    action: string;
}>();

const color = getAttributeColor(getAttribute(props.action)!);
</script>

<style scoped lang="scss"></style>
