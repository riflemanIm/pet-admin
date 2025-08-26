import React from 'react';
import { useSnackbar } from 'notistack';

import { Button, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';

import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
  TextSnippet as TextSnippetIcon
} from '@mui/icons-material';

import Widget from '../../components/Widget';
import { useMedicalNetFaqDispatch, useMedicalNetFaqState, actions } from '../../context/MedicalNetFaqContext';

import { MedicalNetFaqDto } from '../../helpers/dto';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import MarkdownDialog from './MarkdownDialog';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import { useUserState } from '../../context/UserContext';
import { isNetRole } from '../../helpers/enums';
import { BaseListGrid } from '../../components/BaseListGrid';

const MedicalNetFaqList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    currentUser: { role, medicalNetId: defaultMedicalNetId }
  } = useUserState();

  const [answer, setAnswer] = React.useState<string | undefined>(undefined);

  const dispatch = useMedicalNetFaqDispatch();
  const value = useMedicalNetFaqState();
  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const handleDelete = () => {
    actions
      .doDelete(value.idToDelete as number)(dispatch)
      .then(() => sendNotification(t('COMMON.RECORDDELETED')));
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text: string) {
    enqueueSnackbar(text, {
      variant: 'success'
    });
  }

  React.useEffect(() => {
    actions.doReferenceLists()(dispatch);
  }, []);

  React.useEffect(() => {
    actions.setMedicalNetId(defaultMedicalNetId || (value.medicalNets.length && value.medicalNets[0].medicalNetId))(dispatch);
  }, [defaultMedicalNetId, value?.medicalNets]);

  const columns: GridColDef[] = [
    {
      field: 'medicalNetFaqId',
      align: 'right',
      headerName: t('MEDICALNETFAQ.FIELDS.medicalNetFaqId') ?? '',
      type: 'number',
      width: 80
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('MEDICALNETFAQ.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/medicalNetFaq/${params.id}/edit`)}
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
      field: 'questionGroup',
      align: 'left',
      headerName: t('MEDICALNETFAQ.FIELDS.questionGroup') ?? '',
      width: 300
    },
    {
      field: 'question',
      align: 'left',
      headerName: t('MEDICALNETFAQ.FIELDS.question') ?? '',
      width: 300
    },
    {
      field: 'langCode',
      align: 'left',
      headerName: t('MEDICALNETFAQ.FIELDS.langCode') ?? ''
    },
    {
      field: 'sortOrder',
      align: 'right',
      headerName: t('MEDICALNETFAQ.FIELDS.sortOrder') ?? '',
      type: 'number'
    },
    {
      field: 'answer',
      align: 'left',
      headerName: t('MEDICALNETFAQ.FIELDS.answer') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="md"
          icon={<TextSnippetIcon />}
          label="MD"
          color="primary"
          disabled={!params.row.answer}
          onClick={() => setAnswer(params.row.answer)}
        />
      ]
    }
  ];

  return (
    <Stack spacing={3}>
      <DeleteDialog open={value.modalOpen} onClose={closeModal} onDelete={handleDelete} />
      <MarkdownDialog isOpen={!!answer} text={answer} onClose={() => setAnswer(undefined)} />

      <Widget inheritHeight>
        {!isNetRole(role) && (
          <FormControl variant="standard" size="small" style={{ marginLeft: 8, width: 300 }}>
            <InputLabel id="id-medical_net-label">{t('REPORT.MEDICALNET')}</InputLabel>
            <Select
              name="medicalNetId"
              id="id-medical_net-select"
              labelId="id-medical_net-label"
              label={t('REPORT.MEDICALNET')}
              onChange={(event) => actions.setMedicalNetId(event.target.value ? Number(event.target.value) : undefined)(dispatch)}
              value={(value.medicalNets?.length > 0 && value.medicalNetId) || ''}
            >
              {value.medicalNets?.map((item) => (
                <MenuItem value={item.medicalNetId} key={item.medicalNetId}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Widget>

      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<MedicalNetFaqDto>
          columns={columns}
          idField="medicalNetFaqId"
          exportName="medicalNetFaq"
          storagePrefix="medicalNetFaq"
          state={value}
          dispatch={dispatch}
          doFetch={actions.doFetch(value.medicalNetId)}
          defaultSort={[
            {
              field: 'sortOrder',
              sort: 'asc'
            }
          ]}
          params={[value.medicalNetId ?? -1]}
          startActions={
            <Button size="small" color="primary" startIcon={<AddIcon />} disabled={!value.medicalNetId} href="#medicalNetFaq/add">
              {t('LIST.ADD')}
            </Button>
          }
        />
      </Widget>
    </Stack>
  );
};

export default MedicalNetFaqList;
