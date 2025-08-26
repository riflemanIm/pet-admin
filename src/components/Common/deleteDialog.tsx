import React from "react";
import { useTranslation } from "react-i18next";
import { QuestionDialog } from "./questionDialog";

interface DeleteDialogProps {
  open: boolean;
  deleteText?: string | null;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteDialog = (props: DeleteDialogProps) => {
  const { t } = useTranslation();
  return (
    <QuestionDialog
      open={props.open}
      title={t("COMMON.DELETE")}
      text={props.deleteText || t("COMMON.DELETE_CONFIRMATION")}
      okText={t("COMMON.DELETE") as string}
      onClose={props.onClose}
      onOk={props.onDelete}
    />
  );
};
