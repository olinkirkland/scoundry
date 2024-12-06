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
                <div class="preview-container">
                    <img
                        v-if="!sheetDataUrl"
                        class="spinner"
                        src="/assets/icons/loading.png"
                        alt="Loading"
                    />
                    <img ref="sheetPreview" class="preview" />
                </div>
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
                    <button class="btn" @click="onClickSavePNG">
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
import { paintSheet } from '@/sheet-painter';
import { makeSemanticId } from '@/util/id-util';
import { getSemanticScoundrelName } from '@/util/scoundrel-util';
import { ref } from 'vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const showCopyMessage = ref(false);
const sheetDataUrl = ref('');
const sheetPreview = ref<HTMLImageElement | null>(null);
generatePNG();

function onClickCopyJSON() {
    const scoundrelCopy = { ...props.scoundrel };
    scoundrelCopy.id = makeSemanticId();
    navigator.clipboard.writeText(JSON.stringify(scoundrelCopy));
    showCopyMessage.value = true;
    setTimeout(() => {
        showCopyMessage.value = false;
    }, 2000);
}

async function generatePNG() {
    const canvas = await paintSheet(props.scoundrel);
    console.log(canvas);
    if (!canvas) return;

    sheetDataUrl.value = canvas.toDataURL('image/png');
    sheetPreview.value!.src = sheetDataUrl.value;
}

function onClickSavePNG() {
    if (!props.scoundrel.playbook) return;

    // 4. Save the PNG to the user's computer
    const a = document.createElement('a');
    a.href = sheetDataUrl.value;
    a.download = `${getSemanticScoundrelName(props.scoundrel)}.png`;
    a.click();
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

.preview-container {
    width: 100%;
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > img.spinner {
        animation: spin 1s linear infinite;
    }

    > img.preview {
        width: 100%;
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
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
