import React from 'react';
import { useSnackbar } from 'notistack';
import DateFnsAdapter from '@date-io/date-fns';

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  Theme,
  Stack
} from '@mui/material';

import Widget from '../../components/Widget';
import { useTranslationDispatch, useTranslationState, actions, TranslationFilter } from '../../context/TranslationContext';
import { useUserState } from '../../context/UserContext';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import { DeleteOutlined as DeleteIcon, DoneAll as DoneAllIcon, CreateOutlined as CreateIcon } from '@mui/icons-material';

import AdminActions from './TranslationAdminActions';
import AdminActionsMenu from './TranslationAdminActionsMenu';
import InterActions from './TranslationInterActions';
import InterActionsMenu from './TranslationInterActionsMenu';
import TranslationFilters from './TranslationFilters';
import capitalizeFirst from '../../helpers/capitalize';
import { AccountRole } from '../../helpers/enums';
import { TranslationCheckIndex, TranslationsDto } from '../../helpers/dto';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridRowParams,
  GridRowSelectionModel,
  GridSortModel,
  GridToolbar
} from '@mui/x-data-grid';
import { getGridLocaleText } from '../../helpers/grid';
import { useLanguageValue } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const filterValsToModel = (filterVals: TranslationFilter): GridFilterModel => {
  const result: GridFilterModel = {
    items: []
  };
  if (filterVals.pname) {
    result.items.push({
      field: 'pname',
      operator: 'equals',
      value: filterVals.pname
    });
  }
  if (filterVals.gkey) {
    result.items.push({
      field: 'gkey',
      operator: 'equals',
      value: filterVals.gkey
    });
  }
  if (filterVals.checked === 'checked_all' || filterVals.checked === 'not_checked_all') {
    const isChecked = filterVals.checked === 'checked_all';
    result.items.push(
      {
        field: 'checkedEn',
        operator: 'is',
        value: isChecked
      },
      {
        field: 'checkedRu',
        operator: 'is',
        value: isChecked
      },
      {
        field: 'checkedFr',
        operator: 'is',
        value: isChecked
      }
    );
  }
  if (['ru', 'en', 'fr'].includes(filterVals.checked as string)) {
    const lang = filterVals.checked as string;
    const field = `checked${capitalizeFirst(lang)}`;
    result.items.push({
      field,
      operator: 'is',
      value: false
    });
  }
  return result;
};

