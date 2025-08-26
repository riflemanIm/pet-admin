import { UserDto } from "../../helpers/dto";
import { PhoneNumberValidator } from "../../helpers/phoneNumberValidator";
import { t } from "i18next";
// export const AGELIMITHIGH = -16;
// export const AGELIMITLOW = -120;

export interface UserError {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  birthDate?: string;
}

export default function validate(values: UserDto): UserError {
  const errors = {} as UserError;
  if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = t("COMMON.WRONG_EMAIL");
  }
  if (values.phone && !PhoneNumberValidator.validate(values.phone).valid) {
    errors.phone = t("COMMON.WRONG_PHONE");
  }

  if (!values.firstName) {
    errors.firstName = t("COMMON.FILL_FIRST_NAME");
  }
  if (!values.lastName) {
    errors.lastName = t("COMMON.FILL_LASRT_NAME");
  }

  if (
    values.password != null &&
    !/^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[,.!@#$%^&*_-]).{5,}$/.test(
      values.password
    )
  ) {
    errors.password = t("COMMON.WRONG_PASS");
  }

  if (!values.birthDate) {
    errors.birthDate = t("COMMON.FILL_DATE");
  }

  // console.log(
  //   "===values==\n",
  //   values,

  //   "===errors==\n",
  //   errors
  // );

  return errors;
}
