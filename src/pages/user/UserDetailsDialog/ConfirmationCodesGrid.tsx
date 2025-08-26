import React from "react";
import { ConfirmationCodeDto } from "../../../helpers/dto";
import { DataGrid, GridColDef, GridRowClassNameParams } from "@mui/x-data-grid";
import { ConfirmationCodeType, getEnumName } from "../../../helpers/enums";
import { getGridLocaleText } from "../../../helpers/grid";
import { useLanguageValue } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import DateFnsAdapter from "@date-io/date-fns";
import { getBackgroundColor, getHoverBackgroundColor } from "./helper";

const dateDiffInMinutes = (
  curTime: string | Date,
  actionTime: string | Date
): number => {
  if (typeof curTime === "string") curTime = new Date(curTime);

  if (typeof actionTime === "string") actionTime = new Date(actionTime);

  const diffTime = Math.abs(curTime.getTime() - actionTime.getTime());
  return Math.ceil(diffTime / (1000 * 60));
};

interface ConfirmationCodesGridProps {
  userId: number;
  onRequestConfirmationCodes: (
    userId: number
  ) => Promise<ConfirmationCodeDto[]>;
}

const ConfirmationCodesGrid = ({
  userId,
  onRequestConfirmationCodes,
}: ConfirmationCodesGridProps) => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DateFnsAdapter();

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<ConfirmationCodeDto[]>([]);

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    onRequestConfirmationCodes(userId as number)
      .then((result) => {
        setRows(result);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "confirmationCodesId",
        align: "right",
        headerName: t("CONFIRMATIONCODE.FIELDS.confirmationCodesId") ?? "",
        width: 80,
        type: "number",
      },
      {
        field: "confirmationCodeTypesId",
        align: "left",
        headerName: t("CONFIRMATIONCODE.FIELDS.confirmationCodeTypesId") ?? "",
        width: 240,
        valueFormatter: (value: number) =>
          getEnumName(
            ConfirmationCodeType,
            value,
            t,
            "ENUMS.ConfirmationCodeType"
          ) ?? value,
      },
      {
        field: "code",
        align: "left",
        headerName: t("CONFIRMATIONCODE.FIELDS.code") ?? "",
        width: 70,
      },
      {
        field: "customData",
        align: "left",
        headerName: t("CONFIRMATIONCODE.FIELDS.customData") ?? "",
        width: 120,
      },
      {
        field: "creationDate",
        align: "right",
        headerName: t("CONFIRMATIONCODE.FIELDS.creationDate") ?? "",
        width: 180,
        type: "date",
        valueFormatter: (value: string) =>
          value
            ? dateFns.formatByString(new Date(value), "dd.MM.yyyy HH:mm:ss")
            : "",
      },
      {
        field: "lifeTime",
        align: "right",
        headerName: t("CONFIRMATIONCODE.FIELDS.lifeTime") ?? "",
        width: 110,
        type: "number",
      },
      {
        field: "maxTryCnt",
        align: "right",
        headerName: t("CONFIRMATIONCODE.FIELDS.maxTryCnt") ?? "",
        width: 120,
        type: "number",
      },
      {
        field: "tryCnt",
        align: "right",
        headerName: t("CONFIRMATIONCODE.FIELDS.tryCnt") ?? "",
        width: 120,
        type: "number",
      },
      {
        field: "nextCodeDelay",
        align: "right",
        headerName: t("CONFIRMATIONCODE.FIELDS.nextCodeDelay") ?? "",
        width: 120,
        type: "number",
      },
    ],
    [languageState.language]
  );

  return (
    <DataGrid
      loading={loading}
      rows={rows}
      columns={columns}
      getRowId={(row: ConfirmationCodeDto) => row.confirmationCodesId as number}
      getRowHeight={() => "auto"}
      localeText={getGridLocaleText(languageState.language)}
      hideFooter
      getRowClassName={(
        params: GridRowClassNameParams<ConfirmationCodeDto>
      ) => {
        if (
          dateDiffInMinutes(
            params.row.serverDateTime,
            params.row.creationDate
          ) > params.row.lifeTime
        ) {
          return "grid-row-cancelled";
        }
        return "";
      }}
      sx={{
        "& .grid-row-cancelled": {
          bgcolor: (theme) =>
            getBackgroundColor(theme.palette.error.main, theme.palette.mode),
          "&:hover": {
            bgcolor: (theme) =>
              getHoverBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode
              ),
          },
        },
      }}
    />
  );
};

export default ConfirmationCodesGrid;
