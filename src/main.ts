import mixpanel from 'mixpanel-browser';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

export const APP_VERSION = '1.1.0';

// Create the app
const app = createApp(App);

// Plugins
app.use(router);
app.mount('#app');

mixpanel.init('e25d2f8346d1c0731fbb322d6f4c9d94');
trackEvent('Page Load', {
    version: APP_VERSION,
    path: window.location.pathname,
});

export function trackEvent(eventName: string, data?: Record<string, any>) {
    if (window.location.hostname !== 'localhost') {
        mixpanel.track(eventName, data);
    } else {
        console.warn(
            `Accessing from localhost; Mixpanel is disabled. Event: ${eventName}`
        );
    }
}
