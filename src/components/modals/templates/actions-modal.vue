<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h3>Action Ratings</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="actions">
                <p>
                    No action may begin with a rating higher than 2 during
                    character creation. After creation, action ratings may
                    advance up to 3 and up to 4 after unlocking the Mastery
                    advance.
                </p>

                <div class="callout">
                    Action Ratings suggested by your Background and Heritage:
                    <span v-html="suggestedRatingsHTML"></span>
                </div>

                <p>Total action points used: {{ totalActionRatings }}</p>

                <div class="attributes-grid">
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
                                v-for="action in actionsByAttribute(
                                    attribute.id
                                )"
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
                                                    !scoundrel.actions[
                                                        action.id
                                                    ].custom,
                                            }"
                                            @click="changeAction(action.id, -1)"
                                        >
                                            <img
                                                src="/assets/icons/minus.png"
                                            />
                                        </button>
                                        <button
                                            class="btn btn--mini"
                                            :class="{
                                                disabled:
                                                    getActionValue(
                                                        scoundrel.actions,
                                                        action.id as Action
                                                    ) === 4,
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
    </ModalFrame>
</template>

<script setup lang="ts">
import actionRatingsData from '@/assets/data/action-ratings.json';
import backgroundDetailsData from '@/assets/data/background-details.json';
import { Action, ActionRating, TraitDetail } from '@/assets/data/data-types';
import heritageDetailsData from '@/assets/data/heritage-details.json';
import ActionTag from '@/components/action-tag.vue';
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { Scoundrel } from '@/scoundrel';
import {
    getActionRating,
    getActionValue,
    getAttributeColor,
} from '@/util/action-util';
import { computed } from 'vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

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

// Add up all values
const totalActionRatings = computed(() => {
    let count = 0;
    for (const action of Object.keys(props.scoundrel.actions)) {
        count += getActionValue(props.scoundrel.actions, action as Action);
    }

    return count;
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
    // Number of actions with this attribute, that have at least 1 point assigned
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
    max-width: 72rem;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    justify-content: space-between;

    .attributes-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.4rem;
        > .attribute {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            padding: 1.2rem;
            background-color: rgba(0, 0, 0, 0.1);

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

@media (max-width: 768px) {
    .actions {
        max-width: 100%;

        .attributes-grid {
            grid-template-columns: 1fr;

            .attribute > ul > li {
                height: auto;
            }
        }
    }
}
</style>
