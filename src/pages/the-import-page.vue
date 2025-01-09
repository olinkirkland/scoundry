<template>
    <div class="page page--import">
        <p>Importing character sheet...</p>
        <pre>{{ encodedData }}</pre>
    </div>
</template>

<script setup lang="ts">
import ConfirmModal from '@/components/modals/templates/confirm-modal.vue';
import ErrorModal from '@/components/modals/templates/error-modal.vue';
import InfoModal from '@/components/modals/templates/info-modal.vue';
import ModalController from '@/controllers/modal-controller';
import { saveScoundrel } from '@/controllers/storage-controller';
import { t } from '@/i18n/locale';
import { PageName, router } from '@/router';
import { Scoundrel } from '@/scoundrel';
import { decodeUrlToJson } from '@/util/scoundrel-util';
import { ref } from 'vue';

const encodedData = ref<string | null>(null);
const { params } = router.currentRoute.value;
encodedData.value = params.scoundrelData as string | null;

let scoundrel: Scoundrel | null = null;
try {
    if (encodedData.value) scoundrel = decodeUrlToJson(encodedData.value);
} catch (e) {}

if (scoundrel) {
    saveScoundrel(scoundrel);
    router.replace({
        name: PageName.EDIT,
        params: { scoundrelId: scoundrel.id },
    });

    ModalController.open(InfoModal, {
        title: t('User-interface.Modals.Import.Success.title'),
        message: t('User-interface.Modals.Import.Success.message'),
    });
} else {
    ModalController.open(ErrorModal, {
        title: t('User-interface.Modals.Import.Failed.title'),
        message: t('User-interface.Modals.Import.Failed.message'),
    });
}
</script>

<style lang="scss" scoped>
.page--import {
    height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    font-family: var(--font-display);
    color: var(--color-on-surface);
    font-size: 12rem;
    text-align: center;
}

h1 + p {
    margin-bottom: 4rem;
    text-align: center;
}

pre {
    max-width: 96rem;
    overflow: none;
    white-space: pre-wrap;
    word-wrap: break-word;
}

@media (max-width: 768px) {
    h1 {
        font-size: 4.8rem;
    }
}
</style>
