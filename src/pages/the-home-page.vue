<template>
  <div class="page page--home">
    <!-- Logo -->
    <h1>Scoundry</h1>
    <!-- Tagline -->
    <p>
      <span
        >A character keeper for
        <a href="https://bladesinthedark.com/" target="_blank"
          >Blades in the Dark</a
        ></span
      >
    </p>
    <!-- buttons: new scoundrel -->
    <div class="row">
      <button class="btn" @click="onClickMakeNewScoundrel">
        <span>Make a new Scoundrel</span>
      </button>
      <button class="btn btn--alt disabled">
        <span>Load from disk</span>
      </button>
    </div>
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
import { PageName, router } from '@/router';
import { ref } from 'vue';
import { Scoundrel } from '../scoundrel';
const scoundrels = ref<Scoundrel[]>([]);

// Fetch the list of saved scoundrels (local storage)
const savedScoundrels = localStorage.getItem('scoundrels');
if (savedScoundrels?.length) scoundrels.value = JSON.parse(savedScoundrels);

function onClickMakeNewScoundrel() {
  // TODO: Exit animation
  

  // Navigate to the make page
  router.push({ name: PageName.MAKE });
}
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
