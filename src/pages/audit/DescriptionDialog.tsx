import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import config from "../../config";
import JSONEditor from "../../components/JSONEditor";
import { Mode } from "vanilla-jsoneditor";

export const transformImageUri = (src: string): string => {
  if (src.startsWith("images/"))
    return `${config.baseURLApi}/docs/medicalNetSettings/${src}`;
  return src;
};

interface DescriptionDialogProps {
  isOpen: boolean;
  text?: string;
  onClose: () => void;
}

const DescriptionDialog = ({
  isOpen,
  text,
  onClose,
}: DescriptionDialogProps): JSX.Element => {
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
        <span>{t("AUDIT.DESCRIPTION.TITLE")}</span>
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
      <DialogContent>
        <JSONEditor
          content={{
            text: text || "{}",
          }}
          mainMenuBar={true}
          navigationBar={false}
          mode={Mode.text}
          readOnly={true}
          style={{ height: "768px" }}
          boxStyle={{ height: "768px" }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionDialog;
