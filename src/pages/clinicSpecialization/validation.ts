import { ClinicSpecializationDto } from "../../helpers/dto";
import { t } from "i18next";
export interface ClinicSpecializationError {
  specializationId?: string;
}

export default function validate(
  values: ClinicSpecializationDto
): ClinicSpecializationError {
  const errors: ClinicSpecializationError = {};
  if (!values.specializationId) {
    errors.specializationId = t("COMMON.FILL_SPEC");
  }
  return errors;
}
