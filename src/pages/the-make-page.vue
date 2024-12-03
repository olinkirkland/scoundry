<template>
  <div class="page page--make">
    <div>STEPS</div>
    <pre>{{ scoundrel }}</pre>
    <div>STEP FORM</div>
    <div>NEXT STEP BUTTON, CANCEL, EXPORT</div>
  </div>
</template>

<script setup lang="ts">
import { PageName, router } from '@/router';
import { Scoundrel } from '@/scoundrel';
import { makeSemanticId } from '@/util/id-util';
import { ref } from 'vue';

enum Step {
  PLAYBOOK = 'playbook',
  HERITAGE = 'heritage',
  BACKGROUND = 'background',
  ACTION_DOTS = 'action-dots',
  ABILITIES = 'abilities',
  FRIENDS_AND_RIVALS = 'friends-and-rivals',
  VICE = 'vice',
  NAME_AND_ALIAS = 'name-and-alias',
  LOOK = 'look'
}

const scoundrel = ref<Partial<Scoundrel> | null>(null);
const scoundrelId = ref<string | null>(null);
const stepId = ref<string | null>(null);

const { params } = router.currentRoute.value;
scoundrelId.value = params.scoundrelId as string | null;
stepId.value = params.stepId as string | null;

// If scoundrelId is null, generate a new scoundrel and navigate to the first step
if (!scoundrelId.value) {
  scoundrelId.value = makeSemanticId();
  scoundrel.value = {
    id: scoundrelId.value
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
}
</script>

<style lang="scss" scoped></style>
