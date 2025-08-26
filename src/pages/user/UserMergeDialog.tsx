import React from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { MergeInfoDto } from "../../helpers/dto";
import MergeViewCard from "./MergeViewCard";

interface UserDetailsDialogProps {
  isOpen: boolean;
  userIds: number[];
  onRequestMergeInfo: (
    sourceId: number,
    targetId: number
  ) => Promise<MergeInfoDto>;
  onMerge: (
    sourceId: number,
    targetId: number,
    copyFields: string[]
  ) => Promise<string>;
  onClose: (success: boolean) => void;
}

const UserMergeDialog = ({
  isOpen,
  userIds,
  onRequestMergeInfo,
  onMerge,
  onClose,
}: UserDetailsDialogProps): JSX.Element => {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(false);
  const [mergeInfo, setMergeInfo] = React.useState<MergeInfoDto | undefined>();
  const [errorText, setErrorText] = React.useState("");
  const [copyFields, setCopyFields] = React.useState<string[]>([]);

  React.useEffect(() => {
    setErrorText("");
    if (!userIds || userIds.length !== 2) return;
    setLoading(true);
    onRequestMergeInfo(userIds[0], userIds[1])
      .then((result) => {
        setMergeInfo(result);
      })
      .finally(() => setLoading(false));
  }, [userIds]);

  React.useEffect(() => {
    if (mergeInfo?.source?.mmk && mergeInfo?.target?.mmk) {
      setErrorText(t("USER.MERGEDIALOG.ERROR_BOTH_MMK"));
    } else if (!mergeInfo?.source?.mmk && !mergeInfo?.target?.mmk) {
      setErrorText(t("USER.MERGEDIALOG.ERROR_BOTH_NOMMK"));
    } else {
      setErrorText("");
    }
  }, [mergeInfo]);

  const merge = async () => {
    if (mergeInfo?.source && mergeInfo?.target) {
      const error = await onMerge(
        mergeInfo.source.userId,
        mergeInfo.target.userId,
        copyFields
      );
      if (!error) {
        onClose(true);
      } else {
        setErrorText(error);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose(false)}
      scroll={"body"}
      maxWidth="lg"
      fullWidth
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        <span style={{ paddingRight: 32 }}>{t("USER.MERGEDIALOG.TITLE")}</span>
        <IconButton
          aria-label="close"
          onClick={() => onClose(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ borderBottom: 1, borderColor: "divider" }}>
        {errorText && <Alert severity="error">{errorText}</Alert>}
        <Grid2 container spacing={2}>
          <Grid2 size={{ md: 6, xs: 12 }}>
            {!loading && mergeInfo?.target && (
              <MergeViewCard
                user={mergeInfo.target}
                prefix={t("USER.MERGEDIALOG.TARGET")}
              />
            )}
          </Grid2>
          <Grid2 size={{ md: 6, xs: 12 }}>
            {!loading && mergeInfo?.source && (
              <MergeViewCard
                user={mergeInfo.source}
                prefix={t("USER.MERGEDIALOG.SOURCE")}
                copyFields={copyFields}
                onCopyFieldsChange={(newFields: string[]) =>
                  setCopyFields(newFields)
                }
              />
            )}
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>{t("COMMON.CLOSE")}</Button>
        <Button
          disabled={loading || !!errorText}
          color="primary"
          onClick={() => merge()}
        >
          {t("USER.MERGE")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserMergeDialog;
