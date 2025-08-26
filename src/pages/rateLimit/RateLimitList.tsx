import React from 'react';
import { useSnackbar } from 'notistack';

import { Button, Stack } from '@mui/material';

import { Add as AddIcon, CreateOutlined as CreateIcon, DeleteOutlined as DeleteIcon } from '@mui/icons-material';

import Widget from '../../components/Widget';
import { useRateLimitDispatch, useRateLimitState, actions } from '../../context/RateLimitContext';

import { RateLimitDto } from '../../helpers/dto';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import { BaseListGrid } from '../../components/BaseListGrid';

const RateLimitList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useRateLimitDispatch();
  const state = useRateLimitState();
  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(state.idToDelete as number)(dispatch)
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

  const columns: GridColDef[] = [
    {
      field: 'rateLimitSettingsId',
      align: 'right',
      headerName: t('RATELIMIT.FIELDS.rateLimitSettingsId') ?? '',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('RATELIMIT.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/rateLimit/${params.id}/edit`)}
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
      field: 'routePath',
      align: 'left',
      headerName: t('RATELIMIT.FIELDS.routePath') ?? '',
      width: 300
    },
    {
      field: 'windowMs',
      align: 'right',
      headerName: t('RATELIMIT.FIELDS.windowMs') ?? '',
      width: 100,
      type: 'number'
    },
    {
      field: 'rateLimit',
      align: 'right',
      headerName: t('RATELIMIT.FIELDS.rateLimit') ?? '',
      width: 100,
      type: 'number'
    },
    {
      field: 'isEnabled',
      headerName: t('RATELIMIT.FIELDS.isEnabled') ?? '',
      width: 100,
      type: 'boolean'
    },
    {
      field: 'limitReason',
      align: 'left',
      headerName: t('RATELIMIT.FIELDS.limitReason') ?? '',
      minWidth: 200,
      flex: 1
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={state.modalOpen} onClose={closeModal} onDelete={handleDelete} />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<RateLimitDto>
          columns={columns}
          idField="rateLimitSettingsId"
          state={state}
          exportName="rateLimit"
          storagePrefix="rateLimit"
          defaultSort={[
            {
              field: 'rateLimitSettingsId',
              sort: 'asc'
            }
          ]}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          startActions={
            <Button size="small" color="primary" href="#rateLimit/add" startIcon={<AddIcon />}>
              {t('LIST.ADD')}
            </Button>
          }
        />
      </Widget>
    </Stack>
  );
};

export default RateLimitList;
