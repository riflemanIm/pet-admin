import React from 'react';
import DateFnsAdapter from '@date-io/date-fns';

import { Box, Typography, FormControl, InputLabel, MenuItem, CircularProgress, IconButton, Select, Stack } from '@mui/material';

import { RefreshOutlined, Info as InfoIcon } from '@mui/icons-material';

import Widget from '../../components/Widget';
import { useAuditDispatch, useAuditState, actions } from '../../context/AuditContext';

import { AuditConditionDto, AuditItemDto } from '../../helpers/dto';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowParams,
  GridSortModel,
  GridToolbar
} from '@mui/x-data-grid';
import { getGridLocaleText } from '../../helpers/grid';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import MuiUIPicker from '../../components/MUIDateTimePicker';
import { isNetRole } from '../../helpers/enums';
import { useUserState } from '../../context/UserContext';
import { Locales } from '../../helpers/dateFormat';
import DescriptionDialog from './DescriptionDialog';

const EventTypes = [
  'Login',
  'Logout',
  'RefreshToken',
  'RegisterInit',
  'RegisterConfirm',
  'EmailConfirm',
  'PhoneConfirm',
  'DeleteSession',
  'ProfileChange'
];

const ServiceNames = ['telemedialogCentral', 'telemedialogAdmin'];

