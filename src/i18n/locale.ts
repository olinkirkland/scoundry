import { createI18n, useI18n } from 'vue-i18n';
import en from './locales/en/translations.json';
import de from './locales/de/translations.json';
import es from './locales/es/translations-.json';

// Use the i18n-editor from https://github.com/jcbvm/i18n-editor/releases/tag/1.0.0

// Type-define the master schema for the resource
// If the other language entries (es, de) are missing a key, it will be flagged as an error
type MessageSchema = typeof en;

const i18n = createI18n<[MessageSchema], 'en'>({
    // Add languages here
    legacy: false, // you must set `false`, to use Composition API
    locale: localStorage.getItem('language') || 'en',
    // fallbackLocale: 'en',
    missing: (locale, key) => {
        return `[${key}]`;
    },
    warnHtmlMessage: false,
    messages: {
        en, // English
        // @ts-ignore
        de, // German
        // @ts-ignore
        es // Spanish
    }
});

let i18nInstance: any;
export function initializeI18nInstance() {
    i18nInstance = useI18n();
}

export function changeLanguage(language: string) {
    if (i18nInstance) i18nInstance.locale.value = language;
    localStorage.setItem('language', language);
}

export function getLanguage() {
    return i18nInstance.locale.value;
}

export default i18n;
