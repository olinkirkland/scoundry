<template>
    <step-header>
        <h2 v-html="$t('User-interface.Steps.Vice.title')"></h2>
        <p v-html="$t('User-interface.Steps.Vice.description')"></p>
    </step-header>
    <div class="list-container-frame">
        <div class="list-container">
            <ul class="vices-list">
                <trait-card
                    v-for="vice in vices"
                    :key="vice"
                    :label="i18n.global.t(`Vices.${capitalize(vice)}.label`)"
                    :selected="vice === scoundrel.vice"
                    @click="onClickVice(vice)"
                />
            </ul>
        </div>
    </div>

    <p v-if="scoundrel.vice" class="description">
        {{ $t(`Vices.${capitalize(scoundrel.vice)}.description`) }}
    </p>
    <p v-else class="description">
        {{ $t('User-interface.Steps.Vice.select-prompt') }}
    </p>
    <section v-if="scoundrel.vice" class="selected-vice">
        <div class="input-block">
            <label>
                {{ $t('User-interface.Steps.Vice.purveyor-prompt') }}
            </label>
            <input type="text" v-model="scoundrel.viceDetail" />
        </div>

        <ul class="vice-details-list">
            <li
                v-for="detail in filteredViceSuggestions"
                :key="detail.id"
                class="vice-detail"
                :class="{
                    selected:
                        i18n.global.t(
                            `Vice-suggestions.${capitalize(detail.id)}.text`
                        ) === scoundrel.viceDetail
                }"
                @click="onClickViceDetail(detail.id)"
            >
                <h2>
                    {{ $t(`Vice-suggestions.${capitalize(detail.id)}.label`) }}
                </h2>
                <p
                    v-if="
                        $te(
                            `Vice-suggestions.${capitalize(detail.id)}.description`
                        )
                    "
                >
                    {{
                        $t(
                            `Vice-suggestions.${capitalize(detail.id)}.description`
                        )
                    }}
                </p>
                <label
                    v-if="
                        $te(
                            `Vice-suggestions.${capitalize(detail.id)}.district`
                        )
                    "
                    >{{
                        $t(`Vice-suggestions.${capitalize(detail.id)}.district`)
                    }}</label
                >
            </li>
        </ul>
    </section>
</template>

<script setup lang="ts">
import viceSuggestions from '@/assets/data/vice-suggestions.json';
import vices from '@/assets/data/vices.json';
import StepHeader from '@/components/step-header.vue';
import TraitCard from '@/components/trait-card.vue';
import { TraitDetail } from '@/data-types';
import i18n from '@/i18n/locale';
import { Scoundrel } from '@/scoundrel';
import { capitalize } from '@/util/string-util';
import { computed } from 'vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const filteredViceSuggestions = computed(() => {
    if (!props.scoundrel.vice) return [];
    return viceSuggestions.filter(
        (viceSuggestion: TraitDetail) =>
            !viceSuggestion.trait ||
            viceSuggestion.trait === props.scoundrel.vice ||
            viceSuggestion.trait.includes(props.scoundrel.vice)
    );
});

function onClickVice(vice: string) {
    // Choose the vice, and clear the vice detail
    props.scoundrel.vice = vice;
    props.scoundrel.viceDetail = '';
}

function onClickViceDetail(viceDetail: string) {
    // Set the vice detail to empty if it's already selected
    if (
        props.scoundrel.viceDetail ===
        i18n.global.t(`Vice-suggestions.${capitalize(viceDetail)}.text`)
    ) {
        props.scoundrel.viceDetail = '';
        return;
    }

    // Choose the vice detail
    props.scoundrel.viceDetail = i18n.global.t(
        `Vice-suggestions.${capitalize(viceDetail)}.text`
    );
}
</script>

<style scoped lang="scss">
.list-container-frame {
    display: flex;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 1rem !important;
    > .list-container {
        border-radius: 5px;
        display: flex;
        justify-content: center;
        margin: 0 1.2rem;
        overflow: hidden;
        > ul.vices-list {
            display: flex;
            width: fit-content;
            margin: 0 auto;
            gap: 0.4rem;
        }
    }
}

p.description {
    text-align: center;
    width: 100%;
    opacity: 0.8;
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
    max-width: 64rem;
}

input {
    margin-bottom: 1.2rem;
}

section.selected-vice {
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
}

ul.vice-details-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
    grid-auto-rows: 1fr;
    gap: 0.4rem;
}

ul.vice-details-list > li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    background-color: var(--color-surface);

    > h2 {
        font-size: 1.6rem;
    }

    > p {
        text-align: center;
    }

    &.selected {
        background-color: transparent;
        > * {
            color: var(--color-primary);
        }
    }
}

p.reference {
    margin: 0.8rem;
    text-align: center;
}

@media (max-width: 1024px) {
    ul.vices-list {
        overflow-x: auto;
        scrollbar-width: none;
    }
}

@media (max-width: 768px) {
    p.description {
        text-align: left;
    }
}
</style>
