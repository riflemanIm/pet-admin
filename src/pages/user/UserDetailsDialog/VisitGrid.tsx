import React from "react";
import { VisitRecordDto } from "../../../helpers/dto";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowClassNameParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { EventOutlined as EventIcon } from "@mui/icons-material";
import { getGridLocaleText } from "../../../helpers/grid";
import { useLanguageValue } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import DateFnsAdapter from "@date-io/date-fns";
import { useUserState } from "../../../context/UserContext";
import { AccountRole } from "../../../helpers/enums";
import { getBackgroundColor, getHoverBackgroundColor } from "./helper";

interface VisitGridProps {
  userId: number;
  onRequestVisitRecords: (userId: number) => Promise<VisitRecordDto[]>;
  onSetVisitOutsidePlanning: (
    visitId: number,
    isOutsidePlanning: boolean
  ) => Promise<boolean>;
}

const VisitGrid = ({
  userId,
  onRequestVisitRecords,
  onSetVisitOutsidePlanning,
}: VisitGridProps) => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DateFnsAdapter();
  const {
    currentUser: { role },
  } = useUserState();

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<VisitRecordDto[]>([]);

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    onRequestVisitRecords(userId as number)
      .then((result) => {
        setRows(result);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const changeOutsidePlanning = React.useCallback(
    (visitId: number, isOutsidePlanning: boolean) => {
      if (!userId || !visitId) return;
      setLoading(true);
      onSetVisitOutsidePlanning(visitId, isOutsidePlanning)
        .then(() => onRequestVisitRecords(userId as number))
        .then((result) => {
          setRows(result);
        })
        .finally(() => setLoading(false));
    },
    [userId]
  );

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "visitId",
        align: "right",
        headerName: t("VISITRECORD.FIELDS.visitId") ?? "",
        type: "number",
        width: 100,
      },
      {
        field: "actions",
        align: "left",
        headerName: t("VISITRECORD.FIELDS.actions") ?? "",
        sortable: false,
        filterable: false,
        width: 80,
        type: "actions",
        getActions: (params: GridRowParams) =>
          role === AccountRole.operator
            ? []
            : [
                <GridActionsCellItem
                  key="changeOutsidePlanning"
                  icon={<EventIcon />}
                  label="Сменить признак в сетке"
                  color="primary"
                  onClick={() =>
                    changeOutsidePlanning(
                      params.id as number,
                      !params.row.isOutsidePlanning
                    )
                  }
                />,
              ],
      },
      {
        field: "clinicId",
        align: "left",
        headerName: t("VISITRECORD.FIELDS.clinicId") ?? "",
        type: "number",
        width: 80,
      },
      {
        field: "planningId",
        align: "right",
        headerName: t("VISITRECORD.FIELDS.planningId") ?? "",
        type: "number",
        width: 100,
      },
      {
        field: "doctorId",
        align: "left",
        headerName: t("VISITRECORD.FIELDS.doctorId") ?? "",
        type: "number",
        width: 80,
      },
      {
        field: "doctorName",
        align: "left",
        headerName: t("VISITRECORD.FIELDS.doctorName") ?? "",
        flex: 1,
      },
      {
        field: "plExamName",
        align: "left",
        headerName: t("VISITRECORD.FIELDS.plExamName") ?? "",
        flex: 1,
      },
      {
        field: "visitDate",
        align: "right",
        headerName: t("VISITRECORD.FIELDS.visitDate") ?? "",
        width: 140,
        type: "dateTime",
        valueFormatter: (value: string) =>
          value
            ? dateFns.formatByString(new Date(value), "dd.MM.yyyy HH:mm")
            : "",
      },
      {
        field: "isOutsidePlanning",
        headerName: t("VISITRECORD.FIELDS.isOutsidePlanning") ?? "",
        type: "boolean",
      },
    ],
    [languageState.language, changeOutsidePlanning]
  );

  return (
    <DataGrid
      loading={loading}
      rows={rows}
      columns={columns}
      getRowId={(row: VisitRecordDto) => row.visitId as number}
      getRowHeight={() => "auto"}
      localeText={getGridLocaleText(languageState.language)}
      hideFooter
      getRowClassName={(params: GridRowClassNameParams<VisitRecordDto>) => {
        if (params.row.isCanceled) return "grid-row-cancelled";
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

export default VisitGrid;
