<template>
    <step-header>
        <h2>Export your <strong>scoundrel</strong></h2>
        <p>Share or print your character sheet.</p>
    </step-header>
    <div class="save">
        <span class="sheet-type">
            <a
                @click="
                    sheetType = 'classic';
                    generatePNG();
                "
                :class="{ selected: sheetType === 'classic' }"
                >Classic</a
            >
            or
            <a
                @click="
                    sheetType = 'deep-cuts';
                    generatePNG();
                "
                :class="{ selected: sheetType === 'deep-cuts' }"
            >
                Deep Cuts
            </a>
            ?
        </span>

        <div class="ink-row">
            <p>
                Choose an
                <span class="filled" :style="{ color: selectedInkColor }"
                    >ink color</span
                >
                for your sheet.
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
        </div>
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
            <!-- <button
                class="btn btn--alt"
                :class="{ 'no-click': showCopyJsonMessage }"
                :disabled="showCopyJsonMessage"
                @click="onClickCopyJSON"
            >
                <span class="copy-message" v-if="showCopyJsonMessage"
                    >Copied!</span
                >
                <span v-else>Copy JSON</span>
            </button> -->
            <button
                class="btn btn--alt"
                :class="{ 'no-click': showCopyUrlMessage }"
                :disabled="showCopyUrlMessage"
                @click="onClickCopyURL"
            >
                <span class="copy-message" v-if="showCopyUrlMessage"
                    >Copied!</span
                >
                <span v-else>Share as URL</span>
            </button>
            <button class="btn" @click="onClickSavePNG">Save as Image</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { trackEvent } from '@/main';
import { Scoundrel } from '@/scoundrel';
import { paintSheet } from '@/sheet-painter';
import { makeSemanticId } from '@/util/id-util';
import {
    encodeJsonToUrl,
    getSemanticScoundrelName,
} from '@/util/scoundrel-util';
import { ref } from 'vue';
import stepHeader from '../step-header.vue';

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

const sheetType = ref<'classic' | 'deep-cuts'>('classic');
const showCopyJsonMessage = ref(false);
const showCopyUrlMessage = ref(false);
const selectedInkColor = ref(inkColors[0]);

const sheetDataUrl = ref('');
const sheetPreview = ref<HTMLImageElement | null>(null);
generatePNG();

let generatedUrl = '';
try {
    generatedUrl = `${window.location.origin}/import/${encodeJsonToUrl(props.scoundrel)}`;
} catch (e) {
    console.error('Error encoding scoundrel to base64', e);
}

function onClickChangeInkColor(color: string) {
    selectedInkColor.value = color;
    generatePNG();
}

function onClickCopyURL() {
    trackEvent('copy-url');
    navigator.clipboard.writeText(generatedUrl);
    showCopyUrlMessage.value = true;
    setTimeout(() => {
        showCopyUrlMessage.value = false;
    }, 2000);
}

function onClickCopyJSON() {
    trackEvent('copy-json');
    const scoundrelCopy = { ...props.scoundrel };
    scoundrelCopy.id = makeSemanticId();
    navigator.clipboard.writeText(JSON.stringify(scoundrelCopy));
    showCopyJsonMessage.value = true;
    setTimeout(() => {
        showCopyJsonMessage.value = false;
    }, 2000);
}

async function generatePNG() {
    trackEvent('generate-png', {
        inkColor: selectedInkColor.value,
        playbook: props.scoundrel.playbook,
        background: props.scoundrel.background,
        backgroundDetail: props.scoundrel.backgroundDetail,
        heritage: props.scoundrel.heritage,
        heritageDetail: props.scoundrel.heritageDetail,
        name: props.scoundrel.name,
        alias: props.scoundrel.alias,
        vice: props.scoundrel.vice,
        viceDetail: props.scoundrel.viceDetail,
    });
    const canvas = await paintSheet(
        props.scoundrel,
        selectedInkColor.value,
        sheetType.value
    );
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.6rem;
    padding: 1.2rem;
}

.ink-row {
    display: flex;
    width: 100%;
    justify-content: center;
    align-content: center;
    gap: 1.2rem;
    > p {
        white-space: nowrap;
    }
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
    // width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
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

.row {
    margin: 0 auto;
}

span.filled {
    font-family: var(--font-handwriting);
    font-size: 2rem;
}

.sheet-type {
    margin: 0 auto;

    > a.selected {
        color: var(--color-primary);
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
    .ink-row {
        align-items: center;
        flex-direction: column;
        gap: 0.6rem;
    }

    .row {
        margin-top: auto;
        width: 100%;
        flex-direction: column;
    }
}
</style>
