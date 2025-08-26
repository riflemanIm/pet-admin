import { SpecializationDto } from "../../helpers/dto";
import { t } from "i18next";
export interface SpecializationError {
  code?: string;
}

export default function validate(
  values: SpecializationDto
): SpecializationError {
  const errors = {} as SpecializationError;
  if (!values.code) {
    errors.code = t("COMMON.FILL_CODE");
  }
  return errors;
}
