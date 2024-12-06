<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h3>Export Your Character</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="load">
                <p>Load a previously exported scoundrel (JSON format).</p>
                <input
                    type="text"
                    v-model="json"
                    placeholder="Paste JSON here"
                />
                <div class="row">
                    <button
                        class="btn"
                        :class="{ disabled: isJSONValid }"
                        @click="onClickLoadFromJSON"
                    >
                        <span>Load</span>
                    </button>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import ModalController from '@/controllers/modal-controller';
import { loadScoundrel, saveScoundrel } from '@/controllers/storage-controller';
import { PageName, router } from '@/router';
import { computed, ref } from 'vue';

const json = ref('');
const isJSONValid = computed(() => {
    try {
        JSON.parse(json.value);
        return false;
    } catch (e) {
        return true;
    }
});

function onClickLoadFromJSON() {
    const scoundrel = JSON.parse(json.value);
    saveScoundrel(scoundrel);

    router.replace({
        name: PageName.EDIT,
        params: { scoundrelId: scoundrel.id },
    });

    ModalController.close();
}
</script>

<style scoped lang="scss">
.load {
    max-width: 56rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.6rem;
}

@media (max-width: 768px) {
    .load {
        max-width: 100%;
    }
    .row {
        margin-top: auto;
        width: 100%;
        flex-direction: column;
    }
}
</style>
