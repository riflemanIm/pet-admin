import i18n, { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesEn from './en.json';
import resourcesFr from './fr.json';
import resourcesRu from './ru.json';
import LanguageDetector from 'i18next-browser-languagedetector';
import config from '../config';

const getLang = () => {
  const user = localStorage.getItem('user');
  if (!user) return config.defLang;
  const { lang } = JSON.parse(user);
  return lang;
};

const lang = getLang();

use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translations: { ...resourcesRu } },
      en: { translations: { ...resourcesEn } },
      fr: { translations: { ...resourcesFr } },
    },
    lng: lang,
    load: 'languageOnly',
    fallbackLng: lang,
    debug: false,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    lowerCaseLng: true,
  });

export default i18n;
