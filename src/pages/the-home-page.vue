<template>
  <div class="page page--home page-in" ref="page">
    <!-- Logo -->
    <h1>Scoundry</h1>
    <!-- Tagline -->
    <p>
      A character keeper for
      <a href="https://bladesinthedark.com/" target="_blank"
        >Blades in the Dark</a
      >
    </p>
    <!-- buttons: new scoundrel -->
    <div class="row">
      <button class="btn" @click="onClickMakeNewScoundrel">
        <span>Make a new Scoundrel</span>
      </button>
      <button class="btn btn--alt disabled">
        <span>Load from file</span>
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

const page = ref<HTMLElement | null>(null);
const scoundrels = ref<Scoundrel[]>([]);

// Fetch the list of saved scoundrels (local storage)
const savedScoundrels = localStorage.getItem('scoundrels');
if (savedScoundrels?.length) scoundrels.value = JSON.parse(savedScoundrels);

async function onClickMakeNewScoundrel() {
  page.value?.classList.remove('page-in');
  page.value?.classList.add('page-out');

  await new Promise((resolve) => setTimeout(resolve, 500));
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

.page-in {
  animation: pageIn 0.4s ease-out forwards;
}

.page-out {
  animation: pageOut 0.2s ease-out forwards;
  pointer-events: none;
}

h1 {
  font-family: var(--font-display);
  color: var(--color-on-surface);
  font-size: 20rem;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  text-align: center;
}

h1 + p,
a {
  margin-bottom: 4rem;
  text-align: center;
}

@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pageOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 7.2rem;
  }

  h1 + p,
  a {
    font-size: 1.4rem;
  }

  .row {
    flex-direction: column;
  }
}
</style>
