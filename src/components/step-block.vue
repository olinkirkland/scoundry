<template>
  <div
    class="step"
    :class="{ active: props.active, completed: props.completed }"
  >
    <p>{{ props.stepLabel }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  stepLabel: string;
  stepNumber: number;
  active: boolean;
  completed: boolean;
}>();
</script>

<style scoped lang="scss">
.step {
  position: relative;
  padding: 0 1.6rem;
  height: 3.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  background-color: var(--color-surface-lighter);

  &.active::after {
    content: '';
    position: absolute;
    width: 100%;
    bottom: 0;
    border-bottom: 0.2rem solid var(--color-primary);
  }

  > p {
    font-size: 1.4rem;
    text-align: center;
  }
}
</style>
