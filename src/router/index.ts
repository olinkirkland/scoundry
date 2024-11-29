import { RouterOptions, createRouter, createWebHistory } from 'vue-router';
import TheHomePage from '../pages/the-home-page.vue';
import TheLostPage from '../pages/the-lost-page.vue';
import TheMakePage from '../pages/the-make-page.vue';

export enum PageName {
    HOME = 'home',
    MAKE = 'make',
    LOST = 'lost',
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
        path: '/make/:id',
        components: {
            page: TheMakePage
        },
        name: PageName.MAKE
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

// router.beforeEach(async (to, from, next) => {
//     next();
// });
