<template>
  <footer>
    <div class="footer__content" v-if="isFooterOpen">
      <div class="logo-and-olin">
        <h2>Scoundry</h2>
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
          <a href="https://unsplash.com" target="_blank">Unsplash.com</a> and
          belong to their respective owners on the site
        </p>
        <p>
          Icons are from
          <a href="https://icons8.com" target="_blank">Icons8.com</a>
        </p>
      </div>
    </div>
    <button class="link" @click="isFooterOpen = !isFooterOpen">
      {{ isFooterOpen ? 'Close' : 'Show' }} Attribution
    </button>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isFooterOpen = ref(false);
</script>

<style lang="scss">
footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-surface-lighter);

  .footer__content {
    max-width: 96rem;
    margin: 0 auto;
    padding: 1.2rem;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    color: var(--color-on-secondary);

    p,
    a {
      font-size: 1.2rem;
      line-height: 1.6;
    }

    > div {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    > .logo-and-olin {
      h2 {
        font-family: var(--font-family-logo);
        font-size: 3.2rem;
      }
    }
  }
}

footer > button {
  display: block;
  margin: 1.2rem auto;
  font-size: 1.2rem;
}

@media (max-width: 1024px) {
  footer {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    text-align: center;
    > div {
      width: 100%;
    }
  }
}
</style>
