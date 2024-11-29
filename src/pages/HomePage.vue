<template>
  <div class="home-page">
    <!-- Logo -->
    <h1>Scoundry</h1>
    <!-- Tagline -->
    <p>Quicker Scoundrels, Faster Scores</p>
    <!-- buttons: new scoundrel -->
    <button class="btn">New Scoundrel</button>
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
import { Scoundrel } from '../Scoundrel';

const scoundrels: Scoundrel[] = [];
</script>

<style lang="scss" scoped></style>
