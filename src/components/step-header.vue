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
  padding: 2rem;
  border-bottom: 2px dashed rgba(255, 255, 255, 0.4);
}
</style>
