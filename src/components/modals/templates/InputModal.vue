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
                <Divider />

                <div class="input-group">
                    <label v-if="props.label">{{ props.label }}</label>
                    <InputField
                        v-model="input"
                        :placeholder="props.inputPlaceholder"
                    />
                </div>

                <div class="row wrap gap center">
                    <button class="btn" @click="onClickConfirm">
                        <span>{{ props.confirmText || 'Yes' }}</span>
                    </button>
                    <button class="btn btn--primary" @click="onClickCancel">
                        <span>{{
                            props.cancelText || 'No, I changed my mind'
                        }}</span>
                    </button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import Divider from '@/components/Divider.vue';
import InputField from '@/components/inputs/InputField.vue';
import ModalController from '@/controllers/modal-controller';
import { ref } from 'vue';
import ModalFrame from '../ModalFrame.vue';
import ModalHeader from '../ModalHeader.vue';

const input = ref('');

const props = defineProps<{
    title: string;
    message: string;
    onConfirm: (input: string) => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    label?: string;
    inputPlaceholder?: string;
}>();

function onClickConfirm() {
    props.onConfirm(input.value);
}

function onClickCancel() {
    props.onCancel ? props.onCancel() : ModalController.close();
}
</script>

<style scoped lang="scss">
.confirm {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;
}
</style>
