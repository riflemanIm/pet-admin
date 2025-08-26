import { AgreementDto } from "../../helpers/dto";
import { t } from "i18next";

export interface AgreementError {
  agreement?: string;
  langCode?: string;
}

export default function validate(values: AgreementDto): AgreementError {
  const errors: AgreementError = {};
  if (!values.agreement) {
    errors.agreement = t("SIGN.UP_FILL_TEXT_AGEEMENT");
  }
  if (!values.langCode) {
    errors.langCode = t("COMMON.FILL_CODE_LANG");
  }

  return errors;
}
