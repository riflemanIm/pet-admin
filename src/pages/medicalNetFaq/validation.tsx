import { MedicalNetFaqDto } from "../../helpers/dto";
import { t } from "i18next";

export interface MedicalNetFaqError {
  questionGroup?: string;
  question?: string;
  answer?: string;
  notificationType?: string;
  langCode?: string;
}

export default function validate(values: MedicalNetFaqDto): MedicalNetFaqError {
  const errors: MedicalNetFaqError = {};
  if (!values.answer) {
    errors.answer = t("COMMON.FILL_CODE_LANG");
  }
  if (!values.questionGroup) {
    errors.questionGroup = t("COMMON.FILL_GROUP");
  }
  if (!values.question) {
    errors.question = t("COMMON.FILL_QUES");
  }
  if (!values.langCode) {
    errors.langCode = t("COMMON.FILL_CODE_LANG");
  }

  return errors;
}
