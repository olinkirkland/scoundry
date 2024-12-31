<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader close-button>
                <h3>{{ props.title }}</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="image">
                <img
                    :src="props.image"
                    :alt="props.image"
                    :style="{ backgroundColor: props.backgroundColor }"
                />
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';

const props = defineProps<{
    title: string;
    image: string;
    backgroundColor?: string;
}>();
</script>

<style scoped lang="scss">
.image {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
}

@media (max-width: 768px) {
    :deep(.modal__content) {
        padding: 0 !important;
    }

    img {
        height: 100%;
        object-fit: contain;
    }
}
</style>
