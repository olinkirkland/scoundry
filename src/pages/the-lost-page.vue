<template>
  <div class="page page--lost">
    <h1>404</h1>
    <p>This page does not exist.</p>
    <button class="btn btn--alt" @click="onClickGoHome()">
      Return to Home Page
    </button>
  </div>
</template>

<script setup lang="ts">
import { PageName, router } from '@/router';

function onClickGoHome() {
  router.push({ name: PageName.HOME });
}
</script>

<style lang="scss" scoped>
.page--lost {
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-family: var(--font-display);
  color: var(--color-on-surface);
  font-size: 12rem;
  text-align: center;
}

h1 + p {
  margin-bottom: 4rem;
  text-align: center;
}

@media (max-width: 768px) {
  h1 {
    font-size: 4.8rem;
  }
}
</style>
