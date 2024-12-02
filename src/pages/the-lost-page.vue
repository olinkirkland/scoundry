<template>
  <div class="page">
    <panel id="lost">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <button class="btn" @click="onClickGoHome()">Return to Home Page</button>
    </panel>
  </div>
</template>

<script setup lang="ts">
import Panel from '../components/panel.vue';
import { router } from '../router';

function onClickGoHome() {
  router.push('/');
}
</script>

<style lang="scss" scoped>
#lost {
  width: 100%;
  max-width: 40rem;
  text-align: center;
  > button {
    margin: 0 auto;
  }
}
</style>
