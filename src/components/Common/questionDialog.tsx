import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export interface QuestionDialogProps {
  open: boolean;
  title: string;
  text: string | null;
  okText?: string;
  onClose: () => void;
  onOk: () => void;
}

export const QuestionDialog = (props: QuestionDialogProps) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={props.open}
      onClose={() => props.onClose()}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()} color="primary">
          {t("COMMON.CANCEL")}
        </Button>
        <Button onClick={() => props.onOk()} color="primary" autoFocus>
          {props.okText || t("COMMON.ACCEPT")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
