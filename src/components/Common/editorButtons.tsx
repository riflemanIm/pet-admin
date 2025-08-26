import React from "react";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface EditorButtonsProps {
  width?: number;
  submitText?: string;
  submitDisabled?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const EditorButtons = (props: EditorButtonsProps) => {
  const { t } = useTranslation();
  return (
    <Box
      display="flex"
      justifyContent={"space-between"}
      width={props.width}
      sx={{ marginTop: "35px" }}
    >
      <Button
        variant={"outlined"}
        color={"primary"}
        onClick={() => props.onCancel()}
      >
        {t("COMMON.CANCEL")}
      </Button>
      <Button
        variant={"contained"}
        color={"primary"}
        disabled={props.submitDisabled}
        onClick={() => props.onSubmit()}
      >
        {props.submitText ?? t("COMMON.SAVE")}
      </Button>
    </Box>
  );
};
