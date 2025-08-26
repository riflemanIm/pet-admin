import React from "react";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { Close as CloseIcon } from "@mui/icons-material";
import { WebFormAuthResultDto } from "../../helpers/dto";
import { useTranslation } from "react-i18next";

interface WebFormDialogProps {
  isOpen: boolean;
  formId: number;
  formUUID: string;
  onAuth: (formId: number) => Promise<WebFormAuthResultDto | undefined>;
  onClose: () => void;
}

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "768px",
  },
}));

const WebFormDialog = ({
  isOpen,
  formId,
  formUUID,
  onAuth,
  onClose,
}: WebFormDialogProps): JSX.Element => {
  const classes = useStyles();
  const { t } = useTranslation();
  const ref = React.useRef<HTMLIFrameElement>(null);
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    if (!isOpen || !formId) return;
    onAuth(formId).then((data: WebFormAuthResultDto | undefined) => {
      if (!data) setUrl("");
      else {
        // console.log(`${data.address}/medialog/form/?formGuid=${formUUID}&token=${data.accessToken}&refreshToken=${data.refreshToken}`)
        setUrl(
          `${data.address}/medialog/form/?formGuid=${formUUID}&token=${data.accessToken}&refreshToken=${data.refreshToken}`
        );
      }
    });
  }, [isOpen, formId, formUUID]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      maxWidth="md"
      fullWidth
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        <span>{t("WEBFORM.PREVIEW")}</span>
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
        <iframe
          title="form"
          className={classes.root}
          src={url}
          allowFullScreen
          allow="microphone; camera; autoplay; display-capture"
          ref={ref}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WebFormDialog;
