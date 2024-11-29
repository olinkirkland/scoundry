<template>
  <div class="app-layout">
    <router-view name="page"></router-view>
    <!-- <the-modal-container /> -->
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@use './assets/scss/reset.scss';
@use './assets/scss/styles.scss';

.app-layout {
  background-color: var(--color-surface);
  height: 100vh;
  overflow: hidden;
}
</style>