const AuditList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DateFnsAdapter({
    locale: Locales[languageState.language]
  });
  const {
    currentUser: { role }
  } = useUserState();
  const [condition, setCondition] = React.useState<AuditConditionDto>({
    dateFrom: dateFns.startOfDay(new Date()),
    dateTo: dateFns.endOfDay(new Date())
  });
  const [description, setDescription] = React.useState<AuditItemDto | undefined>(undefined);
  const [sortModel, setSortModel] = useLocalStorage<GridSortModel>('audit:sort', []);
  const [paginationModel, setPaginationModel] = useLocalStorage<GridPaginationModel>('audit:paginationModel', {
    page: 0,
    pageSize: 10
  });
  const [rows, setRows] = React.useState<AuditItemDto[]>([]);

  const [refreshIndex, setRefreshIndex] = React.useState(0);

  const dispatch = useAuditDispatch();
  const state = useAuditState();

  React.useEffect(() => {
    actions.doReferenceLists()(dispatch);
  }, []);

  React.useEffect(() => {
    const startIndex = paginationModel.page * paginationModel.pageSize;
    actions.doFetch(
      condition.dateFrom,
      condition.dateTo,
      condition.medicalNetId,
      condition.eventType,
      condition.serviceName,
      condition.success,
      startIndex,
      paginationModel.pageSize,
      sortModel[0]?.field,
      sortModel[0]?.sort
    )(dispatch);
  }, [paginationModel, sortModel, condition, refreshIndex]);

  React.useEffect(() => {
    setRows(state.rows);
  }, [state.rows]);

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      align: 'left',
      headerName: t('AUDIT.FIELDS.timestamp') ?? '',
      width: 180,
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy HH:mm:ss') : '')
    },
    {
      field: 'eventType',
      align: 'left',
      sortable: false,
      headerName: t('AUDIT.FIELDS.eventType') ?? '',
      width: 100
    },
    {
      field: 'view',
      align: 'left',
      sortable: false,
      filterable: false,
      type: 'actions',
      width: 30,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem key="edit" icon={<InfoIcon />} label="Информация" color="default" onClick={() => setDescription(params.row)} />
      ]
    },
    {
      field: 'userId',
      align: 'left',
      headerName: t('AUDIT.FIELDS.user') ?? '',
      width: 200,
      valueGetter: (value, row) => {
        const userId = row.userId || '-';
        if (row.props?.user?.name) {
          return `${userId} (${row.props.user.name})`;
        }
        return `${userId}`;
      }
    },
    {
      field: 'message',
      align: 'left',
      sortable: false,
      headerName: t('AUDIT.FIELDS.message') ?? '',
      minWidth: 200,
      flex: 1
    },
    {
      field: 'workspaceId',
      align: 'left',
      headerName: t('AUDIT.FIELDS.workspaceId') ?? '',
      width: 60
    },
    {
      field: 'sessionId',
      align: 'left',
      sortable: false,
      headerName: t('AUDIT.FIELDS.sessionId') ?? '',
      width: 320
    },
    {
      field: 'origin',
      align: 'left',
      sortable: false,
      headerName: t('AUDIT.FIELDS.origin') ?? '',
      valueGetter: (value, row) => {
        if (!row.origin) return '';
        return `${row.origin.type} ${row.origin.address}`;
      },
      width: 150
    }
  ];

  return (
    <Stack spacing={3}>
      <Widget inheritHeight>
        <Box justifyContent={'flex-start'} display="flex" alignItems={'center'}>
          <Typography>{t('REPORT.PERIOD')}:</Typography>
          <MuiUIPicker
            value={condition.dateFrom}
            disabled={state.loading}
            handleChange={(dateFrom) =>
              setCondition({
                ...(condition || {}),
                dateFrom: dateFrom ? new Date(dateFrom) : new Date()
              })
            }
            fullWidth={false}
            variant="standard"
            mx={true}
          />

          <MuiUIPicker
            value={condition.dateTo}
            disabled={state.loading}
            handleChange={(dateTo) =>
              setCondition({
                ...(condition || {}),
                dateTo: dateTo ? new Date(dateTo) : new Date()
              })
            }
            fullWidth={false}
            variant="standard"
            mx={true}
          />

          {!isNetRole(role) && (
            <FormControl variant="standard" size="small" style={{ marginLeft: 8, width: 300 }}>
              <InputLabel id="id-medical_net-label">{t('REPORT.MEDICALNET')}</InputLabel>
              <Select
                name="medicalNetId"
                id="id-medical_net-select"
                labelId="id-medical_net-label"
                label={t('REPORT.MEDICALNET')}
                disabled={state.loading}
                onChange={(event) =>
                  setCondition({
                    ...(condition || {}),
                    medicalNetId: event.target.value ? (event.target.value as number) : undefined
                  })
                }
                value={condition.medicalNetId || ''}
              >
                <MenuItem value="">
                  <em>Нет</em>
                </MenuItem>
                {state.medicalNets.map((item) => (
                  <MenuItem value={item.medicalNetId} key={item.medicalNetId}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl variant="standard" size="small" style={{ marginLeft: 8, width: 300 }}>
            <InputLabel id="id-event_type-label">{t('AUDIT.FIELDS.eventType')}</InputLabel>
            <Select
              name="eventType"
              id="id-event_type-select"
              labelId="id-event_type-label"
              label={t('AUDIT.FIELDS.eventType')}
              disabled={state.loading}
              onChange={(event) =>
                setCondition({
                  ...(condition || {}),
                  eventType: event.target.value ? (event.target.value as string) : undefined
                })
              }
              value={condition.eventType || ''}
            >
              <MenuItem value="">
                <em>Нет</em>
              </MenuItem>
              {EventTypes.map((item) => (
                <MenuItem value={item} key={item}>
                  {t(`AUDIT.EVENT_TYPES.${item}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" size="small" style={{ marginLeft: 8, width: 300 }}>
            <InputLabel id="id-service_name-label">{t('AUDIT.FIELDS.serviceName')}</InputLabel>
            <Select
              name="serviceName"
              id="id-service_name-select"
              labelId="id-service_name-label"
              label={t('AUDIT.FIELDS.serviceName')}
              disabled={state.loading}
              onChange={(event) =>
                setCondition({
                  ...(condition || {}),
                  serviceName: event.target.value ? (event.target.value as string) : undefined
                })
              }
              value={condition.serviceName || ''}
            >
              <MenuItem value="">
                <em>Нет</em>
              </MenuItem>
              {ServiceNames.map((item) => (
                <MenuItem value={item} key={item}>
                  {t(`AUDIT.SERVICE_NAMES.${item}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="standard" size="small" style={{ marginLeft: 8, width: 300 }}>
            <InputLabel id="id-success-label">{t('AUDIT.FIELDS.success')}</InputLabel>
            <Select
              name="eventType"
              id="id-success-select"
              labelId="id-success-label"
              label={t('AUDIT.FIELDS.success')}
              disabled={state.loading}
              onChange={(event) =>
                setCondition({
                  ...(condition || {}),
                  success: event.target.value ? event.target.value === 'true' : undefined
                })
              }
              value={condition.success ?? ''}
            >
              <MenuItem value="">
                <em>Нет</em>
              </MenuItem>
              <MenuItem value="true">
                <em>Успех</em>
              </MenuItem>
              <MenuItem value="false">
                <em>Не успех</em>
              </MenuItem>
            </Select>
          </FormControl>
          {state.loading ? (
            <CircularProgress sx={{ marginLeft: 1, padding: 1 }} />
          ) : (
            <IconButton
              onClick={() => {
                setRefreshIndex(refreshIndex + 1);
              }}
              color="primary"
            >
              <RefreshOutlined />
            </IconButton>
          )}
        </Box>
      </Widget>
      <Widget inheritHeight noBodyPadding>
        <DescriptionDialog
          isOpen={!!description}
          text={description ? JSON.stringify(description, null, 2) : undefined}
          onClose={() => setDescription(undefined)}
        />
        <DataGrid
          loading={state.loading}
          autoHeight
          rows={rows}
          columns={columns}
          getRowId={(row: AuditItemDto) => row.id as string}
          rowCount={state.totalCount}
          getRowHeight={() => 'auto'}
          paginationMode="server"
          pageSizeOptions={[5, 10, 25, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={(newPaginationModel) => setPaginationModel(newPaginationModel)}
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
          disableColumnFilter={true}
          localeText={getGridLocaleText(languageState.language)}
          slots={{
            toolbar: GridToolbar
          }}
          slotProps={{
            toolbar: {
              csvOptions: {
                fileName: 'audit',
                delimiter: ';',
                utf8WithBom: true
              }
            }
          }}
        />
      </Widget>
    </Stack>
  );
};

export default AuditList;
