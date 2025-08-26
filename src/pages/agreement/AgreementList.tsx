import React from 'react';
import { useSnackbar } from 'notistack';

import { Button, Stack } from '@mui/material';

import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
  TextSnippet as TextSnippetIcon
} from '@mui/icons-material';

import Widget from '../../components/Widget';
import { useAgreementDispatch, useAgreementState, actions } from '../../context/AgreementContext';

import { AgreementDto } from '../../helpers/dto';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import AgreementDialog from './AgreementDialog';
import { BaseListGrid } from '../../components/BaseListGrid';

const AgreementList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [agreement, setAgreement] = React.useState<string | undefined>(undefined);

  const dispatch = useAgreementDispatch();
  const agreementValue = useAgreementState();
  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(agreementValue.idToDelete as number)(dispatch)
      .then(() => {
        sendNotification(t('COMMON.RECORDDELETED'));
      });
  };

  React.useEffect(() => {
    actions.doReferenceLists()(dispatch);
  }, []);

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text: string) {
    enqueueSnackbar(text, {
      variant: 'success'
    });
  }

  const columns: GridColDef<AgreementDto>[] = [
    {
      field: 'agreementId',
      align: 'right',
      headerName: t('AGREEMENT.FIELDS.agreementId') ?? '',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('AGREEMENT.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/agreement/${params.id}/edit`)}
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
      field: 'agreementTypeId',
      align: 'left',
      headerName: t('AGREEMENT.FIELDS.agreementTypeId') ?? '',
      width: 150,
      type: 'singleSelect',
      valueOptions: agreementValue.agreementTypes.map((it) => it.agreementTypeId),
      valueFormatter: (value: number) => agreementValue.agreementTypes.find((it) => it.agreementTypeId === value)?.code ?? ''
    },
    {
      field: 'platform',
      align: 'left',
      headerName: t('AGREEMENT.FIELDS.platform') ?? '',
      width: 100
    },
    {
      field: 'medicalNetId',
      align: 'left',
      headerName: t('AGREEMENT.FIELDS.medicalNetId') ?? '',
      width: 100
    },
    {
      field: 'langCode',
      align: 'left',
      headerName: t('AGREEMENT.FIELDS.langCode') ?? ''
    },
    {
      field: 'description',
      align: 'left',
      headerName: t('AGREEMENT.FIELDS.description') ?? '',
      width: 300
    },
    {
      field: 'agreement',
      align: 'left',
      headerName: t('AGREEMENT.FIELDS.agreement') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      width: 120,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="text"
          icon={<TextSnippetIcon />}
          label="Text"
          color="primary"
          disabled={!params.row.agreement}
          onClick={() => setAgreement(params.row.agreement)}
        />
      ]
    },
    {
      field: 'sortOrder',
      align: 'right',
      headerName: t('AGREEMENT.FIELDS.sortOrder') ?? '',
      type: 'number'
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={agreementValue.modalOpen} onClose={closeModal} onDelete={handleDelete} />
      <AgreementDialog isOpen={!!agreement} agreement={agreement} onClose={() => setAgreement(undefined)} />

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<AgreementDto>
          columns={columns}
          idField="agreementId"
          state={agreementValue}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          exportName="agreement"
          storagePrefix="agreement"
          defaultSort={[
            {
              field: 'agreementId',
              sort: 'asc'
            }
          ]}
          startActions={
            <Button size="small" color="primary" href="#agreement/add" startIcon={<AddIcon />}>
              {t('LIST.ADD')}
            </Button>
          }
        />
      </Widget>
    </Stack>
  );
};

export default AgreementList;
