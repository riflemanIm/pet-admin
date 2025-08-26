import { MedicalNetDto } from "../../helpers/dto";
import {
  PhoneNumberValidator,
  isValidEmail,
} from "../../helpers/phoneNumberValidator";
import { t } from "i18next";

export interface MedicalNetError {
  title?: string;
  code?: string;
  notifyEmail?: string;
  notifyPhone?: string;
}

export default function validate(values: MedicalNetDto): MedicalNetError {
  const errors = {} as MedicalNetError;
  if (!values.title) {
    errors.title = t("COMMON.FILL_NAME");
  }
  if (!values.code) {
    errors.code = t("COMMON.FILL_POST_ADD");
  }

  if (!values.notifyEmail) {
    errors.notifyEmail = t("COMMON.FILL_EMAIL");
  }
  if (values.notifyEmail != null && !isValidEmail(values.notifyEmail)) {
    errors.notifyEmail = t("COMMON.WRONG_EMAIL");
  }

  if (!values.notifyPhone) {
    errors.notifyPhone = t("COMMON.FILL_PHONE");
  }
  if (
    values.notifyPhone != null &&
    !PhoneNumberValidator.validate(values.notifyPhone).valid
  ) {
    errors.notifyPhone = t("COMMON.WRONG_PHONE");
  }

  return errors;
}
