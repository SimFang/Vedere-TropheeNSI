import en from './en.json';
import fr from './fr.json';

const translations = {
  en, fr,
};

let currentLanguage = 'en'; // Default language

/**
 * Sets the current language for the application.
 * @param {string} language - The language code (e.g., 'en', 'es', 'fr').
 */
export const setIndexLanguage = (language) => {
    console.log("changing language")
  if (translations[language]) {
    currentLanguage = language;
  } else {
    console.warn(`Language '${language}' is not supported.`);
  }
};

/**
 * Translates a given key based on the current language.
 * @param {string} key - The key to be translated.
 * @returns {string} - The translated string or the key if not found.
 */
export const t = (key) => {
  const translation = translations[currentLanguage][key];
  if (typeof translation === 'undefined') {
    console.warn(`Translation key '${key}' not found for language '${currentLanguage}'.`);
  }
  return translation || key; // Return the key if translation is not found
};

/**
 * Gets the current language code.
 * @returns {string} - The current language code.
 */
export const getCurrentLanguage = () => currentLanguage;
