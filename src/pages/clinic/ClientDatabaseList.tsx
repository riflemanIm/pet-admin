import React from "react";
import { ListDto, OrderDirection, ClientDatabaseDto } from "../../helpers/dto";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowEditStopReasons,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

// Icons
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  Save as SaveIcon,
  Close as CancelIcon,
} from "@mui/icons-material";

import { getGridLocaleText } from "../../helpers/grid";
import { useLanguageValue } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import { DeleteDialog } from "../../components/Common/deleteDialog";
import { useSnackbar } from "notistack";

interface ClientDatabaseListProps {
  onRequestData: (
    startIndex?: number,
    count?: number,
    filter?: string,
    orderBy?: string,
    order?: OrderDirection
  ) => Promise<ListDto<ClientDatabaseDto>>;
  onAdd: (data: ClientDatabaseDto) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: ClientDatabaseDto) => Promise<void>;
}

const ClientDatabaseList = ({
  onRequestData,
  onAdd,
  onDelete,
  onUpdate,
}: ClientDatabaseListProps) => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = React.useState(false);
  const [reloadIndex, setReloadIndex] = React.useState(0);
  const [rows, setRows] = React.useState<
    (ClientDatabaseDto & { isNew?: boolean })[]
  >([]);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );
  const [totalCount, setTotalCount] = React.useState(0);

  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: 0,
      pageSize: 10,
    });

  const [idToDelete, setIdToDelete] = React.useState<number | undefined>();

  React.useEffect(() => {
    setLoading(true);
    const startIndex = paginationModel.page * paginationModel.pageSize;
    onRequestData(
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
  }, [sortModel, filterModel, paginationModel, reloadIndex]);

  const NotificationsToolbar = () => (
    <GridToolbarContainer>
      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={() => {
          const clientDatabaseId = 65535;
          setRows((oldRows) => [
            ...oldRows,
            { clientDatabaseId, name: "", isNew: true },
          ]);
          setRowModesModel((oldModel) => ({
            ...oldModel,
            [clientDatabaseId]: {
              mode: GridRowModes.Edit,
              fieldToFocus: "name",
            },
          }));
        }}
      >
        {t("LIST.ADD")}
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );

  const addRow = (data: ClientDatabaseDto) => {
    onAdd(data)
      .then(() => {
        setReloadIndex(reloadIndex + 1);
      })
      .catch((err: Error) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  const columns: GridColDef<ClientDatabaseDto & { isNew?: boolean }>[] =
    React.useMemo(
      () => [
        {
          field: "clientDatabaseId",
          align: "right",
          headerName: t("CLIENTDATABASE.FIELDS.clientDatabaseId") ?? "",
          type: "number",
          width: 80,
          valueGetter: (value, row) => {
            if (row.isNew) return undefined;
            return value;
          },
        },
        {
          field: "actions",
          align: "left",
          headerName: t("CLINIC.FIELDS.actions") ?? "",
          sortable: false,
          filterable: false,
          width: 90,
          type: "actions",
          getActions: (params: GridRowParams) => {
            const isInEditMode =
              rowModesModel[params.id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
              return [
                <GridActionsCellItem
                  key="save"
                  icon={<SaveIcon />}
                  label="Save"
                  sx={{
                    color: "primary.main",
                  }}
                  onClick={() => {
                    setRowModesModel({
                      ...rowModesModel,
                      [params.id]: { mode: GridRowModes.View },
                    });
                  }}
                />,
                <GridActionsCellItem
                  key="cancel"
                  icon={<CancelIcon />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={() => {
                    setRowModesModel({
                      ...rowModesModel,
                      [params.id]: {
                        mode: GridRowModes.View,
                        ignoreModifications: true,
                      },
                    });

                    const editedRow = rows.find(
                      (row) => row.clientDatabaseId === params.id
                    );
                    if (editedRow!.isNew) {
                      setRows(
                        rows.filter((row) => row.clientDatabaseId !== params.id)
                      );
                    }
                  }}
                  color="inherit"
                />,
              ];
            }
            return [
              <GridActionsCellItem
                key="delete"
                icon={<DeleteIcon />}
                label="Удалить"
                color="primary"
                onClick={() => {
                  setIdToDelete(params.row.clientDatabaseId);
                }}
              />,
            ];
          },
        },
        {
          field: "name",
          align: "left",
          headerName: t("CLIENTDATABASE.FIELDS.name") ?? "",
          minWidth: 200,
          flex: 1,
          editable: true,
        },
      ],
      [languageState.language, rowModesModel]
    );

  return (
    <React.Fragment>
      <DeleteDialog
        open={!!idToDelete}
        onClose={() => {
          setIdToDelete(undefined);
        }}
        onDelete={() => {
          onDelete(idToDelete!)
            .then(() => {
              setReloadIndex(reloadIndex + 1);
              setIdToDelete(undefined);
            })
            .catch((err: Error) =>
              enqueueSnackbar(err.message, { variant: "error" })
            );
        }}
      />
      <DataGrid
        loading={loading}
        rows={rows}
        editMode="row"
        rowModesModel={rowModesModel}
        columns={columns}
        getRowId={(row: ClientDatabaseDto & { isNew?: boolean }) =>
          row.clientDatabaseId as number
        }
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
        onRowModesModelChange={(newRowsModel) => setRowModesModel(newRowsModel)}
        onRowEditStop={(params, event) => {
          if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
          }
        }}
        processRowUpdate={(updatedRow, originalRow) => {
          const { isNew, ...data } = updatedRow;
          if (isNew) {
            addRow(data);
          }
          return onUpdate(data.clientDatabaseId, data)
            .then(() => updatedRow)
            .catch(() => originalRow);
        }}
        onProcessRowUpdateError={(error: Error) =>
          enqueueSnackbar(error.message, { variant: "error" })
        }
        slots={{
          toolbar: NotificationsToolbar,
        }}
      />
    </React.Fragment>
  );
};

export default ClientDatabaseList;
