import React from 'react';
import { useSnackbar } from 'notistack';

import { Button, Stack } from '@mui/material';

import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
  Html as HtmlIcon,
  TextSnippet as TextSnippetIcon
} from '@mui/icons-material';

import Widget from '../../components/Widget';
import { useNotificationTemplateDispatch, useNotificationTemplateState, actions } from '../../context/NotificationTemplateContext';

import { NotificationTemplateDto } from '../../helpers/dto';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import {
  getEnumName,
  NotificationRecordType,
  notificationRecordTypeNames,
  NotificationType,
  notificationTypeNames
} from '../../helpers/enums';
import TemplateDialog from './TemplateDialog';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import { BaseListGrid } from '../../components/BaseListGrid';

const NotificationTemplateList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [template, setTemplate] = React.useState<{ text: string; recordType: NotificationRecordType } | undefined>(undefined);

  const dispatch = useNotificationTemplateDispatch();
  const state = useNotificationTemplateState();
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

  const columns: GridColDef<NotificationTemplateDto>[] = [
    {
      field: 'ntfTemplateClinicId',
      align: 'right',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.ntfTemplateClinicId') ?? '',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/notificationTemplate/${params.id}/edit`)}
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
      field: 'description',
      align: 'left',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.description') ?? '',
      width: 300
    },
    {
      field: 'notificationType',
      align: 'left',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.notificationType') ?? '',
      type: 'singleSelect',
      width: 200,
      valueOptions: notificationTypeNames(t, 'ENUMS.NotificationType'),
      valueFormatter: (value: string) => getEnumName(NotificationType, value, t, 'ENUMS.NotificationType')
    },
    {
      field: 'medicalNetId',
      align: 'left',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.medicalNetId') ?? '',
      width: 300
    },
    {
      field: 'clinicId',
      align: 'left',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.clinicId') ?? ''
    },
    {
      field: 'recordType',
      align: 'left',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.recordType') ?? '',
      type: 'singleSelect',
      width: 200,
      valueOptions: notificationRecordTypeNames(t, 'ENUMS.NotificationRecordType'),
      valueFormatter: (value: string) => getEnumName(NotificationRecordType, value, t, 'ENUMS.NotificationRecordType')
    },
    {
      field: 'langCode',
      align: 'left',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.langCode') ?? ''
    },
    {
      field: 'templates',
      align: 'left',
      headerName: t('NOTIFICATIONTEMPLATE.FIELDS.templates') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams<NotificationTemplateDto>) => [
        <GridActionsCellItem
          key="text"
          icon={<TextSnippetIcon />}
          label="Text"
          color="primary"
          disabled={!params.row.template}
          onClick={() =>
            setTemplate({
              text: params.row.template as string,
              recordType: params.row.recordType
            })
          }
        />,
        <GridActionsCellItem
          key="html"
          icon={<HtmlIcon />}
          label="HTML"
          color="primary"
          disabled={!params.row.templateHtml}
          onClick={() =>
            setTemplate({
              text: params.row.templateHtml as string,
              recordType: params.row.recordType
            })
          }
        />
      ]
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={state.modalOpen} onClose={closeModal} onDelete={handleDelete} />
      <TemplateDialog
        isOpen={!!template}
        template={template?.text}
        recordType={template?.recordType}
        onClose={() => setTemplate(undefined)}
      />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<NotificationTemplateDto>
          columns={columns}
          idField="ntfTemplateClinicId"
          exportName="notificationTemplate"
          storagePrefix="notificationTemplate"
          state={state}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[
            {
              field: 'ntfTemplateClinicId',
              sort: 'asc'
            }
          ]}
          startActions={
            <Button size="small" color="primary" href="#notificationTemplate/add" startIcon={<AddIcon />}>
              {t('LIST.ADD')}
            </Button>
          }
        />
      </Widget>
    </Stack>
  );
};

export default NotificationTemplateList;
