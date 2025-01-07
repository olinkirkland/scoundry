<template>
    <step-header>
        <h2 v-html="$t('User-interface.Steps.Heritage.title')"></h2>
        <p v-html="$t('User-interface.Steps.Heritage.subtitle')"></p>
        <a
            @click="
                ModalController.open(ImageModal, {
                    title: i18n.global.t(
                        'User-interface.Modals.World-map.title'
                    ),
                    image: '/assets/images/world-map.png',
                    backgroundColor: '#ffffff',
                })
            "
        >
            <span>
                {{ $t('User-interface.Steps.Heritage.world-map-button') }}
            </span>
        </a>
    </step-header>
    <div class="list-container-frame">
        <div class="list-container">
            <ul class="heritages-list">
                <trait-card
                    v-for="heritage in heritages"
                    :key="heritage"
                    :label="
                        useI18n().t(`Heritages.${capitalize(heritage)}.label`)
                    "
                    :selected="heritage === scoundrel.heritage"
                    @click="onClickHeritage(heritage)"
                />
            </ul>
        </div>
    </div>

    <p v-if="selectedHeritage" class="description">
        {{ $t(`Heritages.${capitalize(selectedHeritage)}.description`) }}
    </p>
    <p
        v-else
        class="description"
        v-html="$t('User-interface.Steps.Heritage.select-prompt')"
    ></p>

    <section v-if="scoundrel.heritage" class="selected-heritage">
        <div class="input-block">
            <label>
                {{ $t('User-interface.Steps.Heritage.detail-prompt') }}
            </label>
            <input type="text" v-model="scoundrel.heritageDetail" />
        </div>

        <ul class="heritage-details-list">
            <trait-detail-card
                v-for="detail in filteredHeritageDetails"
                :key="detail.id"
                :label="useI18n().t(`Heritage-suggestions.${detail.id}`)"
                :selected="
                    useI18n().t(`Heritage-suggestions.${detail.id}`) ===
                    scoundrel.heritageDetail
                "
                :traitDetail="detail"
                @click="onClickHeritageDetail(detail)"
            />
        </ul>

        <p
            class="reference"
            v-html="$t('User-interface.Steps.Heritage.deep-cuts-description')"
        ></p>
    </section>
</template>

<script setup lang="ts">
import { TraitDetail } from '@/assets/data/data-types';
import heritageDetailsData from '@/assets/data/heritage-suggestions.json';
import heritages from '@/assets/data/heritages.json';
import StepHeader from '@/components/step-header.vue';
import TraitCard from '@/components/trait-card.vue';
import ModalController from '@/controllers/modal-controller';
import i18n from '@/i18n/locale';
import { Scoundrel } from '@/scoundrel';
import { capitalize } from '@/util/string-util';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ImageModal from '../modals/templates/image-modal.vue';
import TraitDetailCard from '../trait-detail-card.vue';

const props = defineProps<{
    scoundrel: Scoundrel;
}>();

const heritageDetails = heritageDetailsData as unknown as TraitDetail[];

const selectedHeritage = computed(() =>
    heritages.find((h) => h === props.scoundrel.heritage)
);

const filteredHeritageDetails = computed(() => {
    if (!selectedHeritage.value) return [];
    let heritageDetailsFilter = selectedHeritage.value;
    return heritageDetails.filter(
        (heritageDetail) =>
            heritageDetail.trait === heritageDetailsFilter ||
            !heritageDetail.trait
    );
});

function onClickHeritage(heritage: string) {
    // Choose the heritage, and clear the heritage detail
    props.scoundrel.heritage = heritage;
    props.scoundrel.heritageDetail = '';
}

function onClickHeritageDetail(heritageDetail: TraitDetail) {
    const label = i18n.global.t(`Heritage-suggestions.${heritageDetail.id}`);

    // Set the heritage detail to empty if it's already selected
    if (props.scoundrel.heritageDetail === label) {
        props.scoundrel.heritageDetail = '';
        return;
    }

    // Choose the heritage detail
    props.scoundrel.heritageDetail = label;
}
</script>

<style scoped lang="scss">
.list-container-frame {
    display: flex;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 1rem !important;
    > .list-container {
        display: flex;
        justify-content: center;
        margin: 0 1.2rem;
        overflow: hidden;
        > ul.heritages-list {
            display: flex;
            width: fit-content;
            margin: 0 auto;
            gap: 0.4rem;
        }
    }
}

p.description {
    text-align: center;
    width: 100%;
    opacity: 0.8;
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
    max-width: 64rem;
}

input {
    margin-bottom: 1.2rem;
}

section.selected-heritage {
    padding: 0 1.2rem;
    margin-bottom: 1.2rem;
}

ul.heritage-details-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
    grid-auto-rows: 1fr;
    gap: 0.4rem;
}

p.reference {
    margin: 0.8rem;
    text-align: center;
}

@media (max-width: 1024px) {
    ul.heritages-list {
        overflow-x: auto;
        scrollbar-width: none;
    }
}

@media (max-width: 768px) {
    p.description {
        text-align: left;
    }
}
</style>
