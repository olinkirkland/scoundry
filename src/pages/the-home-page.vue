<template>
  <div class="page page--home page-in" ref="page">
    <div class="page-content">
      <h1>Scoundry</h1>
      <p>
        A character keeper for
        <a href="https://bladesinthedark.com/" target="_blank"
          >Blades in the Dark</a
        >
      </p>
      <div class="row">
        <button class="btn" @click="onClickMakeNewScoundrel">
          <span>Make a new Scoundrel</span>
        </button>
        <button class="btn btn--alt disabled">
          <span>Load from file</span>
        </button>
      </div>

      <!-- TODO: list of scoundrels; portraits and names -->
      <ul class="scoundrels">
        <li v-for="scoundrel in scoundrels" :key="scoundrel.id">
          <img :src="scoundrel.portrait" :alt="scoundrel.name" />
          <p>{{ scoundrel.name }}</p>
        </li>
      </ul>
    </div>
    <div class="footer-container">
      <footer>
        <div class="logo-and-olin">
          <h2>www.scoundry.com</h2>
          <p>
            Code & website design by
            <a href="https://olinkirk.land" target="_blank">Olin Kirkland</a>
          </p>
          <p class="muted">
            Copyright © {{ new Date().getFullYear() }} Olin Kirkland
          </p>
        </div>
        <div>
          <p>
            This work is based on
            <a href="http://www.bladesinthedark.com/" target="_blank"
              >Blades in the Dark</a
            >
            — a product of One Seven Design, developed and authored by John
            Harper, and licensed for our use under the
            <a href="http://creativecommons.org/licenses/by/3.0" target="_blank"
              >Creative Commons Attribution 3.0 license</a
            >
          </p>
        </div>
        <div>
          <p>
            Images are from
            <a href="https://unsplash.com" target="_blank">Unsplash.com</a>
            and belong to their respective owners on the site
          </p>
          <p>
            Icons are from
            <a href="https://icons8.com" target="_blank">Icons8.com</a>
          </p>
        </div>
      </footer>
    </div>
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
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.page--home > .page-content {
  min-height: 100vh;
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

.footer-container {
  width: 100%;
  background-color: var(--color-surface);
  padding: 0.8rem;
  border-top: 1px solid var(--color-surface-lighter);
  box-shadow: var(--shadow-lg);
}

footer {
  max-width: 96rem;
  margin: 0 auto;
  padding: 1.2rem;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  color: var(--color-on-secondary);

  p,
  a {
    font-size: 1.4rem;
    line-height: 1.6;
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  > .logo-and-olin {
    h2 {
      font-family: var(--font-display);
      font-size: 2.4rem;
      opacity: 0.4;
      text-transform: uppercase;
    }
  }
}

footer > button {
  display: block;
  margin: 1.2rem auto;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  footer {
    grid-template-columns: 1fr;
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
