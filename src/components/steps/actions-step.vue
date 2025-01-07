<template>
    <step-header>
        <h2 v-html="$t('User-interface.Steps.Actions.title')"></h2>
        <p v-html="$t('User-interface.Steps.Actions.subtitle')"></p>
    </step-header>

    <div class="actions">
        <div class="callout options">
            <div
                class="checkbox-group"
                :class="{ disabled: scoundrel.optionActionsMasteryAdvance }"
            >
                <input
                    type="checkbox"
                    id="optionActionsCreatingCharacter"
                    v-model="scoundrel.optionActionsCreatingCharacter"
                />
                <label for="optionActionsCreatingCharacter">
                    {{
                        $t(
                            'User-interface.Steps.Actions.Options.character-creation-button'
                        )
                    }}
                </label>
            </div>
            <div
                class="checkbox-group"
                :class="{ disabled: scoundrel.optionActionsCreatingCharacter }"
            >
                <input
                    type="checkbox"
                    id="optionActionsMasteryAdvance"
                    v-model="scoundrel.optionActionsMasteryAdvance"
                />
                <label for="optionActionsMasteryAdvance">
                    {{
                        $t(
                            'User-interface.Steps.Actions.Options.mastery-advance-button'
                        )
                    }}
                </label>
            </div>
        </div>
        <div class="callout suggested-actions" v-if="hasSuggestedActions">
            {{ $t('User-interface.Steps.Actions.suggested-actions') }}
            <span v-html="suggestedRatingsHTML"></span>
        </div>

        <div class="action-tally">
            <p
                v-if="scoundrel.optionActionsCreatingCharacter"
                v-html="
                    $t(
                        'User-interface.Steps.Actions.Action-tally.with-character-creation',
                        { count: totalActionRatings }
                    )
                "
            ></p>
            <p
                v-else
                v-html="
                    $t(
                        'User-interface.Steps.Actions.Action-tally.without-character-creation',
                        { count: totalActionRatings }
                    )
                "
            ></p>
        </div>

        <div class="attributes-list">
            <div
                class="attribute"
                v-for="attribute in attributes"
                :key="attribute"
            >
                <label
                    >{{ $t(`Attributes.${attribute}`) }} ({{
                        getAttributeValue(attribute)
                    }})
                </label>
                <ul :class="attribute">
                    <li
                        v-for="action in actionsByAttribute(attribute)"
                        :key="action"
                    >
                        <div class="action-row">
                            <ActionTag
                                :action="action"
                                :value="
                                    getActionValue(scoundrel.actions, action)
                                "
                            />
                            <div class="controls">
                                <button
                                    class="btn btn--mini"
                                    :class="{
                                        disabled:
                                            !scoundrel.actions[action].custom,
                                    }"
                                    @click="changeAction(action, -1)"
                                >
                                    <img src="/assets/icons/minus.png" />
                                </button>
                                <button
                                    class="btn btn--mini"
                                    :class="{
                                        disabled:
                                            getActionValue(
                                                scoundrel.actions,
                                                action
                                            ) === maxActionValue ||
                                            (scoundrel.optionActionsCreatingCharacter &&
                                                totalActionRatings >= 7),
                                    }"
                                    @click="changeAction(action, 1)"
                                >
                                    <img src="/assets/icons/plus.png" />
                                </button>
                            </div>
                        </div>
                        <p>
                            {{
                                $t(`Actions.${capitalize(action)}.description`)
                            }}
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import attributesData from '@/assets/data/attributes.json';
import backgroundDetailsData from '@/assets/data/background-suggestions.json';
import { TraitDetail } from '@/assets/data/data-types';
import heritageDetailsData from '@/assets/data/heritage-suggestions.json';
import ActionTag from '@/components/action-tag.vue';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import {
    getActionValue,
    getAttribute,
    getAttributeColor,
} from '@/util/action-util';
import { capitalize } from '@/util/string-util';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const attributes = Object.keys(attributesData);

// Default options
if (props.scoundrel.optionActionsCreatingCharacter === undefined)
    props.scoundrel.optionActionsCreatingCharacter = true;
if (!props.scoundrel.optionActionsMasteryAdvance === undefined)
    props.scoundrel.optionActionsMasteryAdvance = false;

const maxActionValue = computed(() => {
    if (props.scoundrel.optionActionsCreatingCharacter) return 2;
    if (props.scoundrel.optionActionsMasteryAdvance) return 4;
    return 3;
});

// Check when the sticky action tally should change its style (add the .pinned class)
// Wait for the element to be rendered
onMounted(() => {
    const el = document.querySelector('.action-tally')!;
    const observer = new IntersectionObserver(
        ([e]) => {
            e.target.classList.toggle('pinned', e.intersectionRatio < 1);
        },
        { threshold: 1 }
    );

    observer.observe(el);
});

// Add up all values
const totalActionRatings = computed(() => {
    let count = 0;
    for (const action of Object.keys(props.scoundrel.actions)) {
        count += getActionValue(props.scoundrel.actions, action);
    }

    return count;
});

