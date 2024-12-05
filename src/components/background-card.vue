<template>
  <div class="background-card">
    <img :src="`/assets/images/backgrounds/${background.slug}.jpg`" alt="" />
    <div class="overlay"></div>
    <h2>{{ background.name }}</h2>
  </div>
</template>

<script setup lang="ts">
import { Background } from '@/assets/data/data-types';

const props = defineProps<{
  background: Background;
}>();
</script>

<style scoped lang="scss">
.background-card {
  box-shadow: var(--shadow-sm);
  background-color: var(--color-surface);
  transition: box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  width: max-content;
  min-width: 12rem;
  height: 6.4rem;

  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;

  * {
    color: inherit;
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.8)
    );
  }

  h2 {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
  }

  h2 {
    font-family: var(--font-body);
    font-weight: normal;
    font-size: 1.6rem;
  }

  p {
    font-size: 1.4rem;
  }

  &.active {
    transition: none;
    color: var(--color-primary);
    background-color: transparent;
    box-shadow: none !important;

    h2 {
      text-shadow: var(--shadow-text);
    }
  }
}

@media (max-width: 768px) {
  .background-card {
    h1 {
      font-size: 3.2rem;
    }
  }
}
</style>
