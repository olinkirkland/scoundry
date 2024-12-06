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
                <ul class="ink-colors">
                    <li
                        v-for="color in inkColors"
                        :key="color"
                        @click="onClickChangeInkColor(color)"
                        :style="{ backgroundColor: color, color: color }"
                        :class="{ active: color === selectedInkColor }"
                    >
                        <img
                            v-if="color === selectedInkColor"
                            src="/assets/icons/done.png"
                            alt="Selected"
                        />
                    </li>
                </ul>
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

const inkColors = [
    '#f03e3e',
    '#ff922b',
    '#ffd43b',
    '#51cf66',
    '#20c997',
    '#339af0',
    '#5c7cfa',
    '#7950f2',
    '#e9417c',
    '#131313',
];

const showCopyMessage = ref(false);
const selectedInkColor = ref(inkColors[0]);

const sheetDataUrl = ref('');
const sheetPreview = ref<HTMLImageElement | null>(null);
generatePNG();

function onClickChangeInkColor(color: string) {
    selectedInkColor.value = color;
    generatePNG();
}

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
    const canvas = await paintSheet(props.scoundrel, selectedInkColor.value);
    console.log(canvas);
    if (!canvas) return;

    sheetDataUrl.value = canvas.toDataURL('image/png');
    sheetPreview.value!.src = sheetDataUrl.value;
}

function onClickSavePNG() {
    if (!props.scoundrel.playbook) return;

    // Open the PNG in a new tab
    // window.open(sheetDataUrl.value, '_blank');

    // 4. Save the PNG as a file
    const fileName = makeFileName(getSemanticScoundrelName(props.scoundrel));
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = sheetDataUrl.value.replace('image/png', 'image/octet-stream');
    link.click();
    link.remove();
}

function makeFileName(name: string) {
    // Replace non-alphanumeric, non-space characters with ''
    const cleanedName = name.replace(/[^a-zA-Z0-9\s]/g, '');
    return `${cleanedName.toLowerCase().replace(/\s/g, '-')}__character-sheet`;
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

ul.ink-colors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;

    > li {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 1.2rem;
        }

        &:hover {
            transform: scale(1.1);
            box-shadow: var(--shadow-sm);
        }
        &:active {
            transform: scale(1);
            filter: brightness(0.9);
        }

        &.selected {
            border: 2px solid var(--color-on-surface);
        }
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
