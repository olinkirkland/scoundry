<template>
  <header>
    <slot></slot>
  </header>
</template>

<style scoped lang="scss">
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
  padding: 2rem;
}
</style>
