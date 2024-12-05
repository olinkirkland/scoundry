<template>
  <div class="page page--make" v-if="scoundrel && step">
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

    <div class="form-container">
      <component
        v-if="stepId"
        :is="stepComponents[stepId]"
        :scoundrel="scoundrel"
      />
    </div>

    <pre>{{ scoundrel }}</pre>
    <div class="row control-bar">
      <button class="btn btn--alt" @click="onClickDiscard">Discard</button>
      <button class="btn" @click="onClickNextStep">Next Step</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import StepBlock from '@/components/step-block.vue';
import StepAbilities from '@/components/steps/step-abilities.vue';
import StepBackground from '@/components/steps/step-background.vue';
import StepFriendsAndRivals from '@/components/steps/step-friends-and-rivals.vue';
import StepHeritageAndActions from '@/components/steps/step-heritage-and-actions.vue';
import StepNameAndLook from '@/components/steps/step-name-and-look.vue';
import StepPlaybook from '@/components/steps/step-playbook.vue';
import StepVice from '@/components/steps/step-vice.vue';
import { PageName, router } from '@/router';
import { Scoundrel } from '@/scoundrel';
import { makeSemanticId } from '@/util/id-util';
import { computed, ref } from 'vue';

const stepComponents = {
  playbook: StepPlaybook,
  background: StepBackground,
  actions: StepHeritageAndActions,
  abilities: StepAbilities,
  friends: StepFriendsAndRivals,
  vice: StepVice,
  name: StepNameAndLook
};

enum Step {
  PLAYBOOK = 'playbook',
  BACKGROUND = 'background',
  HERITAGE_AND_ACTIONS = 'actions',
  ABILITIES = 'abilities',
  FRIENDS_AND_RIVALS = 'friends',
  VICE = 'vice',
  NAME_AND_LOOK = 'name'
}

const steps = [
  {
    id: Step.PLAYBOOK,
    label: 'Playbook'
  },
  {
    id: Step.BACKGROUND,
    label: 'Background'
  },
  {
    id: Step.HERITAGE_AND_ACTIONS,
    label: 'Heritage & Actions'
  },
  {
    id: Step.ABILITIES,
    label: 'Special Ability'
  },
  {
    id: Step.FRIENDS_AND_RIVALS,
    label: 'Friends & Rivals'
  },
  {
    id: Step.VICE,
    label: 'Vice'
  },
  {
    id: Step.NAME_AND_LOOK,
    label: 'Name & Look'
  }
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
      hunt: 0,
      study: 0,
      survey: 0,
      tinker: 0,
      finesse: 0,
      prowl: 0,
      skirmish: 0,
      wreck: 0,
      attune: 0,
      command: 0,
      consort: 0,
      sway: 0
    }
  };

  stepId.value = Step.PLAYBOOK;

  // Don't push; replace the current route so the user can't go back to the make page
  router.replace({
    name: PageName.EDIT,
    params: { scoundrelId: scoundrelId.value, stepId: stepId.value }
  });
}

// If scoundrelId is not null, load the scoundrel
else {
  // Load the scoundrel
  // scoundrel.value = await loadScoundrel(scoundrelId.value);
  // For now, redirect to home
  router.replace({ name: PageName.HOME });
}

function onClickNextStep() {
  const currentStepIndex = steps.findIndex((s) => s.id === stepId.value);
  const nextStep = steps[currentStepIndex + 1];
  if (nextStep) changeStep(nextStep.id);
}

function onClickDiscard() {
  router.replace({ name: PageName.HOME });
}

function changeStep(newStepId: Step) {
  // Change the route
  stepId.value = newStepId;
  router.replace({
    name: PageName.EDIT,
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
}
</script>

<style lang="scss" scoped>
ul.steps {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: fit-content;
  margin: 1.2rem;
  border-radius: 99px;
  overflow-x: auto;
}

.control-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.8rem;
}

.form-container {
  padding: 2rem;
  background-color: var(--color-surface-lighter);
  border-radius: 5px;
  margin: 1.2rem;
}

@media (max-width: 768px) {
  ul.steps {
    width: calc(100% - 2.4rem);
  }
}
</style>
