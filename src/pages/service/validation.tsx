import { ClientServiceDto } from "../../helpers/dto";
import { t } from "i18next";

export interface ClientServiceError {
  label?: string;
}

export default function validate(values: ClientServiceDto): ClientServiceError {
  const errors = {} as ClientServiceError;
  if (!values.label) {
    errors.label = t("COMMON.FILL_NAME");
  }

  return errors;
}

export const paramsSchema = {
  title: "Service Params",
  description: "Object containing service params",
  type: "object",
  properties: {
    acquiring: {
      title: "Acquiring type",
      examples: ["csb"],
      enum: ["csb", "dbdata"],
    },
    requireHL7Ack: {
      title: "Require HL7 Ack message",
      type: "boolean",
    },
    apps: {
      title: "APPS settings",
      type: "object",
      properties: {
        login: {
          type: "string",
          title: "Login",
        },
        password: {
          type: "string",
          title: "Password",
        },
        bindingId: {
          type: "integer",
          title: "MEDDEP ID",
        },
        authKey: {
          type: "string",
          title: "Auth Key",
        },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};
