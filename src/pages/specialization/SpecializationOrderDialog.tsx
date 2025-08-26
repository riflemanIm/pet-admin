import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";

interface SpecializationOrderDialogProps {
  isOpen: boolean;
  sortOrder?: number;
  onClose: (success: boolean, value?: number) => void;
}

const SpecializationOrderDialog = ({
  isOpen,
  sortOrder,
  onClose,
}: SpecializationOrderDialogProps): JSX.Element => {
  const { t } = useTranslation();
  const [newSortOrder, setNewSortOrder] = React.useState<number | undefined>();
  React.useEffect(() => setNewSortOrder(sortOrder), [sortOrder]);
  return (
    <Dialog open={isOpen} onClose={() => onClose(false, newSortOrder)}>
      <DialogTitle>{t("SPECIALIZATION.ORDERDIALOG.TITLE")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t("SPECIALIZATION.ORDERDIALOG.ACTION")}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="sortOrder"
          label="Порядок"
          type="number"
          fullWidth
          variant="standard"
          value={newSortOrder ?? ""}
          onChange={(event) =>
            setNewSortOrder(
              event.target.value ? Number(event.target.value) : undefined
            )
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false, newSortOrder)}>
          {t("COMMON.CANCEL")}
        </Button>
        <Button onClick={() => onClose(true, newSortOrder)}>ОК</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SpecializationOrderDialog;
