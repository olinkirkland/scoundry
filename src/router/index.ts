import ConfirmModal from '@/components/modals/templates/confirm-modal.vue';
import ModalController from '@/controllers/modal-controller';
import i18n, { t } from '@/i18n/locale';
import TheImportPage from '@/pages/the-import-page.vue';
import { startTracking, stopTracking } from '@/tracker';
import { RouterOptions, createRouter, createWebHistory } from 'vue-router';
import TheHomePage from '../pages/the-home-page.vue';
import TheLostPage from '../pages/the-lost-page.vue';
import TheMakePage from '../pages/the-make-page.vue';

export enum PageName {
    HOME = 'home',
    MAKE = 'make',
    EDIT = 'edit',
    EDIT_WITH_STEP = 'edit-with-step',
    IMPORT = 'import',
    LOST = 'lost'
}

const routes = [
    {
        path: '/',
        components: {
            page: TheHomePage
        },
        name: PageName.HOME
    },
    {
        path: '/make',
        components: {
            page: TheMakePage
        },
        name: PageName.MAKE
    },
    {
        path: '/make/:scoundrelId',
        components: {
            page: TheMakePage
        },
        name: PageName.EDIT
    },
    {
        path: '/make/:scoundrelId/:stepId',
        components: {
            page: TheMakePage
        },
        name: PageName.EDIT_WITH_STEP
    },
    {
        // Import a base64 encoded JSON string of the scoundrel data
        path: '/import/:scoundrelData',
        components: {
            page: TheImportPage
        },
        name: PageName.IMPORT
    },
    {
        path: '/:pathMatch(.*)*',
        components: {
            page: TheLostPage // 404 page
        },
        name: PageName.LOST
    }
];

const routerOptions = {
    history: createWebHistory(),
    routes
};

export const router = createRouter(routerOptions as RouterOptions);

// router.afterEach(async (to, from) => { });

router.beforeEach(async (to, from, next) => {
    // Only track if the user has allowed it
    let allowTracking: boolean = false;
    if (localStorage.getItem('allowTracking') === 'true') allowTracking = true;
    // Disable tracking on localhost
    if (window.location.hostname === 'localhost') allowTracking = false;

    if (localStorage.getItem('allowTracking') === null) {
        // If localStorage is not available, prompt the user to allow tracking
        ModalController.open(ConfirmModal, {
            title: t('User-interface.Modals.Tracking-consent.title'),
            message: t('User-interface.Modals.Tracking-consent.message'),
            confirmText: t(
                'User-interface.Modals.Tracking-consent.Controls.confirm-button'
            ),
            cancelText: t(
                'User-interface.Modals.Tracking-consent.Controls.cancel-button'
            ),
            isConfirmButtonCta: true,
            onConfirm: () => {
                localStorage.setItem('allowTracking', 'true');
                ModalController.close();
            },
            onCancel: () => {
                localStorage.setItem('allowTracking', 'false');
                ModalController.close();
            }
        });
    }

    if (allowTracking) startTracking();
    else stopTracking();

    next();
});
