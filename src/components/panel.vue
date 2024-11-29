<template>
  <div class="panel">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.panel {
  border: 2px solid var(--color-surface);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}
</style>
