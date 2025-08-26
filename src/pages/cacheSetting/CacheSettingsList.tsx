import React from 'react';
import { useSnackbar } from 'notistack';

import Widget from '../../components/Widget';

import { CacheSettingDto } from '../../helpers/dto';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
// Icons
import { KeyOutlined as KeyIcon, DeleteOutline as DeleteIcon } from '@mui/icons-material';
import { getGridLocaleText } from '../../helpers/grid';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { CacheSettingsContext, actions } from '../../context/CacheSettingsContext';
import CacheDetailsDialog from './CacheDetailsDialog';
import { DeleteDialog } from '../../components/Common/deleteDialog';

const CacheSettingsList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const [rows, setRows] = React.useState<CacheSettingDto[]>([]);
  const [details, setDetails] = React.useState<{
    isOpen: boolean;
    code: string;
  }>({
    isOpen: false,
    code: ''
  });
  const [deleteState, setDeleteState] = React.useState<{
    isOpen: boolean;
    code: string;
  }>({
    isOpen: false,
    code: ''
  });
  const { state, dispatch } = React.useContext(CacheSettingsContext);

  React.useEffect(() => {
    actions.doFetch()(dispatch);
  }, [dispatch]);

  React.useEffect(() => {
    setRows(state.rows as CacheSettingDto[]);
  }, [state.rows]);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (state.errorMessage) enqueueSnackbar(state.errorMessage, { variant: 'error' });
  }, [state.errorMessage]);

  const processRowUpdate = React.useCallback(async (newRow: CacheSettingDto, oldRow: CacheSettingDto) => {
    if (
      newRow.driver === oldRow.driver &&
      newRow.ttl === oldRow.ttl &&
      newRow.memoryTTL === oldRow.memoryTTL &&
      newRow.hotSwap === oldRow.hotSwap
    )
      return oldRow;
    const success = await actions.doUpdate(newRow.cacheSettingsId, newRow)(dispatch);
    if (success) enqueueSnackbar(t('COMMON.RECORDSAVED'), { variant: 'success' });
    return success ? newRow : oldRow;
  }, []);

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    enqueueSnackbar(error.message, { variant: 'error' });
  }, []);

  const closeDetailsDialog = React.useCallback(() => {
    setDetails({
      isOpen: false,
      code: ''
    });
  }, [details]);

  const closeDeleteDialog = React.useCallback(() => {
    setDeleteState({
      isOpen: false,
      code: ''
    });
  }, [deleteState]);

  const handleDelete = React.useCallback(() => {
    actions
      .del(deleteState.code)
      .then((count: number) => {
        setDeleteState({
          isOpen: false,
          code: ''
        });
        enqueueSnackbar(t('CACHESETTINGS.DELETED').replace('{count}', String(count)), { variant: 'success' });
      })
      .catch((error: Error) => {
        setDeleteState({
          isOpen: false,
          code: ''
        });
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }, [deleteState.code]);

  const columns: GridColDef<CacheSettingDto>[] = React.useMemo(() => {
    const uniqueGroups = new Set(rows.map((item) => item.groupName));
    return [
      {
        field: 'actions',
        align: 'left',
        headerName: t('SETTING.FIELDS.actions') ?? '',
        sortable: false,
        filterable: false,
        // width: 180,
        type: 'actions',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key="keys"
            icon={<KeyIcon />}
            label="Ключи"
            color="primary"
            disabled={params.row.driver !== 'redis'}
            onClick={() =>
              setDetails({
                isOpen: true,
                code: params.row.code
              })
            }
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Удалить"
            color="primary"
            disabled={params.row.driver !== 'redis'}
            onClick={() =>
              setDeleteState({
                isOpen: true,
                code: params.row.code
              })
            }
          />
        ]
      },
      {
        field: 'groupName',
        align: 'left',
        headerName: t('SETTING.FIELDS.groupName') ?? '',
        width: 150,
        type: 'singleSelect',
        valueOptions: [...uniqueGroups]
      },
      {
        field: 'code',
        align: 'left',
        headerName: t('SETTING.FIELDS.code') ?? '',
        width: 200
      },
      {
        field: 'driver',
        align: 'left',
        type: 'singleSelect',
        valueOptions: ['memory', 'redis', 'disabled'],
        headerName: 'driver',
        editable: true,
        width: 120
      },
      {
        field: 'ttl',
        align: 'right',
        type: 'number',
        headerName: 'ttl',
        editable: true,
        width: 120
      },
      {
        field: 'memoryTTL',
        align: 'right',
        type: 'number',
        headerName: t('CACHESETTINGS.FIELDS.memoryTTL') ?? '',
        editable: true,
        width: 120
      },
      {
        field: 'hotSwap',
        type: 'boolean',
        headerName: t('CACHESETTINGS.FIELDS.hotSwap') ?? '',
        editable: true,
        width: 120
      },
      {
        field: 'name',
        align: 'left',
        headerName: t('SETTING.FIELDS.name') ?? '',
        minWidth: 200,
        flex: 1
      }
    ];
  }, [languageState.language, rows]);

  return (
    <Widget inheritHeight noBodyPadding>
      <DeleteDialog
        open={deleteState.isOpen}
        deleteText={t('CACHESETTINGS.DELETECONFIRM')}
        onClose={closeDeleteDialog}
        onDelete={handleDelete}
      />
      <CacheDetailsDialog
        isOpen={details.isOpen}
        code={details.code}
        onClose={closeDetailsDialog}
        onRequestKeys={actions.getKeys}
        onRequestValue={actions.getValue}
        onDeleteKey={actions.delKey}
      />
      <DataGrid
        loading={state.loading}
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(row: CacheSettingDto) => row.cacheSettingsId}
        getRowHeight={() => 'auto'}
        localeText={getGridLocaleText(languageState.language)}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        hideFooter
      />
    </Widget>
  );
};

export default CacheSettingsList;
