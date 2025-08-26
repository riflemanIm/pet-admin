import React from 'react';

import Widget from '../../components/Widget';

// Icons
import { CreateOutlined as CreateIcon } from '@mui/icons-material';

import { ClinicPlExGrWebDto } from '../../helpers/dto';
import { useNavigate, useParams } from 'react-router-dom';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { actions, useClinicPlExGrWebDispatch, useClinicPlExGrWebState } from '../../context/ClinicPlExGrWebContext';
import { BaseListGrid } from '../../components/BaseListGrid';

const ClinicPlExGrWebList = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clinicId } = useParams();

  const dispatch = useClinicPlExGrWebDispatch();
  const state = useClinicPlExGrWebState();

  React.useEffect(() => {
    actions.doReferenceLists()(dispatch);
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'plExGrWebId',
      align: 'right',
      headerName: t('CLINICPLEXGRWEB.FIELDS.plExGrWebId') ?? '',
      width: 120,
      type: 'number'
    },
    {
      field: 'actions',
      align: 'left',
      headerName: t('CLINICPLEXGRWEB.FIELDS.actions') ?? '',
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<CreateIcon />}
          label="Редактировать"
          color="primary"
          onClick={() => navigate(`/clinic/${clinicId}/plExGrWeb/${params.id}/edit`)}
        />
      ]
    },
    {
      field: 'code',
      align: 'left',
      headerName: t('CLINICPLEXGRWEB.FIELDS.code') ?? '',
      width: 300
    },
    {
      field: 'specializationId',
      align: 'left',
      headerName: t('CLINICPLEXGRWEB.FIELDS.specializationId') ?? '',
      type: 'number',
      minWidth: 200,
      flex: 1,
      headerAlign: 'left',
      valueGetter: (value) => {
        const specialization = state.specializations.find((it) => it.specializationId === value);
        return specialization ? `${value} (${specialization.code})` : value;
      }
    }
  ];

  return (
    <Widget inheritHeight noBodyPadding>
      <BaseListGrid<ClinicPlExGrWebDto>
        columns={columns}
        idField="plExGrWebId"
        exportName="clinicPlExGrWeb"
        storagePrefix="clinicPlExGrWeb"
        state={state}
        dispatch={dispatch}
        doFetch={actions.doFetch(Number(clinicId))}
        defaultSort={[
          {
            field: 'plExGrWebId',
            sort: 'asc'
          }
        ]}
      />
    </Widget>
  );
};

export default ClinicPlExGrWebList;
