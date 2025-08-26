import { RateLimitDto } from "../../helpers/dto";
import { t } from "i18next";

export interface RateLimitError {
  routePath?: string;
  windowMs?: string;
  rateLimit?: string;
}

export default function validate(values: RateLimitDto): RateLimitError {
  const errors: RateLimitError = {};
  if (!values.routePath) {
    errors.routePath = t("COMMON.FILL_ROUTE_PATH");
  }
  if (!values.windowMs) {
    errors.windowMs = t("COMMON.FILL_WINDOW_MS");
  }
  if (!values.rateLimit) {
    errors.rateLimit = t("COMMON.FILL_RATE_LIMIT");
  }

  return errors;
}
