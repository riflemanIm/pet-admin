import parsePhoneNumber from "libphonenumber-js";

export interface ValidationResult {
  valid: boolean;
  refinedValue?: string;
}

export const PhoneNumberValidator = class {
  /**
   * Проверка, является ли значение номером телефона
   */
  static validate(value: string): ValidationResult {
    const phoneNumber = parsePhoneNumber(value, {
      defaultCountry: "RU",
      extract: false,
    });
    const valid = !!(phoneNumber && phoneNumber.isValid());
    return {
      valid,
      refinedValue: valid ? phoneNumber.number.replace(/[\s()+-]/gi, "") : "",
    };
  }
};

export const isValidEmail = (email: string) => {
  // 1. Должна быть не пустая строка
  if (!email || typeof email !== "string") return false;
  // 2. Должны быть 2 части, разделенные @
  const idx = email.lastIndexOf("@");
  if (idx === -1) return false;

  const account = email.slice(0, idx);
  const address = email.slice(idx + 1);

  // 3. Длины частей
  if (account.length > 64 || address.length > 255) return false;

  // 4. Есть точка в адресе
  if (!address.includes(".")) return false;

  // 5. Длины адресной составляющей
  const domainParts = address.split(".");
  if (domainParts.some((part) => part.length > 63)) return false;

  return true;
};
