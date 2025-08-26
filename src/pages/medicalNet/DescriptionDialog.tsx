import React from "react";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import MDEditor from "@uiw/react-markdown-editor";
import { useTranslation } from "react-i18next";
import config from "../../config";


export const transformImageUri = (src: string): string => {
  if (src.startsWith("images/"))
    return `${config.baseURLApi}/docs/medicalNetSettings/${src}`;
  return src;
}

interface DescriptionDialogProps {
  isOpen: boolean;
  title?: string;
  text?: string;
  onClose: () => void;
}

const DescriptionDialog = ({
  isOpen,
  title,
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
        <span>{title}</span>
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
        <div className="container" data-color-mode="light">
          <MDEditor.Markdown source={text} urlTransform={transformImageUri} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionDialog;
