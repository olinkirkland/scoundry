<template>
    <ModalFrame>
        <template v-slot:header>
            <ModalHeader closeButton>
                <h3>{{ $t('User-interface.Modals.Settings.title') }}</h3>
            </ModalHeader>
        </template>
        <template v-slot:content>
            <div class="settings">
                <div class="checkbox-group">
                    <input
                        type="checkbox"
                        id="settingEnableTracking"
                        @change="onChangeEnableTracking"
                    />
                    <label for="settingEnableTracking">
                        {{ $t('User-interface.Modals.Settings.tracking') }}
                    </label>
                </div>
            </div>
        </template>
    </ModalFrame>
</template>

<script setup lang="ts">
import ModalFrame from '@/components/modals/modal-frame.vue';
import ModalHeader from '@/components/modals/modal-header.vue';
import { startTracking, stopTracking } from '@/tracker';

function onChangeEnableTracking(e: any) {
    const allowTracking = e.target.checked;
    localStorage.setItem('enableTracking', allowTracking.toString());
    if (allowTracking) startTracking();
    else stopTracking();
}
</script>

<style scoped lang="scss">
.settings {
    display: flex;
    min-width: 48rem;
    flex-direction: column;
    gap: 1.6rem;
    height: 100%;
    justify-content: space-between;
}

@media (max-width: 768px) {
    .settings {
        min-width: unset;
    }
}
</style>
