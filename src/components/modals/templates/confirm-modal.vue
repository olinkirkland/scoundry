<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton :closeButtonAction="onClickCancel">
                <h3>{{ props.title }}</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="confirm">
                <p v-html="props.message"></p>

                <div
                    class="choices"
                    :class="{ 'reverse-order': props.isConfirmButtonCta }"
                >
                    <button
                        class="btn"
                        :class="{ 'btn--alt': !isConfirmButtonCta }"
                        @click="props.onConfirm"
                    >
                        <span>{{
                            props.confirmText ||
                            useI18n().t(
                                'User-interface.Modals.Confirm.Controls.confirm-button'
                            )
                        }}</span>
                    </button>
                    <button
                        class="btn"
                        :class="{ 'btn--alt': isConfirmButtonCta }"
                        @click="onClickCancel"
                    >
                        <span>{{
                            props.cancelText ||
                            useI18n().t(
                                'User-interface.Modals.Confirm.Controls.cancel-button'
                            )
                        }}</span>
                    </button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirmButtonCta?: boolean;
}>();

function onClickCancel() {
    props.onCancel ? props.onCancel() : ModalController.close();
}
</script>

<style scoped lang="scss">
.confirm {
    display: flex;
    max-width: 64rem;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
    height: 100%;
}

.choices {
    display: flex;
    gap: 0.8rem;
    justify-content: center;

    &.reverse-order {
        flex-direction: row-reverse;
    }
}

@media (max-width: 768px) {
    .choices {
        flex-direction: column;

        &.reverse-order {
            flex-direction: column-reverse;
        }
    }
}
</style>
