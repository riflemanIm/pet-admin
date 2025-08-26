import { LoginRequestDto } from "../../helpers/dto";
import { t } from "i18next";

export interface LoginError {
  email?: string;
  password?: string;
}

export default function validate(values: LoginRequestDto): LoginError {
  const errors = {} as LoginError;

  if (!values?.login) {
    errors.email = t("COMMON.FILL_LOGIN");
  }
  if (!values?.password) {
    errors.password = t("COMMON.FILL_PASS");
  }

  return errors;
}
