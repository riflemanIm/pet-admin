import React from "react";
import { ListDto, NotificationDto, OrderDirection } from "../../../helpers/dto";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowParams,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  EventType,
  eventTypeNames,
  getEnumName,
  listEnums,
  NotificationRecordType,
  notificationRecordTypeNames,
  NotificationStatus,
  notificationStatusNames,
  NotificationType,
} from "../../../helpers/enums";
import { Html as HtmlIcon } from "@mui/icons-material";

import { getGridLocaleText } from "../../../helpers/grid";
import { useLanguageValue } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import DateFnsAdapter from "@date-io/date-fns";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Popover,
  Switch,
} from "@mui/material";

interface NotificationsGridProps {
  userId: number;
  onRequestData: (
    userId: number,
    useLog?: boolean,
    startIndex?: number,
    count?: number,
    filter?: string,
    orderBy?: string,
    order?: OrderDirection
  ) => Promise<ListDto<NotificationDto>>;
}

const NotificationsGrid = ({
  userId,
  onRequestData,
}: NotificationsGridProps) => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DateFnsAdapter();

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<NotificationDto[]>([]);
  const [useLog, setUseLog] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [preview, setPreview] = React.useState<string | undefined>(undefined);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const startIndex = paginationModel.page * paginationModel.pageSize;
    onRequestData(
      userId,
      useLog,
      startIndex,
      paginationModel.pageSize,
      JSON.stringify(filterModel),
      sortModel[0]?.field,
      sortModel[0]?.sort
    )
      .then((result) => {
        setRows(result.rows);
        setTotalCount(result.totalCount);
      })
      .finally(() => setLoading(false));
  }, [userId, sortModel, filterModel, paginationModel, useLog]);

  const NotificationsToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flexGrow: 1 }} />
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={useLog} onChange={() => setUseLog(!useLog)} />
          }
          label={t("NOTIFICATION.USE_LOG") ?? ""}
        />
      </FormGroup>
    </GridToolbarContainer>
  );

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "ntfNotifyId",
        align: "right",
        headerName: t("NOTIFICATION.FIELDS.ntfNotifyId") ?? "",
        type: "number",
        width: 80,
      },
      {
        field: "recordType",
        align: "left",
        headerName: t("NOTIFICATION.FIELDS.recordType") ?? "",
        width: 240,
        type: "singleSelect",
        valueOptions: notificationRecordTypeNames(
          t,
          "ENUMS.NotificationRecordType"
        ),
        valueFormatter: (value: string) =>
          getEnumName(
            NotificationRecordType,
            value,
            t,
            "ENUMS.NotificationRecordType"
          ),
      },
      {
        field: "recId",
        align: "left",
        headerName: t("NOTIFICATION.FIELDS.recId") ?? "",
        type: "number",
      },
      {
        field: "eventType",
        align: "left",
        headerName: t("NOTIFICATION.FIELDS.eventType") ?? "",
        width: 240,
        type: "singleSelect",
        valueOptions: eventTypeNames(t, "ENUMS.EventType"),
        valueFormatter: (value: string) =>
          getEnumName(EventType, value, t, "ENUMS.EventType"),
      },
      {
        field: "notificationType",
        align: "left",
        headerName: t("NOTIFICATION.FIELDS.notificationType") ?? "",
        width: 140,
        type: "singleSelect",
        valueOptions:
          listEnums(NotificationType, t, "ENUMS.NotificationType") ?? "",
        valueFormatter: (value: string) =>
          getEnumName(NotificationType, value, t, "ENUMS.NotificationType"),
      },
      {
        field: "customNotifyTitle",
        align: "left",
        headerName: t("NOTIFICATION.FIELDS.customNotifyTitle") ?? "",
        width: 180,
      },
      {
        field: "notifyText",
        align: "left",
        headerName: t("NOTIFICATION.FIELDS.notifyText") ?? "",
        flex: 1,
        minWidth: 300,
      },
      {
        field: "notifyTextHtml",
        align: "left",
        headerName: t("NOTIFICATION.FIELDS.notifyTextHtml") ?? "",
        type: "actions",
        getActions: (params: GridRowParams<NotificationDto>) => [
          <GridActionsCellItem
            key="html"
            icon={<HtmlIcon />}
            label="HTML"
            color="primary"
            disabled={!params.row.notifyTextHtml}
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setAnchorEl(event.currentTarget);
              setPreview(params.row.notifyTextHtml);
            }}
          />,
        ],
      },
      {
        field: "notifyDate",
        align: "right",
        headerName: t("NOTIFICATION.FIELDS.notifyDate") ?? "",
        width: 150,
        type: "dateTime",
        valueFormatter: (value: string) =>
          value
            ? dateFns.formatByString(new Date(value), "dd.MM.yyyy HH:mm")
            : "",
      },
      {
        field: "status",
        align: "left",
        headerName: t("NOTIFICATION.FIELDS.status") ?? "",
        width: 200,
        type: "singleSelect",
        valueOptions:
          notificationStatusNames(t, "ENUMS.NotificationStatus") ?? "",
        valueFormatter: (value: string) =>
          getEnumName(NotificationStatus, value, t, "ENUMS.NotificationStatus"),
      },
    ],
    [languageState.language]
  );

  return (
    <React.Fragment>
      <Popover
        id={preview ? "preview-popper" : undefined}
        open={!!preview}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setPreview(undefined);
        }}
      >
        <iframe
          title="preview"
          srcDoc={preview}
          width={800}
          height={600}
          style={{ border: 0 }}
        />
      </Popover>
      <DataGrid
        loading={loading}
        rows={rows}
        columns={columns}
        getRowId={(row: NotificationDto) => row.ntfNotifyId as number}
        getRowHeight={() => "auto"}
        localeText={getGridLocaleText(languageState.language)}
        rowCount={totalCount}
        paginationMode="server"
        pageSizeOptions={[5, 10, 25, 50, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={(newPaginationModel) =>
          setPaginationModel(newPaginationModel)
        }
        sortModel={sortModel}
        onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
        filterModel={filterModel}
        filterMode="server"
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
        slots={{
          toolbar: NotificationsToolbar,
        }}
      />
    </React.Fragment>
  );
};

export default NotificationsGrid;
