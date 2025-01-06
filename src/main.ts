import mixpanel from 'mixpanel-browser';
import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n/locale';
import { router } from './router';

export const APP_VERSION = '1.1.2';

// Create the app
const app = createApp(App);

// Plugins
app.use(router);
app.use(i18n);

// Mount the app
app.mount('#app');

mixpanel.init('e25d2f8346d1c0731fbb322d6f4c9d94');
trackEvent('page-load', {
    version: APP_VERSION,
    path: window.location.pathname,
});

export function trackEvent(eventName: string, data?: Record<string, any>) {
    // Only track events if the app is not running on localhost and tracking is allowed by the user
    if (window.location.hostname === 'localhost' || !localStorage.getItem('allow-tracking')) {
        console.warn(`Tracking is disabled. Event: ${eventName}`);
    } else {
        mixpanel.track(eventName, data);
    }
}
