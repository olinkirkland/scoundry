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
                    advance up to 3. When you unlock the Mastery advance for
                    your crew, you can advance actions up to rating 4.
                </p>

                <div class="attributes-grid">
                    <div class="attribute">
                        <label>Insight</label>
                        <ul class="insight">
                            <li
                                v-for="action in insightActions"
                                :key="action.slug"
                            >
                                <ActionTag
                                    :action="action.slug"
                                    :value="
                                        getActionValueBySlug(
                                            scoundrel.actions,
                                            action.slug as Action
                                        )
                                    "
                                />
                                <p>{{ action.description }}</p>
                            </li>
                        </ul>
                    </div>
                    <div class="attribute">
                        <label>Prowess</label>
                        <ul class="prowess">
                            <li
                                v-for="action in prowessActions"
                                :key="action.slug"
                            >
                                <ActionTag
                                    :action="action.slug"
                                    :value="
                                        getActionValueBySlug(
                                            scoundrel.actions,
                                            action.slug as Action
                                        )
                                    "
                                />
                                <p>{{ action.description }}</p>
                            </li>
                        </ul>
                    </div>
                    <div class="attribute">
                        <label>Resolve</label>
                        <ul class="resolve">
                            <li
                                v-for="action in resolveActions"
                                :key="action.slug"
                            >
                                <ActionTag
                                    :action="action.slug"
                                    :value="
                                        getActionValueBySlug(
                                            scoundrel.actions,
                                            action.slug as Action
                                        )
                                    "
                                />
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
import actionsData from '@/assets/data/actions.json';
import { Action } from '@/assets/data/data-types';
import ActionTag from '@/components/action-tag.vue';
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { Scoundrel } from '@/scoundrel';
import { getActionValueBySlug } from '@/util/action-util';
import { computed } from 'vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const insightActions = computed(() => {
    return actionsData.filter((action) => action.category === 'insight');
});

const prowessActions = computed(() => {
    return actionsData.filter((action) => action.category === 'prowess');
});

const resolveActions = computed(() => {
    return actionsData.filter((action) => action.category === 'resolve');
});
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
                    height: 12rem;

                    p {
                        font-size: 1.2rem;
                        margin-bottom: 0.8rem;
                        opacity: 0.8;
                    }
                }
            }
        }
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
