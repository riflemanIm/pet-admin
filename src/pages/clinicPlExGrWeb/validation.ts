import { ClinicPlExGrWebDto } from "../../helpers/dto";
import { t } from "i18next";

export interface ClinicPlExGrWebError {
  specializationId?: string;
}

export default function validate(
  values: ClinicPlExGrWebDto
): ClinicPlExGrWebError {
  const errors: ClinicPlExGrWebError = {};
  if (!values.specializationId) {
    errors.specializationId = t("COMMON.FILL_SPEC");
  }
  return errors;
}
