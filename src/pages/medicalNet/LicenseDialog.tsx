import React from "react";
import { jwtDecode } from "jwt-decode";
import DataFnsAdapter from "@date-io/date-fns";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  TextField,
} from "@mui/material";

import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import {
  MedicalNetLicenseData,
  MedicalNetLicenseLimitRecord,
} from "../../helpers/dto";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { useLanguageValue } from "../../context/LanguageContext";
import { getGridLocaleText } from "../../helpers/grid";
import { getEnumName, LicenseLimitType } from "../../helpers/enums";

interface LicensePayload {
  jti?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  dbCode?: string;
  options?: any;
}

interface LicenseDialogProps {
  isOpen: boolean;
  license: string;
  onClose: () => void;
  onRequestData: () => Promise<MedicalNetLicenseData>;
}

const LicenseDialog = ({
  isOpen,
  license,
  onClose,
  onRequestData,
}: LicenseDialogProps): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DataFnsAdapter();

  const [id, setId] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [dbCode, setDbCode] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  // const [options, setOptions] = React.useState("");

  const [data, setData] = React.useState<MedicalNetLicenseData>({
    limits: [],
    features: [],
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!license) return;
    const data = jwtDecode(license) as LicensePayload;
    setId(data.jti || "");
    setSubject(data.sub || "");
    setDbCode(data.dbCode || "");
    setStartDate(
      data.iat
        ? dateFns.formatByString(new Date(data.iat * 1000), "dd.MM.yyyy")
        : ""
    );
    setEndDate(
      data.exp
        ? dateFns.formatByString(new Date(data.exp * 1000), "dd.MM.yyyy")
        : ""
    );
    // setOptions(data.options ? JSON.stringify(data.options) : "");

    setLoading(true);
    onRequestData()
      .then((result) => {
        setData(result);
      })
      .finally(() => setLoading(false));
  }, [license]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "code",
        align: "left",
        sortable: false,
        headerName: t("LICENSELIMIT.FIELDS.code") ?? "",
        type: "string",
        flex: 1,
        valueGetter: (value: number) =>
          getEnumName(
            LicenseLimitType,
            LicenseLimitType[value],
            t,
            "ENUMS.LicenseLimitType"
          ),
      },
      {
        field: "limitValue",
        align: "right",
        sortable: false,
        headerName: t("LICENSELIMIT.FIELDS.limitValue") ?? "",
        width: 150,
      },
      {
        field: "currentValue",
        align: "right",
        sortable: false,
        headerName: t("LICENSELIMIT.FIELDS.currentValue") ?? "",
        width: 150,
        cellClassName: (
          params: GridCellParams<MedicalNetLicenseLimitRecord, number>
        ) =>
          params.row.limitValue &&
          params.row.limitValue - params.row.currentValue <= 20
            ? "text-red"
            : "",
      },
    ],
    [languageState.language]
  );

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
        <span>{t("MEDICALNET.LICENSEDIALOG.TITLE")}</span>
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
      <DialogContent dividers>
        <Grid2 container spacing={2}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              value={subject || ""}
              label={t("MEDICALNET.LICENSEDIALOG.OWNER")}
              type="text"
              fullWidth
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              value={id || ""}
              label={t("MEDICALNET.LICENSEDIALOG.ID")}
              type="text"
              fullWidth
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              value={dbCode || ""}
              label={t("MEDICALNET.LICENSEDIALOG.DATABASE")}
              type="text"
              fullWidth
            />
          </Grid2>
          <Grid2 size={3}>
            <TextField
              variant="outlined"
              label={t("MEDICALNET.LICENSEDIALOG.STARTDATE")}
              value={startDate}
              type="text"
              fullWidth
            />
          </Grid2>
          <Grid2 size={3}>
            <TextField
              variant="outlined"
              label={t("MEDICALNET.LICENSEDIALOG.ENDDATE")}
              value={endDate}
              type="text"
              fullWidth
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              variant="outlined"
              label={t("MEDICALNET.LICENSEDIALOG.FEATURES")}
              value={data.features.join(", ")}
              type="text"
              fullWidth
            />
          </Grid2>
          <Grid2
            size={12}
            sx={{ "& .text-red": { color: "red", fontWeight: "bold" } }}
          >
            <DataGrid
              loading={loading}
              autoHeight
              disableColumnFilter
              disableColumnMenu
              rows={data.limits}
              columns={columns}
              getRowId={(row: MedicalNetLicenseLimitRecord) =>
                row.code as string
              }
              getRowHeight={() => "auto"}
              localeText={getGridLocaleText(languageState.language)}
              hideFooter
            />
          </Grid2>
        </Grid2>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseDialog;
