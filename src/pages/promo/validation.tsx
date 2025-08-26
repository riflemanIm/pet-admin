import { MedicalNetActionDto } from "../../helpers/dto";
import { t } from "i18next";

export interface PromoError {
  actionText?: string;
  description?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
  image?: string;
}

export default function validate(values: MedicalNetActionDto): PromoError {
  const errors: PromoError = {};
  if (!values.actionText) {
    errors.actionText = t("COMMON.FILL_TEXT");
  } else if (values.actionText.length > 1000) {
    errors.actionText = t("COMMON.TEXT_TOO_LONG");
  }
  if (!values.description) {
    errors.description = t("COMMON.FILL_DESCR");
  } else if (values.description.length > 100) {
    errors.description = t("COMMON.TEXT_TOO_LONG");
  }
  if (typeof values.sortOrder !== "number") {
    errors.sortOrder = t("COMMON.FILL_SORT");
  }
  if (!values.image) {
    errors.image = t("COMMON.FILL_IMG");
  }

  return errors;
}
