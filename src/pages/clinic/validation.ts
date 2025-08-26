import { ClinicDto } from "../../helpers/dto";
import {
  PhoneNumberValidator,
  isValidEmail,
} from "../../helpers/phoneNumberValidator";
import { t } from "i18next";

export interface ClinicError {
  code?: string;
  title?: string;
  postalAddress?: string;
  email?: string;
  phone?: string;
  url?: string;
}

export default function validate(values: ClinicDto): ClinicError {
  const errors: ClinicError = {};
  if (!values.code) {
    errors.code = t("COMMON.FILL_CODE");
  }
  if (!values.title) {
    errors.title = t("COMMON.FILL_NAME");
  }
  if (!values.postalAddress) {
    errors.postalAddress = t("COMMON.FILL_POST_ADD");
  }
  if (!values.url) {
    errors.url = t("COMMON.FILL_URL");
  }

  if (!values.email) {
    errors.email = t("COMMON.FILL_EMAIL");
  }
  if (values.email != null && !isValidEmail(values.email)) {
    errors.email = t("COMMON.WRONG_EMAIL");
  }

  if (!values.phone) {
    errors.phone = t("COMMON.FILL_PHONE");
  }
  if (
    values.phone != null &&
    !PhoneNumberValidator.validate(values.phone).valid
  ) {
    errors.phone = t("COMMON.WRONG_PHONE");
  }

  return errors;
}
