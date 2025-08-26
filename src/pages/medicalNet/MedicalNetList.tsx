import React from 'react';
import DataFnsAdapter from '@date-io/date-fns';
import { useSnackbar } from 'notistack';
import { Grid, Button, Stack } from '@mui/material';
import Widget from '../../components/Widget';

import { useMedicalNetDispatch, useMedicalNetState, actions } from '../../context/MedicalNetContext';

// Icons
import {
  Add as AddIcon,
  DeleteOutlined as DeleteIcon,
  CreateOutlined as CreateIcon,
  Settings as SettingsIcon,
  WorkspacePremiumOutlined as WorkspacePremiumIcon
} from '@mui/icons-material';

import { MedicalNetDto } from '../../helpers/dto';
import { isNetRole } from '../../helpers/enums';
import { useUserState } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import LicenseDialog from './LicenseDialog';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { BaseListGrid } from '../../components/BaseListGrid';

const MedicalNetList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dateFns = new DataFnsAdapter();
  const {
    currentUser: { role }
  } = useUserState();

  const [license, setLicense] = React.useState<{ license: string; medicalNetId: number } | undefined>(undefined);

  const dispatch = useMedicalNetDispatch();
  const medicalNetValue = useMedicalNetState();
  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(medicalNetValue.idToDelete as number)(dispatch)
      .then(() => sendNotification(t('COMMON.RECORDDELETED')));
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text: string) {
    enqueueSnackbar(text, {
      variant: 'success'
    });
  }

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'medicalNetId',
        align: 'right',
        headerName: t('MEDICALNET.FIELDS.medicalNetId') ?? '',
        width: 80,
        type: 'number'
      },
      {
        field: 'actions',
        align: 'left',
        headerName: t('MEDICALNET.FIELDS.actions') ?? '',
        sortable: false,
        filterable: false,
        type: 'actions',
        width: 150,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key="edit"
            icon={<CreateIcon />}
            label="Редактировать"
            color="primary"
            onClick={() => navigate(`/medical_net/${params.id}/edit`)}
          />,
          <GridActionsCellItem
            key="settings"
            icon={<SettingsIcon />}
            label="Настройки"
            color="primary"
            onClick={() => navigate(`/medical_net/${params.id}/settings`)}
          />,
          <GridActionsCellItem
            key="license"
            icon={<WorkspacePremiumIcon />}
            label="Лицензия"
            color="primary"
            disabled={!params.row.isLicenseValid}
            onClick={() =>
              setLicense({
                license: params.row.license,
                medicalNetId: params.row.medicalNetId
              })
            }
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
        headerName: t('MEDICALNET.FIELDS.code') ?? '',
        width: 200
      },
      {
        field: 'title',
        align: 'left',
        headerName: t('MEDICALNET.FIELDS.title') ?? '',
        width: 150
      },
      {
        field: 'appCode',
        align: 'left',
        headerName: t('MEDICALNET.FIELDS.appCode') ?? '',
        width: 250
      },
      {
        field: 'logo',
        align: 'left',
        headerName: t('MEDICALNET.FIELDS.logo') ?? '',
        sortable: false,
        filterable: false,
        disableExport: true,
        width: 80,
        renderCell: (params) => (params.value ? <img alt="logo" src={`data:image/svg+xml;base64, ${btoa(params.value)}`} /> : '')
      },
      {
        field: 'websiteUrl',
        align: 'left',
        headerName: t('MEDICALNET.FIELDS.websiteUrl') ?? '',
        width: 200
      },
      {
        field: 'notifyEmail',
        align: 'left',
        headerName: t('MEDICALNET.FIELDS.notifyEmail') ?? '',
        width: 200
      },
      {
        field: 'notifyPhone',
        align: 'left',
        headerName: t('MEDICALNET.FIELDS.notifyPhone') ?? '',
        width: 150
      },
      {
        field: 'activeDate',
        align: 'right',
        headerName: t('MEDICALNET.FIELDS.activeDate') ?? '',
        width: 120,
        type: 'date',
        valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy') : '')
      }
    ],
    [languageState.language]
  );

  return (
    <Stack spacing={3}>
      <DeleteDialog open={medicalNetValue.modalOpen} onClose={closeModal} onDelete={handleDelete} />
      <LicenseDialog
        isOpen={!!license}
        license={license?.license || ''}
        onClose={() => setLicense(undefined)}
        onRequestData={() => actions.getLicenseData(license?.medicalNetId as number)}
      />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<MedicalNetDto>
          columns={columns}
          idField="medicalNetId"
          storagePrefix="medicalNet"
          exportName="medicalNet"
          state={medicalNetValue}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[
            {
              field: 'medicalNetId',
              sort: 'asc'
            }
          ]}
          startActions={
            !isNetRole(role) ? (
              <Button size="small" color="primary" href="#medical_net/add" startIcon={<AddIcon />}>
                {t('LIST.ADD')}
              </Button>
            ) : undefined
          }
        />
      </Widget>
    </Stack>
  );
};

export default MedicalNetList;
