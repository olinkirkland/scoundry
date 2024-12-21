<template>
    <step-header>
        <h2>Record your name and look</h2>
        <p>
            Your name is your identity. Your look is your brand. Both are
            important to your reputation.
        </p>
    </step-header>
    <div class="name">
        <div class="input-with-suggestions">
            <div class="input-block">
                <label>Your name</label>
                <input type="text" v-model="scoundrel.name" />
            </div>
            <button class="btn btn--alt" @click="randomizeName">
                Randomize Name
            </button>
        </div>
        <div class="input-with-suggestions">
            <div class="input-block">
                <label>Your alias</label>
                <input type="text" v-model="scoundrel.alias" />
            </div>
            <button class="btn btn--alt" @click="randomizeAlias">
                Randomize Alias
            </button>
        </div>
        <div class="input-with-suggestions">
            <div class="input-block">
                <label>Your look</label>
                <input type="text" v-model="scoundrel.look" />
            </div>
            <button class="btn btn--alt" @click="randomizeLook">
                Randomize Look
            </button>
        </div>
    </div>
    <div class="portraits-block">
        <label>Choose a portrait</label>
        <ul class="portraits-list">
            <li
                v-for="portrait in portraits"
                :key="portrait.path"
                @click="
                    scoundrel.portrait == portrait.path
                        ? (scoundrel.portrait = '')
                        : (scoundrel.portrait = portrait.path)
                "
                :class="{ selected: scoundrel.portrait === portrait.path }"
            >
                <img :src="`/assets/${portrait.path}`" />
            </li>
        </ul>
        <label v-if="scoundrel.portrait"
            >{{ scoundrel.portrait }} ...
            {{ getPortraitSource(scoundrel.portrait) }}</label
        >
    </div>
</template>

<script setup lang="ts">
import looksData from '@/assets/data/looks.json';
import namesData from '@/assets/data/names.json';
import portraitsData from '@/assets/data/portraits.json';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import { randomItem } from '@/util/random';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const firstNames = namesData.firstNames;
const lastNames = namesData.lastNames;
const aliases = namesData.aliases;
const adjectives = looksData.adjectives;
const clothes = looksData.clothes;
const portraits = portraitsData;

function randomizeName() {
    props.scoundrel.name = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
}

function randomizeAlias() {
    props.scoundrel.alias = randomItem(aliases);
}

function randomizeLook() {
    const adjectiveCount = Math.floor(Math.random() * 2) + 1;
    const adjectiveList = Array.from({ length: adjectiveCount }, () =>
        randomItem(adjectives).toLowerCase()
    );
    const clothesCount = Math.floor(Math.random() * 2) + 1;
    const clothesList = Array.from({ length: clothesCount }, () =>
        randomItem(clothes).toLowerCase()
    );
    const personWord = randomItem(['man', 'woman', 'person']);
    const wearingWord = randomItem(['wearing', 'sporting', 'dressed in']);

    const aOrAn =
        adjectiveList[0].startsWith('a') ||
        adjectiveList[0].startsWith('e') ||
        adjectiveList[0].startsWith('i') ||
        adjectiveList[0].startsWith('o') ||
        adjectiveList[0].startsWith('u')
            ? 'An'
            : 'A';

    let sentence = `${aOrAn} ${joinWithAnd(adjectiveList)} ${personWord} ${wearingWord} ${joinWithAnd(clothesList)}`;
    props.scoundrel.look = sentence;
}

function joinWithAnd(arr: string[]) {
    if (arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr.join(' and ');
    return arr.slice(0, -1).join(', ') + ', and ' + arr.slice(-1);
}

function getPortraitSource(portraitPath: string) {
    const source = portraits.find((p) => p.path === portraitPath)?.source;
    if (source) return `(${source})`;
    return 'No source';
}
</script>

<style scoped lang="scss">
.name {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;

    // Last elmeent stretches whole rwo
    > .input-with-suggestions:last-child {
        flex: 1 1 100%;

        .input-block {
            width: 100%;
        }
    }
}

.input-with-suggestions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.portraits-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    padding: 2rem;

    ul.portraits-list {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
        max-width: 64rem;

        > li {
            width: 8rem;
            height: 8rem;

            cursor: pointer;
            &.selected {
                position: relative;
                &::before {
                    // primary color border
                    content: '';
                    position: absolute;
                    border-radius: 50%;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border: 0.2rem solid var(--color-primary);
                    box-shadow: var(--shadow-md);
                }
            }

            &:hover {
                filter: brightness(1.1);
            }

            > img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
                overflow: hidden;
            }
        }
    }

    > label:last-child {
        margin-top: 1rem;
    }
}

@media (max-width: 768px) {
    .name > .input-with-suggestions {
        &:last-child {
            flex: unset;
        }
        > .input-block {
            width: 100%;
            margin: 0 1.2rem;
        }
    }
}
</style>
