import React from 'react';

import Widget from '../../components/Widget';

// Icons
import { CreateOutlined as CreateIcon } from '@mui/icons-material';

import { ClinicSpecializationDto } from '../../helpers/dto';
import { useNavigate, useParams } from 'react-router-dom';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { actions, useClinicSpecializationDispatch, useClinicSpecializationState } from '../../context/ClinicSpecializationContext';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { BaseListGrid } from '../../components/BaseListGrid';

const ClinicSpecializationList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clinicId } = useParams();

  const dispatch = useClinicSpecializationDispatch();
  const clinicSpecializationValue = useClinicSpecializationState();

  React.useEffect(() => {
    actions.doReferenceLists()(dispatch);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'clinicSpecializationId',
      align: 'right',
      headerName: t('CLINICSPECIALIZATION.FIELDS.clinicSpecializationId') ?? '',
      width: 120,
      type: 'number'
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('CLINICSPECIALIZATION.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/clinic/${clinicId}/specialization/${params.id}/edit`)}
        />
      ]
    },
    {
      field: 'name',
      align: 'left',
      headerName: t('CLINICSPECIALIZATION.FIELDS.name') ?? '',
      width: 300
    },
    {
      field: 'specializationId',
      align: 'left',
      headerName: t('CLINICSPECIALIZATION.FIELDS.specializationId') ?? '',
      type: 'number',
      flex: 1,
      minWidth: 200,
      headerAlign: 'left',
      valueGetter: (value) => {
        const specialization = clinicSpecializationValue.specializations.find((it) => it.specializationId === value);
        return specialization ? `${value} (${specialization.code})` : value;
      }
    }
  ];

  return (
    <Widget inheritHeight noBodyPadding>
      <BaseListGrid<ClinicSpecializationDto>
        columns={columns}
        idField="clinicSpecializationId"
        exportName="clinicSpecialization"
        storagePrefix="clinicSpecialization"
        state={clinicSpecializationValue}
        dispatch={dispatch}
        doFetch={actions.doFetch(Number(clinicId))}
        defaultSort={[
          {
            field: 'clinicSpecializationId',
            sort: 'asc'
          }
        ]}
      />
    </Widget>
  );
};

export default ClinicSpecializationList;
