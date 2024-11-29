<template>
  <div class="page page--home">
    <!-- Logo -->
    <h1>Scoundry</h1>
    <!-- Tagline -->
    <p>
      <span
        >Character keeper for
        <a href="https://bladesinthedark.com/" target="_blank"
          >Blades in the Dark</a
        ></span
      >
    </p>
    <!-- buttons: new scoundrel -->
    <button class="btn">
      <span>Make a new Scoundrel</span>
    </button>
    <!-- list of scoundrels; portraits and names -->
    <ul class="scoundrels">
      <li v-for="scoundrel in scoundrels" :key="scoundrel.id">
        <img :src="scoundrel.portrait" :alt="scoundrel.name" />
        <p>{{ scoundrel.name }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Scoundrel } from '../scoundrel';
const scoundrels: Scoundrel[] = [];
</script>

<style lang="scss" scoped>
.page--home {
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-family: var(--font-family-logo);
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
