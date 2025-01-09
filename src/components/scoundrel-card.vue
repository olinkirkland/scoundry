<template>
    <div class="scoundrel-card">
        <div class="portrait-container">
            <img
                class="portrait"
                v-if="props.scoundrel.portrait"
                :src="`/assets/${props.scoundrel.portrait}`"
            />

            <img
                v-if="
                    props.scoundrel.language &&
                    !(
                        useI18n().locale.value === 'en' &&
                        props.scoundrel.language === 'en'
                    )
                "
                class="flag"
                :src="`/assets/icons/flag-${props.scoundrel.language}.png`"
            />
        </div>
        <p>{{ semanticName }}</p>
        <label v-if="props.lastUpdated">
            {{
                $t('User-interface.Home-page.last-updated', {
                    date: props.lastUpdated.toLocaleDateString()
                })
            }}
        </label>
    </div>
</template>

<script setup lang="ts">
import i18n from '@/i18n/locale';
import { Scoundrel } from '@/scoundrel';
import { getSemanticScoundrelName } from '@/util/scoundrel-util';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    scoundrel: Scoundrel;
    lastUpdated: Date | null;
}>();

const semanticName = computed(() => {
    return getSemanticScoundrelName(props.scoundrel);
});
</script>

<style scoped lang="scss">
.scoundrel-card {
    position: relative;
    cursor: pointer;
    min-width: 14rem;
    width: 12rem;
    background-color: var(--color-surface);
    border-radius: 5px;
    padding: 1.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
    top: 0;

    gap: 0.4rem;
    transition: all 0.2s;
    text-align: center;

    p {
        line-height: 1.4;
    }

    .portrait-container {
        position: relative;

        img.portrait {
            width: 6.4rem;
            height: 6.4rem;
            object-fit: cover;
            border-radius: 50%;
        }

        img.flag {
            position: absolute;
            width: 2.4rem;
            height: 2.4rem;
            bottom: 0.2rem;
            right: 0.2rem;
        }
    }

    > * {
        cursor: inherit;
        margin: 0;
    }

    &:hover {
        box-shadow: var(--shadow-md);
        transform: rotate(1deg);
        top: -0.6rem;
    }
}

@media (max-width: 768px) {
}
</style>
