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
    margin-bottom: 1.2rem !important;

    :deep(h2) {
        font-weight: normal;
    }

    :deep(p) {
        opacity: 0.8;
    }
}

@media (max-width: 768px) {
    header * {
        text-align: center;
    }
}
</style>
