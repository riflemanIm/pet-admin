import React from 'react';
import { useSnackbar } from 'notistack';

import { Button, Stack } from '@mui/material';

import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
  DynamicFormOutlined as DynamicFormIcon
} from '@mui/icons-material';

import Widget from '../../components/Widget';
import { useWebFormDispatch, useWebFormState, actions } from '../../context/WebFormContext';

import { WebFormDto } from '../../helpers/dto';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import WebFormDialog from './WebFormDialog';
import { BaseListGrid } from '../../components/BaseListGrid';

const WebFormList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [preview, setPreview] = React.useState<{
    id: number;
    formUUID: string;
  }>({ id: 0, formUUID: '' });

  const dispatch = useWebFormDispatch();
  const state = useWebFormState();
  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(state.idToDelete as number)(dispatch)
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
      field: 'calypsoFormId',
      align: 'right',
      headerName: t('WEBFORM.FIELDS.webFormId') ?? '',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('WEBFORM.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      width: 120,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/webForm/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Удалить"
          color="primary"
          onClick={() => openModal(params.id as number)}
        />,
        <GridActionsCellItem
          key="html"
          icon={<DynamicFormIcon />}
          label="Form"
          color="primary"
          onClick={() =>
            setPreview({
              id: params.id as number,
              formUUID: params.row.formUUID
            })
          }
        />
      ]
    },
    {
      field: 'medicalNetId',
      align: 'left',
      headerName: t('WEBFORM.FIELDS.medicalNetId') ?? '',
      width: 100
    },
    {
      field: 'formUUID',
      align: 'left',
      headerName: t('WEBFORM.FIELDS.formUUID') ?? '',
      width: 300
    },
    {
      field: 'scope',
      align: 'left',
      headerName: t('WEBFORM.FIELDS.scope') ?? '',
      width: 100
    },
    {
      field: 'title',
      align: 'left',
      headerName: t('WEBFORM.FIELDS.title') ?? '',
      width: 300
    },
    {
      field: 'control',
      align: 'left',
      width: 200,
      headerName: t('WEBFORM.FIELDS.control') ?? ''
    },
    {
      field: 'position',
      align: 'right',
      width: 100,
      headerName: t('WEBFORM.FIELDS.position') ?? ''
    },
    {
      field: 'isEnabled',
      width: 100,
      headerName: t('WEBFORM.FIELDS.isEnabled') ?? '',
      type: 'boolean'
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={state.modalOpen} onClose={closeModal} onDelete={handleDelete} />
      <WebFormDialog
        isOpen={!!preview.id}
        formId={preview.id}
        formUUID={preview.formUUID}
        onAuth={actions.doAuth}
        onClose={() => setPreview({ ...preview, id: 0 })}
      />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<WebFormDto>
          columns={columns}
          idField="calypsoFormId"
          exportName="webForm"
          storagePrefix="webForm"
          state={state}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[
            {
              field: 'calypsoFormId',
              sort: 'asc'
            }
          ]}
          startActions={
            <Button size="small" color="primary" href="#webForm/add" startIcon={<AddIcon />}>
              {t('LIST.ADD')}
            </Button>
          }
        />
      </Widget>
    </Stack>
  );
};

export default WebFormList;
