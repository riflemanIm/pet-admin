import { MedicalBrandDto } from "../../helpers/dto";
import { t } from "i18next";

export interface MedicalBrandError {
  title?: string;
  code?: string;
}

export default function validate(values: MedicalBrandDto): MedicalBrandError {
  const errors = {} as MedicalBrandError;
  if (!values.title) {
    errors.title = t("COMMON.FILL_NAME");
  }
  if (!values.code) {
    errors.code = t("COMMON.FILL_CODE");
  }

  return errors;
}
