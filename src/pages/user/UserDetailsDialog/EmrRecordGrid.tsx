import React from "react";
import { EmrRecordDto } from "../../../helpers/dto";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowClassNameParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { DeleteOutlined as DeleteIcon } from "@mui/icons-material";

import { getGridLocaleText } from "../../../helpers/grid";
import { useLanguageValue } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import DateFnsAdapter from "@date-io/date-fns";
import { DeleteDialog } from "../../../components/Common/deleteDialog";
import { useUserState } from "../../../context/UserContext";
import { AccountRole } from "../../../helpers/enums";
import { getBackgroundColor, getHoverBackgroundColor } from "./helper";

interface EmrRecordGridProps {
  userId: number;
  onRequestEmrRecords: (userId: number) => Promise<EmrRecordDto[]>;
  onDeleteEmrRecord: (userId: number, id: number) => Promise<boolean>;
}

const EmrRecordGrid = ({
  userId,
  onRequestEmrRecords,
  onDeleteEmrRecord,
}: EmrRecordGridProps) => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DateFnsAdapter();

  const {
    currentUser: { role },
  } = useUserState();

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<EmrRecordDto[]>([]);
  const [emrRecordDelete, setEmrRecordDelete] = React.useState<{
    open: boolean;
    id: number;
  }>({
    open: false,
    id: 0,
  });

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    onRequestEmrRecords(userId as number)
      .then((result) => {
        setRows(result);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const deleteEmrRecord = React.useCallback(() => {
    const id = emrRecordDelete.id;
    if (!userId || !id) return;
    setEmrRecordDelete({ ...emrRecordDelete, open: false });
    setLoading(true);
    onDeleteEmrRecord(userId, id)
      .then(() => onRequestEmrRecords(userId as number))
      .then((result) => {
        setRows(result);
      })
      .finally(() => setLoading(false));
  }, [userId, emrRecordDelete.id]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "emrRecordId",
        align: "right",
        headerName: t("EMRRECORD.FIELDS.emrRecordId") ?? "",
        type: "number",
        width: 75,
      },
      {
        field: "actions",
        align: "left",
        headerName: t("EMRRECORD.FIELDS.actions") ?? "",
        sortable: false,
        filterable: false,
        width: 80,
        type: "actions",
        getActions: (params: GridRowParams) =>
          role === AccountRole.operator
            ? []
            : [
                <GridActionsCellItem
                  key="delete"
                  icon={<DeleteIcon />}
                  label="Удалить"
                  color="primary"
                  onClick={() =>
                    setEmrRecordDelete({ open: true, id: params.id as number })
                  }
                />,
              ],
      },
      {
        field: "id",
        align: "right",
        headerName: t("EMRRECORD.FIELDS.id") ?? "",
        type: "number",
        width: 100,
      },
      {
        field: "description",
        align: "left",
        headerName: t("EMRRECORD.FIELDS.description") ?? "",
        flex: 1,
      },
      {
        field: "clinicId",
        align: "left",
        headerName: t("EMRRECORD.FIELDS.clinicId") ?? "",
        type: "number",
        width: 80,
      },
      {
        field: "doctorId",
        align: "left",
        headerName: t("EMRRECORD.FIELDS.doctorId") ?? "",
        type: "number",
        width: 80,
      },
      {
        field: "visitId",
        align: "left",
        headerName: t("EMRRECORD.FIELDS.visitId") ?? "",
        type: "number",
        width: 80,
      },
      {
        field: "modelNameMultiLang",
        align: "left",
        headerName: t("EMRRECORD.FIELDS.modelNameMultiLang") ?? "",
        width: 140,
      },
      {
        field: "specializationNameMultiLang",
        align: "left",
        headerName: t("EMRRECORD.FIELDS.specializationNameMultiLang") ?? "",
        width: 140,
      },
      {
        field: "dateTime",
        align: "right",
        headerName: t("EMRRECORD.FIELDS.dateTime") ?? "",
        width: 140,
        type: "dateTime",
        valueFormatter: (value: string) =>
          value
            ? dateFns.formatByString(new Date(value), "dd.MM.yyyy HH:mm")
            : "",
      },
    ],
    [languageState.language, setEmrRecordDelete]
  );

  return (
    <React.Fragment>
      <DeleteDialog
        open={emrRecordDelete.open}
        onClose={() => setEmrRecordDelete({ ...emrRecordDelete, open: false })}
        onDelete={deleteEmrRecord}
      />
      <DataGrid
        loading={loading}
        rows={rows}
        columns={columns}
        getRowId={(row: EmrRecordDto) => row.emrRecordId as number}
        getRowHeight={() => "auto"}
        localeText={getGridLocaleText(languageState.language)}
        hideFooter
        getRowClassName={(params: GridRowClassNameParams<EmrRecordDto>) => {
          if (!params.row.isApproved) {
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
    </React.Fragment>
  );
};

export default EmrRecordGrid;
