import React from "react";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface AgreementDialogProps {
  isOpen: boolean;
  agreement?: string;
  onClose: () => void;
}

const AgreementDialog = ({
  isOpen,
  agreement,
  onClose,
}: AgreementDialogProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      scroll={"body"}
      maxWidth="md"
      fullWidth
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        <span>{t("AGREEMENT.TITLE")}</span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{agreement || ""}</DialogContent>
    </Dialog>
  );
};

export default AgreementDialog;
