import React from 'react';
import { useSnackbar } from 'notistack';
import DateFnsAdapter from '@date-io/date-fns';

import { Button, Stack } from '@mui/material';
import Widget from '../../components/Widget';

import { useServiceDispatch, useServiceState, actions } from '../../context/ServiceContext';

// Icons
import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
  BugReportOutlined as BugReporOutlinedtIcon,
  AnalyticsOutlined as AnalyticsOutlinedIcon
} from '@mui/icons-material';
import { ClientComponentStatus, ClientServiceDto } from '../../helpers/dto';
import ComponentStatus from './ComponentStatus';
import { useNavigate } from 'react-router-dom';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import { BaseListGrid } from '../../components/BaseListGrid';

const ServiceList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dateFns = new DateFnsAdapter();

  const dispatch = useServiceDispatch();
  const serviceValue = useServiceState();

  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(serviceValue.idToDelete as number)(dispatch)
      .then(() => sendNotification(t('COMMON.RECORDDELETED')));
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text: string) {
    enqueueSnackbar(text, {
      variant: 'success'
    });
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      align: 'right',
      headerName: t('SERVICE.FIELDS.id') ?? '',
      width: 80,
      type: 'number'
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('SERVICE.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      width: 180,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/service/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          key="check"
          icon={<BugReporOutlinedtIcon />}
          label="Проверить"
          color="primary"
          onClick={() => navigate(`/service/${params.id}/check`)}
        />,
        <GridActionsCellItem
          key="metrics"
          icon={<AnalyticsOutlinedIcon />}
          label="Метрики"
          color="primary"
          onClick={() => navigate(`/service/${params.id}/metrics`)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Удалить"
          color="primary"
          onClick={() => openModal(params.id as number)}
        />
      ]
    },
    {
      field: 'label',
      align: 'left',
      headerName: t('SERVICE.FIELDS.label') ?? '',
      width: 270
    },
    {
      field: 'state',
      align: 'left',
      headerName: t('SERVICE.FIELDS.state') ?? ''
    },
    {
      field: 'address',
      align: 'left',
      headerName: t('SERVICE.FIELDS.address') ?? '',
      width: 400
    },
    {
      field: 'versionDate',
      align: 'right',
      headerName: t('SERVICE.FIELDS.versionDate') ?? '',
      width: 150,
      type: 'dateTime',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy hh:mm') : '')
    },
    {
      field: 'componentStatus',
      align: 'center',
      headerName: t('SERVICE.FIELDS.componentStatus') ?? '',
      minWidth: 200,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (params.value ? <ComponentStatus status={params.value as ClientComponentStatus[]} /> : '')
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={serviceValue.modalOpen} onClose={closeModal} onDelete={handleDelete} />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<ClientServiceDto>
          columns={columns}
          idField="id"
          exportName="service"
          storagePrefix="service"
          state={serviceValue}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[
            {
              field: 'id',
              sort: 'asc'
            }
          ]}
          startActions={
            <Button size="small" color="primary" href="#service/add" startIcon={<AddIcon />}>
              {t('LIST.ADD')}
            </Button>
          }
        />
      </Widget>
    </Stack>
  );
};

export default ServiceList;
