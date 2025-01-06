import { createI18n } from 'vue-i18n';
import en from './locales/en.json';


// Type-define the master schema for the resource
// If the other language entries (de, fr) are missing a key, it will be flagged as an error
type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], 'en'>({ // Add languages here
    legacy: false, // you must set `false`, to use Composition API
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        // es,
    },
});

export default i18n;
