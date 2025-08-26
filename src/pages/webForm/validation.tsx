import { WebFormDto } from "../../helpers/dto";
import { t } from "i18next";

export interface WebFormError {
  formUUID?: string;
  title?: string;
  control?: string;
}

export default function validate(values: WebFormDto): WebFormError {
  const errors: WebFormError = {};
  if (!values.formUUID) {
    errors.formUUID = t("COMMON.FILL_UUID");
  }
  if (!values.title) {
    errors.title = t("COMMON.FILL_TITLE");
  }
  if (!values.control) {
    errors.control = t("COMMON.FILL_CONTROL");
  }

  return errors;
}
