import React from 'react';
import { useSnackbar } from 'notistack';

import { Button, Stack } from '@mui/material';
import Widget from '../../components/Widget';

import { useMedicalBrandDispatch, useMedicalBrandState, actions } from '../../context/MedicalBrandContext';

// Icons
import { Add as AddIcon, CreateOutlined as CreateIcon, DeleteOutlined as DeleteIcon } from '@mui/icons-material';

import { MedicalBrandDto } from '../../helpers/dto';
import { useNavigate } from 'react-router-dom';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import { BaseListGrid } from '../../components/BaseListGrid';

const MedicalBrandList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useMedicalBrandDispatch();
  const medicalBrandValue = useMedicalBrandState();

  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(medicalBrandValue.idToDelete as number)(dispatch)
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
      field: 'medicalBrandId',
      align: 'left',
      headerName: t('MEDICALBRAND.FIELDS.medicalBrandId') ?? '',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('MEDICALBRAND.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/medical_brand/${params.id}/edit`)}
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
      field: 'logo',
      align: 'left',
      headerName: t('MEDICALBRAND.FIELDS.logo') ?? '',
      sortable: false,
      filterable: false,
      disableExport: true,
      width: 280,
      renderCell: (params) =>
        params.value ? <img src={`data:image/jpeg;base64, ${params.value}`} alt="Alt" style={{ maxWidth: '260px' }} /> : ''
    },
    {
      field: 'title',
      align: 'left',
      headerName: t('MEDICALBRAND.FIELDS.title') ?? '',
      width: 300
    },
    {
      field: 'email',
      align: 'left',
      headerName: t('MEDICALBRAND.FIELDS.email') ?? '',
      width: 200
    },
    {
      field: 'phone',
      align: 'left',
      headerName: t('MEDICALBRAND.FIELDS.phone') ?? '',
      width: 150
    },
    {
      field: 'code',
      align: 'left',
      headerName: t('MEDICALBRAND.FIELDS.code') ?? '',
      width: 200
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={medicalBrandValue.modalOpen} onClose={closeModal} onDelete={handleDelete} />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<MedicalBrandDto>
          columns={columns}
          idField="medicalBrandId"
          exportName="medicalBrand"
          storagePrefix="medicalBrand"
          state={medicalBrandValue}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[
            {
              field: 'medicalBrandId',
              sort: 'asc'
            }
          ]}
          startActions={
            <Button color="primary" size="small" href="#medical_brand/add" startIcon={<AddIcon />}>
              {t('LIST.ADD')}
            </Button>
          }
        />
      </Widget>
    </Stack>
  );
};

export default MedicalBrandList;
