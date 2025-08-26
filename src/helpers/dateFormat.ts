import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";

export const Locales = { en: enLocale, fr: frLocale, ru: ruLocale };

export const jsDateToLocalISO8601DateString = (date: Date) => {
  return [
    String(date.getFullYear()),
    String(101 + date.getMonth()).substring(1),
    String(100 + date.getDate()).substring(1),
  ].join("-");
};

export const maskMap = {
  fr: "__/__/____",
  en: "__/__/____",
  ru: "__.__.____",
  de: "__.__.____",
};

export const mask = (inputFormat: string) => {
  const mask = inputFormat
    .replace(/D/gi, "_")
    .replace(/M/gi, "_")
    .replace(/Y/gi, "_");
  //console.log('mask', mask);
  return mask;
};