const hasSuggestedActions = computed(() => {
    const heritageDetails = heritageDetailsData as unknown as TraitDetail[];
    const backgroundDetails = backgroundDetailsData as unknown as TraitDetail[];

    const heritageDetailActions =
        heritageDetails.find(
            (detail) =>
                useI18n().t(`Heritage-suggestions.${detail.id}`) ===
                props.scoundrel.heritageDetail
        )?.suggestedActions || [];

    const backgroundDetailActions =
        backgroundDetails.find(
            (detail) =>
                useI18n().t(`Background-suggestions.${detail.id}`) ===
                props.scoundrel.backgroundDetail
        )?.suggestedActions || [];

    return (
        heritageDetailActions.length > 0 || backgroundDetailActions.length > 0
    );
});

const suggestedRatingsHTML = computed(() => {
    const heritageDetails = heritageDetailsData as unknown as TraitDetail[];
    const backgroundDetails = backgroundDetailsData as unknown as TraitDetail[];

    // Heritage detail is stored in the scoundrel as the localized label, not the id
    const heritageDetailActions =
        heritageDetails.find((detail) => {
            const heritageDetailLabel = useI18n().t(
                `Heritage-suggestions.${detail.id}`
            );
            return heritageDetailLabel === props.scoundrel.heritageDetail;
        })?.suggestedActions || [];

    // Background detail is stored in the scoundrel as the localized label, not the id
    const backgroundDetailActions =
        backgroundDetails.find((detail) => {
            const backgroundDetailLabel = useI18n().t(
                `Background-suggestions.${detail.id}`
            );
            return backgroundDetailLabel === props.scoundrel.backgroundDetail;
        })?.suggestedActions || [];

    // isImportant is true if the action is suggested by both the background and heritage
    const suggestedActions: {
        action: string;
        isImportant: boolean;
    }[] = [];

    heritageDetailActions.forEach((action) => {
        suggestedActions.push({
            action,
            isImportant: false,
        });
    });

    backgroundDetailActions.forEach((action) => {
        const index = suggestedActions.findIndex(
            (suggestedAction) => suggestedAction.action === action
        );
        if (index === -1)
            suggestedActions.push({
                action,
                isImportant: false,
            });
        else suggestedActions[index].isImportant = true;
    });

    // Sort suggestedActions by their attribute (order of attributes.json)
    const attributesOrder = Object.keys(attributesData);
    suggestedActions.sort((a, b) => {
        const aIndex = attributesOrder.indexOf(getAttribute(a.action)!);
        const bIndex = attributesOrder.indexOf(getAttribute(b.action)!);
        if (aIndex < bIndex) return -1;
        if (aIndex > bIndex) return 1;
        return 0;
    });

    console.log(suggestedActions);

    return suggestedActions
        .map((suggestedAction) => {
            const actionLabel = useI18n().t(
                `Actions.${capitalize(suggestedAction.action)}.label`
            );
            return `<span style="color: ${getAttributeColor(getAttribute(suggestedAction.action)!)}" class="suggestion${suggestedAction.isImportant ? '--important' : ''}">${actionLabel}</span>`;
        })
        .join(', ');
});

function actionsByAttribute(attribute: string): string[] {
    return attributesData[attribute as keyof typeof attributesData];
}

function changeAction(action: string, value: number) {
    if (!props.scoundrel.actions[action].custom)
        props.scoundrel.actions[action].custom = 0;

    if (value < 0) props.scoundrel.actions[action].custom--;
    if (value > 0) props.scoundrel.actions[action].custom++;

    if (props.scoundrel.actions[action].custom <= 0)
        delete props.scoundrel.actions[action].custom;
}

function getAttributeValue(attribute: string) {
    // Number of actions with this attribute, that have at least 1 dot assigned
    let count = 0;
    actionsByAttribute(attribute).forEach((action) => {
        getActionValue(props.scoundrel.actions, action) > 0 ? count++ : null;
    });

    return count;
}
</script>

<style scoped lang="scss">
.actions {
    padding: 0 1.2rem;
}

.options {
    margin-bottom: 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.suggested-actions {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.attributes-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.4rem;
    > .attribute {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        padding: 1.2rem;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;

        ul {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;

            li {
                display: flex;
                flex-direction: column;
                gap: 0.6rem;
                align-items: flex-start;

                p {
                    margin-bottom: 0.8rem;
                }
            }
        }
    }
}

.action-row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .controls {
        display: flex;
        gap: 0.2rem;
    }
}

.action-tally {
    padding: 0.8rem;
    display: flex;
    position: sticky;
    top: -1px;
    justify-content: center;
    background-color: var(--color-primary);
    z-index: 1;

    * {
        color: var(--color-surface);
    }
}

.pinned {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

@media (max-width: 768px) {
    .attributes-list {
        grid-template-columns: 1fr;

        .attribute > ul > li {
            height: auto;
        }
    }
}
</style>
