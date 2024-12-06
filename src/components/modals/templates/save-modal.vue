<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h3>Save Your Character</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="save">
                <p>
                    Either export your character to a JSON file that can be
                    imported into Scoundry, or save your filled-out character
                    sheet as a PNG image.
                </p>
                <div class="row wrap">
                    <button
                        class="btn btn--alt"
                        :class="{ 'no-click': showCopyMessage }"
                        :disabled="showCopyMessage"
                        @click="onClickCopyJSON"
                    >
                        Copy Character JSON
                    </button>
                    <button class="btn" @click="onClickSavePNG">
                        Save Character Sheet as PNG
                    </button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { Scoundrel } from '@/scoundrel';
import { ref } from 'vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const showCopyMessage = ref(false);

function onClickCopyJSON() {
    navigator.clipboard.writeText(JSON.stringify(props.scoundrel));
    showCopyMessage.value = true;
    setTimeout(() => {
        showCopyMessage.value = false;
    }, 2000);
}

function onClickSavePNG() {
    // TODO
}
</script>

<style scoped lang="scss">
.save {
    max-width: 56rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.6rem;
}

@media (max-width: 768px) {
    .save {
        max-width: 100%;
    }
    .row {
        margin-top: auto;
        width: 100%;
        flex-direction: column;
        > {
            width: 100%;
        }
    }
}
</style>
