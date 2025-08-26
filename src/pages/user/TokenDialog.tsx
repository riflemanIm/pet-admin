import React from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import { MedicalNetDto } from "../../helpers/dto";
import { useTranslation } from "react-i18next";

interface TokenDialogProps {
  isOpen: boolean;
  userId?: number;
  medicalNets: MedicalNetDto[];
  defaultMedicalNetId?: number;
  token?: string;
  onRequestToken: (userId: number, medicalNetId: number) => Promise<string>;
  onClose: () => void;
}

const TokenDialog = ({
  isOpen,
  userId,
  medicalNets,
  defaultMedicalNetId,
  onClose,
  onRequestToken,
}: TokenDialogProps): JSX.Element => {
  const { t } = useTranslation();
  const [medicalNetId, setMedicalNetId] = React.useState<number | undefined>();
  const [url, setUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (!isOpen || !userId || !medicalNetId) return;
    onRequestToken(userId as number, medicalNetId as number).then((token) => {
      setUrl(
        token
          ? `${
              medicalNets.find((it) => it.medicalNetId === medicalNetId)
                ?.websiteUrl
            }?token=${token}`
          : ""
      );
    });
  }, [isOpen, userId, medicalNetId, setUrl]);

  React.useEffect(
    () => setMedicalNetId(defaultMedicalNetId),
    [defaultMedicalNetId]
  );
  React.useEffect(() => setUrl(""), [userId]);
  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      scroll={"body"}
      maxWidth="sm"
      fullWidth
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        <span style={{ paddingRight: 32 }}>{t("USER.TOKENDIALOG.TITLE")}</span>
        <IconButton
          aria-label="close"
          onClick={() => onClose()}
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
        <Box m={3} display="flex" flexDirection="column">
          <FormControl variant="standard" fullWidth>
            <InputLabel id="id-medical_net-label">
              {t("USER.TOKENDIALOG.MEDICALNET")}
            </InputLabel>
            <Select
              name="medicalNetId"
              id="id-medical_net-select"
              labelId="id-medical_net-label"
              label={t("USER.TOKENDIALOG.MEDICALNET")}
              onChange={(event) => {
                setUrl("");
                setMedicalNetId(event.target.value as number);
              }}
              value={medicalNetId || ""}
            >
              {medicalNets.map((item) => (
                <MenuItem value={item.medicalNetId} key={item.medicalNetId}>
                  {`${item.title} (${item.appCode})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>{t("COMMON.CANCEL")}</Button>
        <Button
          href={url}
          target="_blank"
          disabled={!medicalNetId}
          color="primary"
        >
          {t("USER.TOKENDIALOG.OPEN")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TokenDialog;
