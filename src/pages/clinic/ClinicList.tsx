import React from 'react';
import { useSnackbar } from 'notistack';
import DateFnsAdapter from '@date-io/date-fns';

import { Button, ButtonGroup, Stack } from '@mui/material';

import Widget from '../../components/Widget';

import { useClinicDispatch, useClinicState, actions } from '../../context/ClinicContext';

// Icons
import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutline as DeleteIcon,
  BugReportOutlined as BugReportIcon,
  BadgeOutlined as BadgeIcon,
  PaymentOutlined as PaymentIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

import { ClinicDto } from '../../helpers/dto';
import { useUserState } from '../../context/UserContext';
import { isNetRole } from '../../helpers/enums';
import { useNavigate } from 'react-router-dom';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import { BaseListGrid } from '../../components/BaseListGrid';
import GenericDialog from '../../components/Common/genericDialog';
import ClientDatabaseList from './ClientDatabaseList';

const ClinicList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dateFns = new DateFnsAdapter();
  const {
    currentUser: { role }
  } = useUserState();

  const [showClientDatabase, setShowClientDatabase] = React.useState(false);

  const dispatch = useClinicDispatch();
  const clinicValue = useClinicState();
  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(clinicValue.idToDelete as number)(dispatch)
      .then(() => sendNotification(t('COMMON.RECORDDELETED')));
  };
  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text: string) {
    enqueueSnackbar(text, {
      variant: 'success'
    });
  }

  const columns: GridColDef<ClinicDto>[] = [
    {
      field: 'clinicId',
      align: 'right',
      headerName: t('CLINIC.FIELDS.clinicId') ?? '',
      width: 80,
      type: 'number'
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('CLINIC.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      width: 190,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/clinic/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          key="specialization"
          icon={<BadgeIcon />}
          label="Специальности"
          color="primary"
          onClick={() => navigate(`/clinic/${params.id}/specialization`)}
        />,
        <GridActionsCellItem
          key="plExGrWeb"
          icon={<PaymentIcon />}
          label="Коммерческие группы приема"
          color="primary"
          onClick={() => navigate(`/clinic/${params.id}/plExGrWeb`)}
        />,
        <GridActionsCellItem
          key="check"
          icon={<BugReportIcon />}
          label="Проверить"
          color="primary"
          onClick={() => navigate(`/clinic/${params.id}/check`)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Удалить"
          color="primary"
          disabled={isNetRole(role)}
          onClick={() => openModal(params.id as number)}
        />
      ]
    },
    {
      field: 'code',
      align: 'left',
      headerName: t('CLINIC.FIELDS.code') ?? '',
      width: 200
    },
    {
      field: 'title',
      align: 'left',
      headerName: t('CLINIC.FIELDS.title') ?? '',
      width: 300
    },
    {
      field: 'email',
      align: 'left',
      headerName: t('CLINIC.FIELDS.email') ?? '',
      width: 200
    },
    {
      field: 'isVisible',
      headerName: t('CLINIC.FIELDS.isVisible') ?? '',
      type: 'boolean'
    },
    {
      field: 'cdate',
      align: 'right',
      headerName: t('CLINIC.FIELDS.cdate') ?? '',
      width: 100,
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy') : '')
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={clinicValue.modalOpen} onClose={closeModal} onDelete={handleDelete} />
      <GenericDialog
        isOpen={showClientDatabase}
        title={t('CLIENTDATABASE.TITLE')}
        onClose={() => {
          setShowClientDatabase(false);
        }}
      >
        <ClientDatabaseList
          onRequestData={actions.getClientDatabaseList}
          onAdd={actions.doAddClientDatabase}
          onUpdate={actions.doUpdateClientDatabase}
          onDelete={actions.doDeleteClientDatabase}
        />
      </GenericDialog>

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<ClinicDto>
          columns={columns}
          idField="clinicId"
          state={clinicValue}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          exportName="clinic"
          storagePrefix="clinic"
          defaultSort={[
            {
              field: 'clinicId',
              sort: 'asc'
            }
          ]}
          startActions={
            <Button size="small" color="primary" href="#clinic/add" startIcon={<AddIcon />}>
              {t('LIST.ADD')}
            </Button>
          }
          endActions={
            <Button size="small" color="primary" startIcon={<StorageIcon />} onClick={() => setShowClientDatabase(true)}>
              {t('CLIENTDATABASE.TITLE')}
            </Button>
          }
        />
      </Widget>
    </Stack>
  );
};

export default ClinicList;
