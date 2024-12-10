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
                    character creation.
                    <em class="muted">
                        After creation, action ratings may advance up to 3. When
                        you unlock the Mastery advance for your crew, you can
                        advance actions up to rating 4.
                    </em>
                </p>
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
                                            getActionValueBySlug(
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
                                                    getActionValueBySlug(
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
import { Action, ActionRating } from '@/assets/data/data-types';
import ActionTag from '@/components/action-tag.vue';
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { Scoundrel } from '@/scoundrel';
import { getActionValueBySlug } from '@/util/action-util';
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
        count += getActionValueBySlug(
            props.scoundrel.actions,
            action as Action
        );
    }

    return count;
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
        getActionValueBySlug(props.scoundrel.actions, action.id as Action) > 0
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
