<template>
    <div ref="page" class="page page--make page-in" v-if="scoundrel && step">
        <ul ref="stepsEl" class="steps">
            <step-block
                v-for="s in steps"
                :data-step-id="s.id"
                :key="s.id"
                :stepLabel="s.label"
                :stepNumber="steps.findIndex((step) => step.id === s.id) + 1"
                :active="s.id === stepId"
                :completed="steps.indexOf(s) < steps.indexOf(step)"
                @click="changeStep(s.id)"
            />
        </ul>

        <div ref="stepContainer" class="step-container">
            <component
                v-if="stepId"
                :is="stepComponents[stepId]"
                :scoundrel="scoundrel"
            />
            <pre v-if="showModel">{{ scoundrel }}</pre>
        </div>

        <div class="control-bar">
            <button class="btn btn--icon" @click="onClickClose">
                <img src="/assets/icons/close.png" alt="Close" />
            </button>
            <button class="btn btn--icon disabled" @click="onClickDiscard">
                <img src="/assets/icons/trash.png" alt="Discard" />
            </button>
            <button class="btn btn--icon disabled" @click="onClickSave">
                <img src="/assets/icons/save.png" alt="Save" />
            </button>
            <div class="spacer"></div>
            <button
                class="btn"
                @click="onClickBackStep"
                :class="{ disabled: isFirstStep }"
            >
                Back
            </button>
            <button
                class="btn"
                @click="onClickNextStep"
                :class="{ disabled: isLastStep }"
            >
                Next
            </button>
            <button class="btn btn--icon" @click="onClickActions">
                <img src="/assets/icons/bars.png" alt="Info" />
                <div class="badge" v-if="actionsChanged"></div>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import ActionsModal from '@/components/modals/templates/actions-modal.vue';
import ConfirmModal from '@/components/modals/templates/confirm-modal.vue';
import StepBlock from '@/components/step-block.vue';
import StepAbilities from '@/components/steps/step-abilities.vue';
import StepBackground from '@/components/steps/step-background.vue';
import StepFriendsAndRivals from '@/components/steps/step-friends-and-rivals.vue';
import StepHeritageAndActions from '@/components/steps/step-heritage.vue';
import StepNameAndLook from '@/components/steps/step-name-and-look.vue';
import StepPlaybook from '@/components/steps/step-playbook.vue';
import StepVice from '@/components/steps/step-vice.vue';
import ModalController from '@/controllers/modal-controller';
import { PageName, router } from '@/router';
import { Scoundrel } from '@/scoundrel';
import { makeSemanticId } from '@/util/id-util';
import { computed, ref, watch } from 'vue';

const page = ref<HTMLElement | null>(null);
const stepContainer = ref<HTMLElement | null>(null);

const showModel = ref(false);
window.addEventListener('keydown', (e) => {
    if (e.key === 'm' && e.altKey) showModel.value = !showModel.value;
});

const stepComponents = {
    playbook: StepPlaybook,
    background: StepBackground,
    actions: StepHeritageAndActions,
    abilities: StepAbilities,
    friends: StepFriendsAndRivals,
    vice: StepVice,
    name: StepNameAndLook,
};

enum Step {
    PLAYBOOK = 'playbook',
    BACKGROUND = 'background',
    HERITAGE_AND_ACTIONS = 'actions',
    ABILITIES = 'abilities',
    FRIENDS_AND_RIVALS = 'friends',
    VICE = 'vice',
    NAME_AND_LOOK = 'name',
}

const steps = [
    {
        id: Step.PLAYBOOK,
        label: 'Playbook',
    },
    {
        id: Step.BACKGROUND,
        label: 'Background',
    },
    {
        id: Step.HERITAGE_AND_ACTIONS,
        label: 'Heritage',
    },
    {
        id: Step.ABILITIES,
        label: 'Abilities',
    },
    {
        id: Step.FRIENDS_AND_RIVALS,
        label: 'Friends',
    },
    {
        id: Step.VICE,
        label: 'Vice',
    },
    {
        id: Step.NAME_AND_LOOK,
        label: 'Name & Look',
    },
];

const stepsEl = ref<HTMLElement | null>(null);

const scoundrel = ref<Partial<Scoundrel> | null>(null);
const scoundrelId = ref<string | null>(null);
const stepId = ref<Step | null>(null);

const step = computed(() => steps.find((s) => s.id === stepId.value));

const { params } = router.currentRoute.value;
scoundrelId.value = params.scoundrelId as string | null;
stepId.value = params.stepId as Step | null;

// If scoundrelId is null, generate a new scoundrel and navigate to the first step
if (!scoundrelId.value) {
    scoundrelId.value = makeSemanticId();
    scoundrel.value = {
        id: scoundrelId.value,
        actions: {
            hunt: {},
            study: {},
            survey: {},
            tinker: {},
            finesse: {},
            prowl: {},
            skirmish: {},
            wreck: {},
            attune: {},
            command: {},
            consort: {},
            sway: {},
        },
    };

    stepId.value = Step.PLAYBOOK;

    // Don't push; replace the current route so the user can't go back to the make page
    router.replace({
        name: PageName.EDIT,
        params: { scoundrelId: scoundrelId.value, stepId: stepId.value },
    });
}

// If scoundrelId is not null, load the scoundrel
else {
    // Load the scoundrel
    // scoundrel.value = await loadScoundrel(scoundrelId.value);
    // For now, redirect to home
    router.replace({ name: PageName.HOME });
}

const actionsChanged = ref(false);
// When the scoundrel.actions are changed, change the ref
watch(
    () => scoundrel.value?.actions,
    () => (actionsChanged.value = true),
    { deep: true }
);

