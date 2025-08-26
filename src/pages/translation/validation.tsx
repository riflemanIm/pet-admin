import { TranslationsDto } from "../../helpers/dto";

export interface TranslationsError {
  langRu?: string;
  langEn?: string;
  langFr?: string;
}

export default function validate(values: TranslationsDto): TranslationsError {
  const errors = {} as TranslationsError;
  if (!values.langRu) {
    errors.langRu = "Must be filled ";
  }
  if (!values.langEn) {
    errors.langEn = "Must be filled ";
  }
  if (!values.langFr) {
    errors.langFr = "Must be filled ";
  }
  return errors;
}
