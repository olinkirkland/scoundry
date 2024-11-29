// import mixpanel from 'mixpanel-browser';
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

// Create the app
const app = createApp(App);

// Plugins
app.use(router);
app.mount('#app');

// mixpanel.init('abc');
// if (window.location.hostname !== 'localhost') {
//     console.warn('Mixpanel tracked the page load!');
//     mixpanel.track('Page Load');
// } else {
//     console.warn('Accessing from localhost; Mixpanel is disabled.');
// }
