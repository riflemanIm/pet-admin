import { NotificationTemplateDto } from "../../helpers/dto";
import { t } from "i18next";
export interface NotificationTemplateError {
  description?: string;
  notificationType?: string;
  langCode?: string;
}

export default function validate(
  values: NotificationTemplateDto
): NotificationTemplateError {
  const errors: NotificationTemplateError = {};
  if (!values.description) {
    errors.description = t("COMMON.FILL_DESCR");
  }
  if (!values.notificationType) {
    errors.notificationType = t("COMMON.FILL_NOTI_TYPE");
  }
  if (!values.langCode) {
    errors.langCode = t("COMMON.FILL_CODE_LANG");
  }

  return errors;
}