const TranslationList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dateFns = new DateFnsAdapter();
  const {
    currentUser: { role }
  } = useUserState();

  const [sortModel, setSortModel] = useLocalStorage<GridSortModel>('translation:sort', [
    {
      field: 'pname',
      sort: 'asc'
    }
  ]);

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: []
  });
  const [externalFilters, setExternalFilters] = React.useState<GridFilterModel>({
    items: []
  });
  const [paginationModel, setPaginationModel] = useLocalStorage<GridPaginationModel>('translation:paginationModel', {
    page: 0,
    pageSize: 10
  });
  const [selectionModel, setSelectionModel] = React.useState<GridRowSelectionModel>([]);
  const translationDispatch = useTranslationDispatch();

  const fetchAll = React.useCallback(() => {
    const startIndex = paginationModel.page * paginationModel.pageSize;
    actions.doFetch(
      startIndex,
      paginationModel.pageSize,
      JSON.stringify({
        items: [...filterModel.items, ...externalFilters.items]
      }),
      sortModel[0]?.field,
      sortModel[0]?.sort
    )(translationDispatch);
  }, [paginationModel, filterModel, sortModel, externalFilters]);

  React.useEffect(() => {
    const startIndex = paginationModel.page * paginationModel.pageSize;
    actions.doFetch(
      startIndex,
      paginationModel.pageSize,
      JSON.stringify({
        items: [...filterModel.items, ...externalFilters.items]
      }),
      sortModel[0]?.field,
      sortModel[0]?.sort
    )(translationDispatch);
  }, [paginationModel, filterModel, externalFilters, sortModel]);

  const { rows, idToDelete, modalOpen, modalOpenCheched, checked, filterVals, loading, totalCount } = useTranslationState();

  React.useEffect(() => {
    setExternalFilters(filterValsToModel(filterVals));
  }, [filterVals.pname, filterVals.gkey, filterVals.checked]);

  const openModalConfirm = (id: number) => {
    actions.doOpenConfirm(id)(translationDispatch);
  };

  const closeModalConfirm = () => {
    actions.doCloseConfirm()(translationDispatch);
  };

  const closeModalCheched = () => {
    translationDispatch({
      type: 'TRANSLATIONS_CHECKED_CLOSE'
    });
  };

  const openModalCheched = () => {
    translationDispatch({
      type: 'TRANSLATIONS_CHECKED_OPEN'
    });
  };

  const handleDelete = () => {
    actions
      .doDelete(idToDelete as number)(translationDispatch)
      .then(() => {
        sendNotification(t('COMMON.RECORDDELETED'));
      });
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text: string) {
    enqueueSnackbar(text, {
      variant: 'success'
    });
  }

  const needCheck = (row: TranslationsDto, lang: string) => {
    const { langRu, langEn, langFr, checkedRu, checkedEn, checkedFr } = row;
    let val = '';
    let checked = null;
    if (lang === 'ru') {
      val = langRu;
      checked = checkedRu;
    }
    if (lang === 'en') {
      val = langEn;
      checked = checkedEn;
    }
    if (lang === 'fr') {
      val = langFr;
      checked = checkedFr;
    }

    return (
      <Typography variant="body2" color={!checked ? 'primary' : undefined} component="div">
        {val}
      </Typography>
    );
  };

  const handleChecked = (lang: string) => {
    const newChecked = {} as Record<TranslationCheckIndex, boolean>;

    newChecked[`checked${capitalizeFirst(lang)}` as TranslationCheckIndex] =
      !checked[`checked${capitalizeFirst(lang)}` as TranslationCheckIndex];
    translationDispatch({
      type: 'TRANSLATIONS_SELECTED_CHECKED',
      payload: { ...checked, ...newChecked }
    });
  };

  const saveChecked = () => {
    if (selectionModel.length === 0) sendNotification('No rows selected');
    else {
      actions.doUpdateChecked(selectionModel as number[], {
        ...checked
      })(translationDispatch, sendNotification, fetchAll);
    }
  };

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const getActions = React.useCallback(
    (params: GridRowParams) => {
      if (role === AccountRole.admin) {
        return [
          <GridActionsCellItem
            key="edit"
            icon={<CreateIcon />}
            label="Edit"
            color="primary"
            onClick={() => navigate(`/translation/${params.id}/edit`)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Issue support token"
            color="primary"
            onClick={() => openModalConfirm(params.id as number)}
          />
        ];
      }
      if (role === AccountRole.interpreter) {
        return [
          <GridActionsCellItem
            key="edit"
            icon={<CreateIcon />}
            label="Edit"
            color="primary"
            onClick={() => navigate(`/translation/${params.id}/edit`)}
          />
        ];
      }
      return [];
    },
    [role]
  );

  const columns: GridColDef[] = [
    {
      field: 'id',
      align: 'left',
      headerName: 'ID',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => getActions(params)
    }
  ];
  if (role === AccountRole.admin) {
    columns.push(
      {
        field: 'gkey',
        align: 'left',
        headerName: 'Group',
        width: 120
      },
      {
        field: 'tkey',
        align: 'left',
        headerName: 'Key',
        width: 200
      }
    );
  }
  columns.push(
    {
      field: 'langRu',
      align: 'left',
      headerName: 'Russian',
      renderCell: (params) => needCheck(params.row, 'ru'),
      flex: 1
    },
    {
      field: 'langEn',
      align: 'left',
      headerName: 'English',
      renderCell: (params) => needCheck(params.row, 'en'),
      flex: 1
    },
    {
      field: 'langFr',
      align: 'left',
      headerName: 'Franch',
      renderCell: (params) => needCheck(params.row, 'fr'),
      flex: 1
    },
    {
      field: 'created_at',
      align: 'left',
      headerName: 'Created',
      width: 120,
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy') : '')
    },
    {
      field: 'updated_at',
      align: 'left',
      headerName: 'Changed',
      width: 120,
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy') : '')
    },
    {
      field: 'email',
      align: 'left',
      headerName: 'By'
    }
  );

  return (
    <React.Fragment>
      <Stack spacing={3}>
        <Widget inheritHeight>
          <Stack spacing={2} direction="row" alignContent="center">
            {/* actions for interpreter  */}

            {role === AccountRole.interpreter && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (selectionModel.length == 0) {
                    sendNotification('No rows selected');
                  } else {
                    openModalCheched();
                  }
                }}
                style={{ marginTop: 8 }}
                startIcon={<DoneAllIcon />}
              >
                Mark verified
              </Button>
            )}

            {/* actions for admin  */}

            {role === AccountRole.admin ? (
              isMobile ? (
                <AdminActionsMenu pname={filterVals.pname} />
              ) : (
                <AdminActions pname={filterVals.pname} />
              )
            ) : isMobile ? (
              <InterActionsMenu pname={filterVals.pname} />
            ) : (
              <InterActions pname={filterVals.pname} />
            )}
            <TranslationFilters />
          </Stack>
        </Widget>

        <Widget inheritHeight noBodyPadding>
          <DataGrid
            loading={loading}
            autoHeight
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            rowCount={totalCount}
            paginationMode="server"
            pageSizeOptions={[5, 10, 25, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
            sortModel={sortModel}
            onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
            filterModel={filterModel}
            filterMode="server"
            onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
            checkboxSelection={true}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            rowSelectionModel={selectionModel}
            localeText={getGridLocaleText(languageState.language)}
            slots={{
              toolbar: GridToolbar
            }}
            slotProps={{
              toolbar: {
                csvOptions: {
                  fileName: 'translations',
                  delimiter: ';',
                  utf8WithBom: true
                }
              }
            }}
          />
        </Widget>
      </Stack>
      <DeleteDialog open={modalOpen} onClose={closeModalConfirm} onDelete={handleDelete} />
      <Dialog open={modalOpenCheched} onClose={closeModalCheched} scroll={'body'} aria-labelledby="scroll-dialog-title">
        <DialogTitle id="alert-dialog-title">Select language(s) and confirm</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" flexDirection="row">
            <Box display="flex" flexDirection="column" width={600}>
              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={<Switch checked={checked.checkedRu} onChange={() => handleChecked('ru')} value={true} color="primary" />}
                label={
                  <Typography variant="h6" color="textSecondary">
                    Russian
                  </Typography>
                }
              />

              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={<Switch checked={checked.checkedEn} onChange={() => handleChecked('en')} value={true} color="primary" />}
                label={
                  <Typography variant="h6" color="textSecondary">
                    English
                  </Typography>
                }
              />

              <FormControlLabel
                style={{ marginBottom: 35 }}
                control={<Switch checked={checked.checkedFr} onChange={() => handleChecked('fr')} value={true} color="primary" />}
                label={
                  <Typography variant="h6" color="textSecondary">
                    Franch
                  </Typography>
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeModalCheched}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveChecked} autoFocus>
            Save selected
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default TranslationList;
