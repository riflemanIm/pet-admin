import React, { useContext, useReducer, Dispatch, createContext } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../translations/index';

interface LanguageState {
  language: Language;
}

type Language = 'ru' | 'fr' | 'en';
export enum LanguageActonType {
  SET_RUSSIAN = 'SET_RUSSIAN',
  SET_ENGLISH = 'SET_ENGLISH',
  SET_FRENCH = 'SET_FRENCH'
}

type Action = {
  type: LanguageActonType;
};
interface LanguageContextI {
  languageState: LanguageState;
  dispatchLanguage: Dispatch<Action>;
}

const languageWithoutCountry = (): Language => {
  return i18n.language.substring(0, 2) as Language;
};

export const LANGUAGES: Record<string, Language> = {
  RU: 'ru',
  FR: 'fr',
  EN: 'en'
};

const reducer = (state: LanguageState, action: Action): LanguageState => {
  switch (action.type) {
    case LanguageActonType.SET_ENGLISH:
      i18n.changeLanguage('en');
      return { language: LANGUAGES.EN };
    case LanguageActonType.SET_FRENCH:
      i18n.changeLanguage('fr');
      return { language: LANGUAGES.FR };
    case LanguageActonType.SET_RUSSIAN:
      i18n.changeLanguage('ru');
      return { language: LANGUAGES.RU };
    default:
      return state;
  }
};

export const LanguageContext = createContext({} as LanguageContextI);
interface AppLanguageProviderProps {
  children: React.ReactNode;
}
export const AppLanguageProvider: React.FC<AppLanguageProviderProps> = (props) => {
  const [languageState, dispatchLanguage] = useReducer(reducer, {
    language: languageWithoutCountry()
  });

  return (
    <LanguageContext.Provider
      value={{
        languageState,
        dispatchLanguage
      }}
    >
      <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguageValue = () => useContext(LanguageContext);
