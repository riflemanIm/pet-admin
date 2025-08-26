import React from "react";
import { SpamDto } from "../../../helpers/dto";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getEnumName, SpamReason } from "../../../helpers/enums";
import { getGridLocaleText } from "../../../helpers/grid";
import { useLanguageValue } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import DateFnsAdapter from "@date-io/date-fns";
import { Button } from "@mui/material";

interface SpamGridProps {
  userId: number;
  onRequestSpam: (userId: number) => Promise<SpamDto[]>;
  onDeleteSpam: (userId: number) => Promise<boolean>;
}

const SpamGrid = ({ userId, onRequestSpam, onDeleteSpam }: SpamGridProps) => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DateFnsAdapter();

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<SpamDto[]>([]);

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    onRequestSpam(userId as number)
      .then((result) => {
        setRows(result);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const deleteSpam = React.useCallback(() => {
    if (!userId) return;
    setLoading(true);
    onDeleteSpam(userId)
      .then(() => onRequestSpam(userId as number))
      .then((result) => {
        setRows(result);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "spamId",
        align: "right",
        headerName: t("SPAM.FIELDS.spamId") ?? "",
        type: "number",
        width: 80,
      },
      {
        field: "ip",
        align: "left",
        headerName: t("SPAM.FIELDS.ip") ?? "",
        width: 100,
      },
      {
        field: "address",
        align: "left",
        headerName: t("SPAM.FIELDS.address") ?? "",
        flex: 1,
      },
      {
        field: "spamReasonId",
        align: "left",
        headerName: t("SPAM.FIELDS.spamReasonId") ?? "",
        width: 250,
        valueFormatter: (value: string) =>
          getEnumName(SpamReason, value, t, "ENUMS.SpamReason"),
      },
      {
        field: "cdate",
        align: "right",
        headerName: t("SPAM.FIELDS.cdate") ?? "",
        width: 150,
        type: "dateTime",
        valueFormatter: (value: string) =>
          value
            ? dateFns.formatByString(new Date(value), "dd.MM.yyyy HH:mm")
            : "",
      },
    ],
    [languageState.language]
  );

  return (
    <React.Fragment>
      <DataGrid
        loading={loading}
        rows={rows}
        columns={columns}
        getRowId={(row: SpamDto) => row.spamId as number}
        getRowHeight={() => "auto"}
        localeText={getGridLocaleText(languageState.language)}
        hideFooter
      />
      <Button onClick={() => deleteSpam()}>{t("COMMON.DELETE")}</Button>
    </React.Fragment>
  );
};

export default SpamGrid;
