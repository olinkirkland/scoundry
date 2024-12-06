<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h3>Export Your Character</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="save">
                <p>Scoundry saves your changes automatically.</p>
                <p class="callout">
                    If you want to share your character, you can copy the JSON
                    data and import it from the home page.
                </p>
                <p>
                    You can save your filled-out character sheet as a PNG image.
                </p>
                <div class="row wrap">
                    <button
                        class="btn btn--alt"
                        :class="{ 'no-click': showCopyMessage }"
                        :disabled="showCopyMessage"
                        @click="onClickCopyJSON"
                    >
                        <span class="copy-message" v-if="showCopyMessage"
                            >Copied!</span
                        >
                        <span v-else>Copy Character JSON</span>
                    </button>
                    <button class="btn disabled" @click="onClickSavePNG">
                        Save Character Sheet PNG
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
    }
}
</style>
