const locale = (lang: string): string => {
  switch (lang) {
    case "en":
      return "en-US";
    case "fr":
      return "fr-FR";
    default:
      return "ru-RU";
  }
};

export const numFomated = (number: number, lang: string): string => number.toLocaleString(locale(lang));

export const currencyFomated = (number: number, lang: string, currency = "RUB"): string =>
  number.toLocaleString(locale(lang), { style: "currency", currency });

export const cleanPhoneValue = (value: string): string => {
  // удаляем разрешенные символы
  const cleanValue = value.replace(/[\s+()-]/gi, "");
  const numbers = cleanValue.replace(/[^\d]/gi, "");
  return numbers;
};