function onClickNextStep() {
    const currentStepIndex = steps.findIndex((s) => s.id === stepId.value);
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) changeStep(nextStep.id);
}

function onClickBackStep() {
    const currentStepIndex = steps.findIndex((s) => s.id === stepId.value);
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) changeStep(prevStep.id);
}

async function onClickSave() {
    // Save the scoundrel
    // await saveScoundrel(scoundrel.value);
    // For now, redirect to home
    // router.replace({ name: PageName.HOME });
}

async function onClickActions() {
    // Open modal with info
    ModalController.open(ActionsModal, {
        scoundrel: scoundrel.value as Scoundrel,
    });

    actionsChanged.value = false;
}

async function onClickClose() {
    page.value?.classList.remove('page-in');
    page.value?.classList.add('page-out');

    await new Promise((resolve) => setTimeout(resolve, 500));
    router.replace({ name: PageName.HOME });
}

async function onClickDiscard() {
    // Are you sure?
    ModalController.open(ConfirmModal, {
        title: 'Delete scoundrel?',
        message: 'Are you sure you want to delete this scoundrel?',
        confirmText: 'Delete',
        onConfirm: discard,
    });
}

async function discard() {
    ModalController.close();
    page.value?.classList.remove('page-in');
    page.value?.classList.add('page-out');

    await new Promise((resolve) => setTimeout(resolve, 500));
    router.replace({ name: PageName.HOME });
}

const allAnimationClasses = [
    'animate-form-in--from-left',
    'animate-form-in--from-right',
    'animate-form-out--to-left',
    'animate-form-out--to-right',
];

async function changeStep(newStepId: Step) {
    page.value?.classList.add('no-click');

    // Is the new step to the right or left of the old step?
    const currentStepIndex = steps.findIndex((s) => s.id === stepId.value);
    console.log('currentStepIndex', currentStepIndex);
    const newStepIndex = steps.findIndex((s) => s.id === newStepId);
    console.log('newStepIndex', newStepIndex);

    const animationClassOut =
        newStepIndex > currentStepIndex
            ? 'animate-form-out--to-left'
            : 'animate-form-out--to-right';

    stepContainer.value?.classList.remove(...allAnimationClasses);
    stepContainer.value?.classList.add(animationClassOut);

    // Wait for the animation to finish (0.4s)
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Change the route
    stepId.value = newStepId;
    router.replace({
        name: PageName.EDIT,
        params: { scoundrelId: scoundrelId.value, stepId: newStepId },
    });

    // Scroll ul.steps into view (x-scrollable on mobile)
    if (!stepsEl.value) return;
    const stepEl = stepsEl.value.querySelector(
        `.step[data-step-id="${newStepId}"]`
    );

    if (!stepEl) return;

    const containerRect = stepsEl.value.getBoundingClientRect();
    const stepRect = stepEl.getBoundingClientRect();

    // Calculate the scroll offset needed to bring `stepEl` into view
    const newX =
        stepsEl.value.scrollLeft +
        stepRect.left -
        containerRect.left +
        (stepRect.width - containerRect.width) / 2;

    stepsEl.value.scroll({
        left: newX,
        behavior: 'smooth',
    });

    const animationClassIn =
        newStepIndex > currentStepIndex
            ? 'animate-form-in--from-right'
            : 'animate-form-in--from-left';

    stepContainer.value?.classList.remove(...allAnimationClasses);
    stepContainer.value?.classList.add(animationClassIn);

    // Wait for the animation to finish (0.4s)
    await new Promise((resolve) => setTimeout(resolve, 400));
    stepContainer.value?.classList.remove(...allAnimationClasses);

    page.value?.classList.remove('no-click');
}

const isFirstStep = computed(() => {
    return steps.findIndex((s) => s.id === stepId.value) === 0;
});

const isLastStep = computed(() => {
    return steps.findIndex((s) => s.id === stepId.value) === steps.length - 1;
});
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0)
    );
}

ul.steps {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: fit-content;
    max-width: calc(100% - 2.4rem);
    margin: 0.8rem auto;
    border-radius: 99px;
    overflow-x: auto;
    scrollbar-width: none;
    box-shadow: var(--shadow-sm);

    > .step {
        &:first-child {
            border-top-left-radius: 99px;
            border-bottom-left-radius: 99px;
        }

        &:last-child {
            border-top-right-radius: 99px;
            border-bottom-right-radius: 99px;
        }
    }
}

.control-bar {
    bottom: 0;
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 0.8rem;
}

.step-container {
    flex: 1;
    overflow-y: auto;
    > * {
        max-width: 96rem;
        margin: 0 auto;
    }
}

@media (min-width: 768px) {
    .control-bar {
        width: min-content;
    }
}

.page-in {
    animation: pageIn 0.4s ease-out forwards;
}

.page-out {
    animation: pageOut 0.2s ease-out forwards;
    pointer-events: none;
}

@keyframes pageIn {
    from {
        opacity: 0;
        transform: translateY(1rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pageOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.animate-form-in--from-left {
    animation: from-left 0.4s ease-out forwards;
    pointer-events: none;
}

.animate-form-in--from-right {
    animation: from-right 0.4s ease-out forwards;
    pointer-events: none;
}

.animate-form-out--to-left {
    animation: to-left 0.4s ease-out forwards;
    pointer-events: none;
}

.animate-form-out--to-right {
    animation: to-right 0.4s ease-out forwards;
    pointer-events: none;
}

@keyframes from-left {
    from {
        opacity: 0;
        transform: translateX(-4rem);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes to-left {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(-4rem);
    }
}

@keyframes from-right {
    from {
        opacity: 0;
        transform: translateX(4rem);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes to-right {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(4rem);
    }
}
</style>
