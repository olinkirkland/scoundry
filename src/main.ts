import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n/locale';
import { router } from './router';
import { trackEvent } from './tracker';

export const APP_VERSION = '1.1.2';

// Create the app
const app = createApp(App);

// Plugins
app.use(router);
app.use(i18n);

// Mount the app
app.mount('#app');

trackEvent('page-load', {
    version: APP_VERSION,
    path: window.location.pathname
});
