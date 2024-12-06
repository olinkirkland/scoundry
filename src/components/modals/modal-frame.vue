<template>
    <div class="modal">
        <slot name="header"></slot>
        <div class="modal__content">
            <slot name="content"></slot>
        </div>
        <div class="modal__background"></div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.modal {
    position: relative;
    display: flex;
    flex-direction: column;
    animation: animate-in 0.2s ease;
    color: var(--color-on-surface);
    overflow: hidden;
    box-shadow: var(--shadow-md);

    .modal__background {
        position: absolute;
        background-color: var(--color-surface);
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .modal__content {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        flex: 1;
        max-width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
}

:deep(.modal__content > div) {
    width: 100%;
}

:deep(section:last-of-type) {
    padding-bottom: 2rem;
}
</style>
