<template>
    <step-header>
        <h2>What are your strongest attributes?</h2>
        <p>
            Assign action dots to attributes that best represent your scoundrel.
        </p>
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
                <label for="optionActionsCreatingCharacter"
                    >Character Creation: 7 action dots total, limit 2 dots per
                    action</label
                >
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
                <label for="optionActionsMasteryAdvance"
                    >Mastery Advance: Allow actions to advance to 4</label
                >
            </div>

            <!-- <p>
                During creation, assign
                <strong>4 more</strong> action dots (a total of 7, including the
                ones from your Playbook). No action may begin with more than 2
                dots. After creation, action ratings may advance up to 3 and up
                to 4 after unlocking the crew's mastery advance.
            </p> -->
        </div>
        <div class="callout suggested-actions" v-if="hasSuggestedActions">
            Action ratings suggested by your background and heritage:
            <span v-html="suggestedRatingsHTML"></span>
        </div>

        <div class="action-tally">
            <p>
                <strong>{{ totalActionRatings }}</strong
                ><span v-if="scoundrel.optionActionsCreatingCharacter">
                    of 7</span
                >
                action dots assigned
            </p>
        </div>

        <div class="attributes-list">
            <div
                class="attribute"
                v-for="attribute in attributes"
                :key="attribute.id"
            >
                <label
                    >{{ attribute.label }} ({{
                        getAttributeValue(attribute.id)
                    }})
                </label>
                <ul :class="attribute.id">
                    <li
                        v-for="action in actionsByAttribute(attribute.id)"
                        :key="action.id"
                    >
                        <div class="action-row">
                            <ActionTag
                                :action="action.id"
                                :value="
                                    getActionValue(
                                        scoundrel.actions,
                                        action.id as Action
                                    )
                                "
                            />
                            <div class="controls">
                                <button
                                    class="btn btn--mini"
                                    :class="{
                                        disabled:
                                            !scoundrel.actions[action.id]
                                                .custom,
                                    }"
                                    @click="changeAction(action.id, -1)"
                                >
                                    <img src="/assets/icons/minus.png" />
                                </button>
                                <button
                                    class="btn btn--mini"
                                    :class="{
                                        disabled:
                                            getActionValue(
                                                scoundrel.actions,
                                                action.id as Action
                                            ) === maxActionValue ||
                                            (scoundrel.optionActionsCreatingCharacter &&
                                                totalActionRatings >= 7),
                                    }"
                                    @click="changeAction(action.id, 1)"
                                >
                                    <img src="/assets/icons/plus.png" />
                                </button>
                            </div>
                        </div>
                        <p>{{ action.description }}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import actionRatingsData from '@/assets/data/action-ratings.json';
import backgroundDetailsData from '@/assets/data/background-details.json';
import { Action, ActionRating, TraitDetail } from '@/assets/data/data-types';
import heritageDetailsData from '@/assets/data/heritage-details.json';
import ActionTag from '@/components/action-tag.vue';
import StepHeader from '@/components/step-header.vue';
import { Scoundrel } from '@/scoundrel';
import {
    getActionRating,
    getActionValue,
    getAttributeColor,
} from '@/util/action-util';
import { computed, onMounted } from 'vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

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

const attributes = [
    {
        id: 'insight',
        label: 'Insight',
    },
    {
        id: 'prowess',
        label: 'Prowess',
    },
    {
        id: 'resolve',
        label: 'Resolve',
    },
];

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
        count += getActionValue(props.scoundrel.actions, action as Action);
    }

    return count;
});

const hasSuggestedActions = computed(() => {
    const heritageDetails = heritageDetailsData as unknown as TraitDetail[];
    const backgroundDetails = backgroundDetailsData as unknown as TraitDetail[];

    const heritageDetailActions =
        heritageDetails.find(
            (detail) => detail.label === props.scoundrel.heritageDetail
        )?.suggestedActions || [];

    const backgroundDetailActions =
        backgroundDetails.find(
            (detail) => detail.label === props.scoundrel.backgroundDetail
        )?.suggestedActions || [];

    return (
        heritageDetailActions.length > 0 || backgroundDetailActions.length > 0
    );
});

const suggestedRatingsHTML = computed(() => {
    const heritageDetails = heritageDetailsData as unknown as TraitDetail[];
    const backgroundDetails = backgroundDetailsData as unknown as TraitDetail[];

    // Remember: Heritage detail and background detail are stored in the scoundrel as the label, not the id
    const heritageDetailActions =
        heritageDetails.find(
            (detail) => detail.label === props.scoundrel.heritageDetail
        )?.suggestedActions || [];
    const backgroundDetailActions =
        backgroundDetails.find(
            (detail) => detail.label === props.scoundrel.backgroundDetail
        )?.suggestedActions || [];

    // isImportant is true if the action is suggested by both the background and heritage
    const suggestedActions: {
        actionRating: ActionRating;
        isImportant: boolean;
        color: string;
    }[] = [];

    heritageDetailActions.forEach((action) => {
        const actionRating = getActionRating(action)!;
        suggestedActions.push({
            actionRating,
            isImportant: false,
            color: getAttributeColor(actionRating.attribute),
        });
    });

    backgroundDetailActions.forEach((action) => {
        const actionRating = getActionRating(action)!;
        const index = suggestedActions.findIndex(
            (a) => a.actionRating.id === actionRating.id
        );
        if (index === -1)
            suggestedActions.push({
                actionRating,
                isImportant: false,
                color: getAttributeColor(actionRating.attribute),
            });
        else suggestedActions[index].isImportant = true;
    });

    // Sort suggestedActions by their attribute
    const attributesOrder = ['insight', 'prowess', 'resolve'];
    suggestedActions.sort((a, b) => {
        const aIndex = attributesOrder.indexOf(a.actionRating!.attribute);
        const bIndex = attributesOrder.indexOf(b.actionRating!.attribute);
        if (aIndex < bIndex) return -1;
        if (aIndex > bIndex) return 1;
        return 0;
    });

    return suggestedActions
        .map(
            (action) =>
                `<span style="color: ${action.color}" class="suggestion${action.isImportant ? '--important' : ''}">${action.actionRating.label}</span>`
        )
        .join(', ');
});

function actionsByAttribute(attribute: string) {
    return (actionRatingsData as unknown as ActionRating[]).filter(
        (action) => action.attribute === attribute
    );
}

function changeAction(action: Action, value: number) {
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
        getActionValue(props.scoundrel.actions, action.id as Action) > 0
            ? count++
            : null;
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

:deep(.suggestion--important) {
    // font-weight: bold;
    // font-style: italic;
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
