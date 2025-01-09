<template>
    <div ref="page" class="page page--make page-in" v-if="scoundrel && step">
        <ul
            ref="stepsEl"
            class="steps"
            :class="{ disabled: !scoundrel.playbook }"
        >
            <step-block
                v-for="step in steps"
                :data-step-id="step"
                :key="step"
                :stepLabel="
                    useI18n().t(
                        `User-interface.Make-page.Step-navigation.${step}`
                    )
                "
                :stepNumber="steps.findIndex((s) => s === step) + 1"
                :active="step === stepId"
                :completed="steps.indexOf(step) < steps.indexOf(step)"
                @click="changeStep(step)"
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
                <span>
                    {{ $t('User-interface.Make-page.Controls.delete-button') }}
                </span>
            </button>

            <!-- Home -->
            <button class="btn btn--alt" @click="onClickClose">
                <span>
                    {{ $t('User-interface.Make-page.Controls.home-button') }}
                </span>
                <!-- <img src="/assets/icons/home.png" alt="Home" /> -->
            </button>

            <!-- Next -->
            <button
                class="btn"
                v-if="!isLastStep"
                @click="onClickNextStep"
                :class="{ disabled: !scoundrel.playbook }"
            >
                <span>
                    {{ $t('User-interface.Make-page.Controls.next-button') }}
                </span>
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
import StepExport from '@/components/steps/export-step.vue';
import StepFriendsAndRivals from '@/components/steps/friends-step.vue';
import StepHeritage from '@/components/steps/heritage-step.vue';
import StepNameAndLook from '@/components/steps/name-step.vue';
import StepPlaybook from '@/components/steps/playbook-step.vue';
import StepVice from '@/components/steps/vice-step.vue';
import ModalController from '@/controllers/modal-controller';
import {
    deleteScoundrel,
    loadScoundrel,
    saveScoundrel
} from '@/controllers/storage-controller';
import { changeLanguage, getLanguage, t } from '@/i18n/locale';
import { PageName, router } from '@/router';
import { Scoundrel } from '@/scoundrel';
import { trackEvent } from '@/tracker';
import { makeSemanticId } from '@/util/id-util';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const page = ref<HTMLElement | null>(null);
const stepContainer = ref<HTMLElement | null>(null);

const showModel = ref(false);

enum Step {
    PLAYBOOK = 'playbook',
    BACKGROUND = 'background',
    HERITAGE = 'heritage',
    ACTIONS = 'actions',
    ABILITIES = 'abilities',
    FRIENDS = 'friends',
    VICE = 'vice',
    NAME_AND_LOOK = 'name-and-look',
    EXPORT = 'export'
}

const stepComponents = {
    [Step.PLAYBOOK]: StepPlaybook,
    [Step.BACKGROUND]: StepBackground,
    [Step.HERITAGE]: StepHeritage,
    [Step.ACTIONS]: StepActions,
    [Step.ABILITIES]: StepAbilities,
    [Step.FRIENDS]: StepFriendsAndRivals,
    [Step.VICE]: StepVice,
    [Step.NAME_AND_LOOK]: StepNameAndLook,
    [Step.EXPORT]: StepExport
};

const steps = [
    Step.PLAYBOOK,
    Step.BACKGROUND,
    Step.HERITAGE,
    Step.ACTIONS,
    Step.ABILITIES,
    Step.FRIENDS,
    Step.VICE,
    Step.NAME_AND_LOOK,
    Step.EXPORT
];

const stepsEl = ref<HTMLElement | null>(null);

const scoundrel = ref<Partial<Scoundrel> | null>(null);
const scoundrelId = ref<string | null>(null);
const stepId = ref<Step | null>(null);

const step = computed(() => steps.find((s) => s === stepId.value));

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
            sway: {}
        }
    };

    // Don't push; replace the current route so the user can't go back to the make page
    router.replace({
        name: PageName.EDIT_WITH_STEP,
        params: { scoundrelId: scoundrelId.value, stepId: Step.PLAYBOOK }
    });

    changeStep(Step.PLAYBOOK);
}

// If scoundrelId is not null, load the scoundrel
else {
    console.log('Loading scoundrel:', scoundrelId.value);
    scoundrel.value = loadScoundrel(scoundrelId.value);

    // Opening a scoundrel that has a different language will change the language of the app
    const currentLanguage = t(
        `User-interface.Modals.Settings.Language.Languages.${getLanguage()}`
    );
    const newLanguage = t(
        `User-interface.Modals.Settings.Language.Languages.${scoundrel.value?.language || 'en'}`
    );

    if (scoundrel.value?.language && scoundrel.value.language !== getLanguage())
        ModalController.open(ConfirmModal, {
            title: t('User-interface.Modals.Change-language.title'),
            message: t('User-interface.Modals.Change-language.message', {
                newLanguage,
                currentLanguage
            }),
            confirmText: t(
                'User-interface.Modals.Change-language.Controls.confirm-button',
                { newLanguage }
            ),
            cancelText: t(
                'User-interface.Modals.Change-language.Controls.cancel-button',
                { currentLanguage }
            ),
            onConfirm: () => {
                changeLanguage(scoundrel.value?.language || 'en');
                ModalController.close();
            },
            onCancel: () => {
                // Redirect back to the home page
                ModalController.close();
                onClickClose();
            }
        });

    if (!scoundrel.value) {
        console.error('Scoundrel not found');
        // TODO: Show error message (modal?)
        ModalController.open(ErrorModal, {
            title: 'Scoundrel not found',
            message: 'The scoundrel you are trying to edit could not be found.',
            onConfirm: () => {
                ModalController.close();
                onClickClose();
            }
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

// Track the scoundrel's playbook; when it changes, track the event
watch(
    () => scoundrel.value?.playbook,
    (newPlaybook, oldPlaybook) => {
        if (!oldPlaybook && newPlaybook)
            trackEvent('new-character', {
                playbook: newPlaybook
            });
    }
);

function onClickNextStep() {
    const currentStepIndex = steps.findIndex((s) => s === stepId.value);
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) changeStep(nextStep);
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
        title: t('User-interface.Modals.Delete-scoundrel.title'),
        message: t('User-interface.Modals.Delete-scoundrel.message'),
        confirmText: t(
            'User-interface.Modals.Delete-scoundrel.Controls.confirm-button'
        ),
        onConfirm: discard
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
    'animate-form-out--to-right'
];

async function changeStep(newStepId: Step) {
    page.value?.classList.add('no-click');

    // Is the new step to the right or left of the old step?
    const currentStepIndex = steps.findIndex((s) => s === stepId.value);
    const newStepIndex = steps.findIndex((s) => s === newStepId);

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
        params: { scoundrelId: scoundrelId.value, stepId: newStepId }
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
        behavior: 'smooth'
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
    return steps.findIndex((s) => s === stepId.value) === 0;
});

const isLastStep = computed(() => {
    return steps.findIndex((s) => s === stepId.value) === steps.length - 1;
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
    box-shadow: var(--shadow-sm);

    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;

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
