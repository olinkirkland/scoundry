<template>
    <div ref="page" class="page page--make page-in" v-if="scoundrel && step">
        <ul
            ref="stepsEl"
            class="steps"
            :class="{ disabled: !scoundrel.playbook }"
        >
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
                v-if="
                    stepId && (scoundrel.playbook || stepId === Step.PLAYBOOK)
                "
                :is="stepComponents[stepId]"
                :scoundrel="scoundrel"
            />
            <pre v-if="showModel">{{ scoundrel }}</pre>
        </div>

        <div class="control-bar">
            <!-- Discard -->
            <button class="btn btn--alt" @click="onClickDiscard">
                <span>Delete</span>
            </button>

            <!-- Home -->
            <button class="btn btn--alt" @click="onClickClose">
                <span>Home</span>
                <!-- <img src="/assets/icons/home.png" alt="Home" /> -->
            </button>

            <!-- Next -->
            <button
                class="btn"
                @click="onClickNextStep"
                :class="{ disabled: isLastStep || !scoundrel.playbook }"
            >
                <span>Next</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import ConfirmModal from '@/components/modals/templates/confirm-modal.vue';
import ErrorModal from '@/components/modals/templates/error-modal.vue';
import StepBlock from '@/components/step-block.vue';
import StepAbilities from '@/components/steps/abilities-step.vue';
import StepActions from '@/components/steps/actions-step.vue';
import StepBackground from '@/components/steps/background-step.vue';
import StepFinish from '@/components/steps/finish-step.vue';
import StepFriendsAndRivals from '@/components/steps/friends-step.vue';
import StepHeritage from '@/components/steps/heritage-step.vue';
import StepNameAndLook from '@/components/steps/name-step.vue';
import StepPlaybook from '@/components/steps/playbook-step.vue';
import StepVice from '@/components/steps/vice-step.vue';
import ModalController from '@/controllers/modal-controller';
import {
    deleteScoundrel,
    loadScoundrel,
    saveScoundrel,
} from '@/controllers/storage-controller';
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
    heritage: StepHeritage,
    actions: StepActions,
    abilities: StepAbilities,
    friends: StepFriendsAndRivals,
    vice: StepVice,
    name: StepNameAndLook,
    finish: StepFinish,
};

enum Step {
    PLAYBOOK = 'playbook',
    BACKGROUND = 'background',
    HERITAGE = 'heritage',
    ACTIONS = 'actions',
    ABILITIES = 'abilities',
    FRIENDS_AND_RIVALS = 'friends',
    VICE = 'vice',
    NAME_AND_LOOK = 'name',
    FINISH = 'finish',
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
        id: Step.HERITAGE,
        label: 'Heritage',
    },
    {
        id: Step.ACTIONS,
        label: 'Actions',
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
    {
        id: Step.FINISH,
        label: 'Export',
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
    console.log('No scoundrelId; generating a new scoundrel');
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

    // Don't push; replace the current route so the user can't go back to the make page
    router.replace({
        name: PageName.EDIT_WITH_STEP,
        params: { scoundrelId: scoundrelId.value, stepId: Step.PLAYBOOK },
    });

    changeStep(Step.PLAYBOOK);
}

// If scoundrelId is not null, load the scoundrel
else {
    console.log('Loading scoundrel:', scoundrelId.value);
    scoundrel.value = loadScoundrel(scoundrelId.value);
    if (!scoundrel.value) {
        console.error('Scoundrel not found');
        // TODO: Show error message (modal?)
        ModalController.open(ErrorModal, {
            title: 'Scoundrel not found',
            message: 'The scoundrel you are trying to edit could not be found.',
            onConfirm: () => {
                ModalController.close();
                onClickClose();
            },
        });
    } else if (!stepId.value) changeStep(Step.PLAYBOOK);
}

// When the scoundrel is changed at all, save it to local storage
watch(
    () => scoundrel.value,
    (newScoundrel) => {
        if (!newScoundrel) return;
        saveScoundrel(newScoundrel as Scoundrel);
    },
    { deep: true }
);

// Automatically progress to the next step when the playbook is selected
// watch(
//     () => scoundrel.value?.playbook,
//     (newPlaybook, oldPlaybook) => {
//         if (!oldPlaybook && newPlaybook) onClickNextStep();
//     }
// );

function onClickNextStep() {
    const currentStepIndex = steps.findIndex((s) => s.id === stepId.value);
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) changeStep(nextStep.id);
}

// function onClickBackStep() {
//     const currentStepIndex = steps.findIndex((s) => s.id === stepId.value);
//     const prevStep = steps[currentStepIndex - 1];
//     if (prevStep) changeStep(prevStep.id);
// }

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
        message: 'Are you sure you want to delete this scoundrel? This action cannot be undone.',
        confirmText: 'Delete',
        onConfirm: discard,
    });
}

async function discard() {
    if (!scoundrelId.value) return;
    deleteScoundrel(scoundrelId.value);

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
    const newStepIndex = steps.findIndex((s) => s.id === newStepId);

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
        name: PageName.EDIT_WITH_STEP,
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

    // Ensure the step is scrolled to the top
    stepContainer.value?.scrollTo(0, 0);

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
