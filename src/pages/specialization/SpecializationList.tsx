import React from 'react';
import { useSnackbar } from 'notistack';
import { Button, Stack } from '@mui/material';

import { useSpecializationDispatch, useSpecializationState, actions } from '../../context/SpecializationContext';

// Icons
import {
  Add as AddIcon,
  CreateOutlined as CreateIcon,
  DeleteOutlined as DeleteIcon,
  GetApp as DownloadIcon,
  ImportExportOutlined as ImportExportIcon,
  LabelImportant as LabelImportantIcon
} from '@mui/icons-material';

import { SpecializationDto, SpecializationNameDto } from '../../helpers/dto';
import { useNavigate } from 'react-router-dom';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useUserState } from '../../context/UserContext';
import { isNetRole } from '../../helpers/enums';
import ImageInfo from './ImageInfo';
import SpecializationOrderDialog from './SpecializationOrderDialog';
import { useTranslation } from 'react-i18next';
import { DeleteDialog } from '../../components/Common/deleteDialog';
import config from '../../config';
import { uploadToServer } from '../../helpers/file';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { BaseListGrid } from '../../components/BaseListGrid';

const SpecializationList = (): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    currentUser: { role, langCode, medicalNetId: defaultMedicalNetId }
  } = useUserState();

  const [medicalNetId, setMedicalNetId] = React.useState<number | undefined>(undefined);

  const [sortOrder, setSortOrder] = React.useState<{
    id?: number;
    isOpen: boolean;
    value?: number;
  }>({
    id: undefined,
    isOpen: false,
    value: undefined
  });

  const [isLoadingFile, setIsLoadingFile] = React.useState(false);

  const dispatch = useSpecializationDispatch();
  const state = useSpecializationState();

  React.useEffect(() => {
    actions.doReferenceLists()(dispatch);
  }, []);

  React.useEffect(() => {
    setMedicalNetId(defaultMedicalNetId || (state.medicalNets.length && state.medicalNets[0].medicalNetId));
  }, [defaultMedicalNetId, state.medicalNets]);

  const openModal = (id: number) => {
    actions.doOpenConfirm(id)(dispatch);
  };

  const closeModal = () => {
    actions.doCloseConfirm()(dispatch);
  };

  const openSortOrderModal = (id: number, value?: number) => {
    setSortOrder({
      id,
      isOpen: true,
      value
    });
  };

  const closeSortOrderModal = (success: boolean, value?: number) => {
    if (success) {
      actions.doSetSortOrder(sortOrder.id as number, value, medicalNetId)(dispatch);
    }
    setSortOrder({
      id: undefined,
      isOpen: false,
      value: undefined
    });
  };

  const handleDelete = () => {
    actions
      .doDelete(state.idToDelete as number)(dispatch)
      .then(() => sendNotification(t('COMMON.RECORDDELETED')));
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(text: string, isError = false) {
    enqueueSnackbar(text, {
      variant: isError ? 'warning' : 'success'
    });
  }

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    const filedata = event.target.files[0];
    const filename = filedata.name;
    if (filename != null) {
      setIsLoadingFile(true);

      await uploadToServer(`/specialization/import`, {
        filedata,
        filename
      })
        .then(() => {
          setIsLoadingFile(false);
          sendNotification(t('SPECIALIZATION.IMPORTED'));
          setTimeout(() => {
            navigate('/specialization/list');
          }, 1000);
        })
        .catch((e) => {
          setIsLoadingFile(false);
          sendNotification(e.response, true);
        });
    }
    return null;
  };

  const columns: GridColDef[] = [
    {
      field: 'specializationId',
      align: 'right',
      headerName: t('SPECIALIZATION.FIELDS.specializationId') ?? '',
      width: 80,
      type: 'number'
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('SPECIALIZATION.FIELDS.actions') ?? '',
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
          onClick={() => navigate(`/specialization/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          key="editOrder"
          icon={<ImportExportIcon />}
          label="Поправить порядок"
          color="primary"
          onClick={() => openSortOrderModal(params.row.specializationId, params.row.sortOrder)}
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
      field: 'code',
      align: 'left',
      headerName: t('SPECIALIZATION.FIELDS.code') ?? '',
      width: 200
    },
    {
      field: 'sortOrder',
      align: 'left',
      headerName: t('SPECIALIZATION.FIELDS.sortOrder') ?? '',
      type: 'number'
    },
    {
      field: 'shortDescription',
      align: 'left',
      headerName: t('SPECIALIZATION.FIELDS.shortDescription') ?? '',
      sortable: false,
      filterable: false,
      width: 300,
      valueGetter: (value, row) => row.names.find((it: SpecializationNameDto) => it.langCode === langCode)?.shortDescription
    },
    {
      field: 'description',
      align: 'left',
      headerName: t('SPECIALIZATION.FIELDS.description') ?? '',
      sortable: false,
      filterable: false,
      width: 400,
      valueGetter: (value, row) => row.names.find((it: SpecializationNameDto) => it.langCode === langCode)?.description
    },
    {
      field: 'image',
      align: 'left',
      headerName: t('SPECIALIZATION.FIELDS.image') ?? '',
      sortable: false,
      filterable: false,
      disableExport: true,
      width: 280,
      renderCell: (params) => (params.value ? <ImageInfo content={params.value} /> : '')
    },
    {
      field: 'largeImage',
      align: 'left',
      headerName: t('SPECIALIZATION.FIELDS.largeImage') ?? '',
      sortable: false,
      filterable: false,
      disableExport: true,
      width: 280,
      renderCell: (params) => (params.value ? <ImageInfo content={params.value} /> : '')
    }
  ];

  return (
    <Stack spacing={3}>
      <SpecializationOrderDialog
        sortOrder={sortOrder.value}
        isOpen={sortOrder.isOpen}
        onClose={(success, value) => closeSortOrderModal(success, value)}
      />
      <DeleteDialog open={state.modalOpen} onClose={closeModal} onDelete={handleDelete} />

      <Stack spacing={2} direction="row">
        {!isNetRole(role) && (
          <FormControl variant="standard" size="small" style={{ width: 300 }}>
            <InputLabel id="id-medical_net-label">{t('REPORT.MEDICALNET')}</InputLabel>
            <Select
              name="medicalNetId"
              id="id-medical_net-select"
              labelId="id-medical_net-label"
              label={t('REPORT.MEDICALNET')}
              onChange={(event) => setMedicalNetId(event.target.value ? Number(event.target.value) : undefined)}
              value={(state.medicalNets?.length > 0 && medicalNetId) || ''}
            >
              {state.medicalNets?.map((item) => (
                <MenuItem value={item.medicalNetId} key={item.medicalNetId}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Stack>

      <BaseListGrid<SpecializationDto>
        columns={columns}
        idField="specializationId"
        exportName="specialization"
        storagePrefix="specialization"
        state={state}
        dispatch={dispatch}
        doFetch={actions.doFetch}
        params={[medicalNetId ?? -1]}
        defaultSort={[
          {
            field: 'specializationId',
            sort: 'asc'
          }
        ]}
        loading={isLoadingFile}
        startActions={
          <Button size="small" color="primary" startIcon={<AddIcon />} href="#specialization/add">
            {t('LIST.ADD')}
          </Button>
        }
        endActions={
          <React.Fragment>
            <Button size="small" color="secondary" startIcon={<DownloadIcon />} href={`${config.baseURLApi}/specialization/export`}>
              {t('LIST.EXPORT')}
            </Button>
            <Button size="small" color="secondary" component="label" startIcon={<LabelImportantIcon />}>
              <input hidden accept="application/json" type="file" onChange={handleFile} />
              {t('LIST.IMPORT')}
            </Button>
          </React.Fragment>
        }
      />
    </Stack>
  );
};

export default SpecializationList;
