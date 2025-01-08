import { createI18n, useI18n } from 'vue-i18n';
import en from './locales/en/translations.json';
// import es from './locales/es/translations.json';

// Type-define the master schema for the resource
// If the other language entries (es, de) are missing a key, it will be flagged as an error
type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], 'en'>({
    // Add languages here
    legacy: false, // you must set `false`, to use Composition API
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en
        // es,
    }
});

let i18nInstance: any;
export function initializeI18nInstance() {
    i18nInstance = useI18n();
}

export function changeLanguage(language: string) {
    if (i18nInstance) i18nInstance.locale.value = language;
}

export default i18n;
