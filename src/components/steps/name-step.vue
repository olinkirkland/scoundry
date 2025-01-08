<template>
    <step-header>
        <h2 v-html="$t('User-interface.Steps.Name-and-look.title')"></h2>
        <p v-html="$t('User-interface.Steps.Name-and-look.subtitle')"></p>
    </step-header>
    <div class="name">
        <div class="input-with-suggestions">
            <div class="input-block">
                <label>
                    {{ $t('User-interface.Steps.Name-and-look.name-prompt') }}
                </label>
                <input type="text" v-model="scoundrel.name" />
            </div>
            <button class="btn btn--alt" @click="randomizeName">
                {{
                    $t(
                        'User-interface.Steps.Name-and-look.randomize-name-button'
                    )
                }}
            </button>
        </div>
        <div class="input-with-suggestions">
            <div class="input-block">
                <label>
                    {{ $t('User-interface.Steps.Name-and-look.alias-prompt') }}
                </label>
                <input type="text" v-model="scoundrel.alias" />
            </div>
            <button class="btn btn--alt" @click="randomizeAlias">
                {{
                    $t(
                        'User-interface.Steps.Name-and-look.randomize-alias-button'
                    )
                }}
            </button>
        </div>
        <div class="input-with-suggestions">
            <div class="input-block">
                <label>
                    {{ $t('User-interface.Steps.Name-and-look.look-prompt') }}
                </label>
                <input type="text" v-model="scoundrel.look" />
            </div>
            <button class="btn btn--alt" @click="randomizeLook">
                {{
                    $t(
                        'User-interface.Steps.Name-and-look.randomize-look-button'
                    )
                }}
            </button>
        </div>
    </div>
    <div class="portraits-block">
        <label>
            {{ $t('User-interface.Steps.Name-and-look.portrait-prompt') }}
        </label>
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
import i18n from '@/i18n/locale';
import { Scoundrel } from '@/scoundrel';
import { randomItem } from '@/util/random';
import { capitalize } from '@/util/string-util';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const firstNames = namesData.firstNames;
const lastNames = namesData.lastNames;
const aliases = namesData.aliases;
const adjectives = looksData.personWordAdjectives;
const apparel = looksData.apparel;
const portraits = portraitsData;

function randomizeName() {
    props.scoundrel.name = `${randomItem(firstNames)} ${randomItem(lastNames)}`;
}

function randomizeAlias() {
    props.scoundrel.alias = randomItem(aliases);
}

function randomizeLook() {
    const lookTemplatesKeys = [
        'one-adjective-one-apparel',
        'one-adjective-two-apparel',
        'two-adjectives-one-apparel',
        'two-adjectives-two-apparel'
    ];

    const personWordsKeys = ['man', 'woman', 'person', 'child'];
    const wearingWordsKeys = ['wearing', 'sporting', 'dressed-in'];

    const personWordKey = randomItem(personWordsKeys);
    const personWordArticle = i18n.global.t(
        `Looks.Person-words.${personWordKey}.article`
    );
    const personWord = i18n.global.t(
        `Looks.Person-words.${personWordKey}.word`
    );
    const personWordAdjective1 = i18n.global.t(
        `Looks.Person-word-adjectives.${randomItem(adjectives)}`
    );
    const personWordAdjective2 = i18n.global.t(
        `Looks.Person-word-adjectives.${randomItem(adjectives)}`
    );
    const wearingWordKey = randomItem(wearingWordsKeys);
    const wearingWord = i18n.global.t(`Looks.Joining-words.${wearingWordKey}`);

    const apparel1 = i18n.global.t(`Looks.Apparel.${randomItem(apparel)}`);
    const apparel2 = i18n.global.t(`Looks.Apparel.${randomItem(apparel)}`);

    const lookTemplate = randomItem(lookTemplatesKeys);
    const look = i18n.global.t(`Looks.Templates.${lookTemplate}`, {
        personWordArticle: personWordArticle,
        personWordAdjective1: personWordAdjective1,
        personWordAdjective2: personWordAdjective2,
        personWord: personWord,
        wearingVerb: wearingWord,
        apparel1: apparel1,
        apparel2: apparel2
    });

    props.scoundrel.look = capitalize(look);
    return;
}

function joinWithAnd(arr: string[]) {
    if (arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2)
        return arr.join(` ${i18n.global.t('Looks.Joining-words.and')} `);
    return (
        arr.slice(0, -1).join(', ') +
        `, ${i18n.global.t('Looks.Joining-words.and')} ` +
        arr.slice(-1)
    );
}

function getPortraitSource(portraitPath: string) {
    const source = portraits.find((p) => p.path === portraitPath)?.source;
    if (source) return `(${source})`;
    return 'No source';
}
</script>

<style scoped lang="scss">
.name {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    gap: 2rem;
    padding: 0 1.2rem;
    max-width: 96rem;

    > :last-child {
        grid-column: 1 / -1;
    }
}

.input-with-suggestions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .input-block {
        max-width: unset;
        width: 100%;
    }
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
        grid-column: 1 / -1;
    }
}
</style>
