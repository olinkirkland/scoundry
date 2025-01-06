<template>
    <step-header>
        <h2>Export your <strong>scoundrel</strong></h2>
        <p>Share or print your character sheet.</p>
    </step-header>
    <div class="save">
        <span class="sheet-type" v-if="false">
            <a
                @click="onClickChangeSheetType('classic')"
                :class="{
                    selected: props.scoundrel.preferredSheetType === 'classic',
                }"
                >Classic</a
            >
            or
            <a
                @click="onClickChangeSheetType('deep-cuts')"
                :class="{
                    selected:
                        props.scoundrel.preferredSheetType === 'deep-cuts',
                }"
            >
                Deep Cuts
            </a>
            ?
        </span>

        <div class="ink-row">
            <button class="btn btn--mini" @click="cycleFont">
                <img src="/assets/icons/font.png" alt="Change font" />
            </button>
            <ul class="ink-colors">
                <li
                    v-for="color in inkColors"
                    :key="color"
                    @click="onClickChangeInkColor(color)"
                    :style="{ backgroundColor: color, color: color }"
                    :class="{
                        active: color === props.scoundrel.preferredInkColor,
                    }"
                >
                    <img
                        v-if="color === props.scoundrel.preferredInkColor"
                        src="/assets/icons/done.png"
                        alt="Selected"
                    />
                </li>
            </ul>
        </div>

        <div class="preview-container">
            <img
                v-if="isLoading"
                class="spinner"
                src="/assets/icons/loading.png"
                alt="Loading"
            />
            <img
                ref="sheetPreview"
                class="preview"
                :class="{ 'is-loading': isLoading }"
            />
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
import { ref, computed, defineProps } from 'vue';
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

const fonts = ['font-sheet-1', 'font-sheet-2', 'font-sheet-3'];

if (!props.scoundrel.preferredInkColor)
    props.scoundrel.preferredInkColor = inkColors[0];
if (!props.scoundrel.preferredSheetType)
    props.scoundrel.preferredSheetType = 'classic';
if (!props.scoundrel.preferredFont) props.scoundrel.preferredFont = fonts[0];

const showCopyJsonMessage = ref(false);
const showCopyUrlMessage = ref(false);

const sheetDataUrl = ref('');
const sheetPreview = ref<HTMLImageElement | null>(null);
const isLoading = ref(true);
generatePNG();

let generatedUrl = '';
try {
    generatedUrl = `${window.location.origin}/import/${encodeJsonToUrl(props.scoundrel)}`;
} catch (e) {
    console.error('Error encoding scoundrel to base64', e);
}

function cycleFont() {
    const currentIndex = fonts.indexOf(props.scoundrel.preferredFont);
    const nextIndex = (currentIndex + 1) % fonts.length;
    props.scoundrel.preferredFont = fonts[nextIndex];
    generatePNG();
}

function onClickChangeInkColor(color: string) {
    props.scoundrel.preferredInkColor = color;
    generatePNG();
}

function onClickChangeSheetType(type: 'classic' | 'deep-cuts') {
    props.scoundrel.preferredSheetType = type;
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
    // Show the loading spinner
    isLoading.value = true;
    // sheetPreview.value.style.opacity = '0.1';

    trackEvent('generate-png', {
        inkColor: props.scoundrel.preferredInkColor,
        playbook: props.scoundrel.playbook,
        background: props.scoundrel.background,
        backgroundDetail: props.scoundrel.backgroundDetail,
        heritage: props.scoundrel.heritage,
        heritageDetail: props.scoundrel.heritageDetail,
        name: props.scoundrel.name,
        alias: props.scoundrel.alias,
        vice: props.scoundrel.vice,
        viceDetail: props.scoundrel.viceDetail,
        sheetType: props.scoundrel.preferredSheetType,
    });

    const canvas = await paintSheet(props.scoundrel);
    console.log(canvas);
    if (!canvas) return;

    sheetDataUrl.value = canvas.toDataURL('image/png');
    sheetPreview.value!.src = sheetDataUrl.value;
    sheetPreview.value.style.opacity = '1';

    // Hide the loading spinner
    isLoading.value = false;
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
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > img.spinner {
        position: absolute;
        animation: spin 1s linear infinite;
    }

    > img.preview {
        width: 100%;
        transition: all 0.2s;
        &.is-loading {
            opacity: 0.4 !important;
        }
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
