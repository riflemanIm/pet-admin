import React from 'react';
import { useSnackbar } from 'notistack';
import DateFnsAdapter from '@date-io/date-fns';

import { Button, Stack } from '@mui/material';

import {
  Add as AddIcon,
  ContentCopy as ContentCopyIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon
} from '@mui/icons-material';

import Widget from '../../components/Widget';
import { usePromoDispatch, usePromoState, actions } from '../../context/PromoContext';

import { MedicalNetActionDto } from '../../helpers/dto';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { PromoActionType, listEnums, getEnumName } from '../../helpers/enums';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import SuggestionsButton from './Suggestions';
import { BaseListGrid } from '../../components/BaseListGrid';
import { copyToClipboard } from '../../helpers/clipboard';

const PromoList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dateFns = new DateFnsAdapter();

  const dispatch = usePromoDispatch();
  const promoValue = usePromoState();
  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(promoValue.idToDelete as number)(dispatch)
      .then(() => sendNotification(t('COMMON.RECORDDELETED')));
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text: string) {
    enqueueSnackbar(text, {
      variant: 'success'
    });
  }

  const columns: GridColDef<MedicalNetActionDto>[] = [
    {
      field: 'medicalnetActionsId',
      align: 'right',
      headerName: t('PROMOACTION.FIELDS.medicalnetActionsId') ?? '',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('PROMOACTION.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      width: 120,
      type: 'actions',
      getActions: (params: GridRowParams<MedicalNetActionDto>) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/promo/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Удалить"
          color="primary"
          onClick={() => openModal(params.id as number)}
        />,
        <GridActionsCellItem
          key="copy"
          icon={<ContentCopyIcon />}
          label="Скопировать"
          color="primary"
          onClick={() => {
            copyToClipboard(`[${params.row.description}](#promo/${params.id})`).then(() => {
              sendNotification(t('COMMON.RECORDCOPIED'));
            });
          }}
        />
      ]
    },
    {
      field: 'actionType',
      align: 'left',
      headerName: t('PROMOACTION.FIELDS.actionType') ?? '',
      width: 100,
      type: 'singleSelect',
      valueOptions: listEnums(PromoActionType, t, 'ENUMS.PromoActionType') ?? '',
      valueFormatter: (value: string) => getEnumName(PromoActionType, value, t, 'ENUMS.PromoActionType') ?? ''
    },
    {
      field: 'description',
      align: 'left',
      headerName: t('PROMOACTION.FIELDS.description') ?? '',
      width: 200,
      renderCell: (params) => (params.value?.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)
    },
    {
      field: 'actionText',
      align: 'left',
      headerName: t('PROMOACTION.FIELDS.actionText') ?? '',
      width: 300,
      renderCell: (params) => (params.value?.length > 100 ? `${params.value.slice(0, 100)}...` : params.value)
    },
    {
      field: 'url',
      align: 'left',
      headerName: t('PROMOACTION.FIELDS.url') ?? '',
      width: 300
    },
    {
      field: 'dateFrom',
      align: 'left',
      headerName: t('PROMOACTION.FIELDS.dateFrom') ?? '',
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy') : '')
    },
    {
      field: 'dateTo',
      align: 'left',
      headerName: t('PROMOACTION.FIELDS.dateTo') ?? '',
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy') : '')
    },
    {
      field: 'sortOrder',
      align: 'right',
      headerName: t('PROMOACTION.FIELDS.sortOrder') ?? '',
      type: 'number'
    },
    {
      field: 'image',
      align: 'left',
      headerName: t('PROMOACTION.FIELDS.image') ?? '',
      sortable: false,
      filterable: false,
      disableExport: true,
      minWidth: 200,
      flex: 1,
      renderCell: (params) => <img src={`data:image/jpeg;base64, ${params.value}`} alt="Alt" style={{ maxWidth: '260px' }} />
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={promoValue.modalOpen} onClose={closeModal} onDelete={handleDelete} />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<MedicalNetActionDto>
          columns={columns}
          idField="medicalnetActionsId"
          exportName="promo"
          storagePrefix="promo"
          state={promoValue}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[
            {
              field: 'sortOrder',
              sort: 'asc'
            }
          ]}
          startActions={
            <Button size="small" color="primary" href="#promo/add" startIcon={<AddIcon />}>
              {t('LIST.ADD')}
            </Button>
          }
          endActions={<SuggestionsButton size="small" />}
        />
      </Widget>
    </Stack>
  );
};

export default PromoList;
