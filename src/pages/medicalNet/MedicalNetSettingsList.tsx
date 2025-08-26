import React from 'react';
import { useSnackbar } from 'notistack';
import DateFnsAdapter from '@date-io/date-fns';

import InfoIcon from '@mui/icons-material/InfoOutlined';

import Widget from '../../components/Widget';
import { SettingsContext, actions } from '../../context/SettingsContext';

import { MedicalNetSettingDto } from '../../helpers/dto';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { getGridLocaleText } from '../../helpers/grid';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { SettingValidator } from '../../helpers/enums';
import { useParams } from 'react-router-dom';
import DescriptionDialog from './DescriptionDialog';
import { getStrValue, getValue, renderInputCell } from '../../components/SettingsGrid/utils';
import { QuickSearchToolbar } from '../../components/SettingsGrid/quickSearchToolbar';

const formatValue = (value: string | Date): string => {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return value;
};

const MedicalNetSettingsList = (): JSX.Element => {
  const { id } = useParams();
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const [rows, setRows] = React.useState<MedicalNetSettingDto[]>([]);
  const { state, dispatch } = React.useContext(SettingsContext);
  const [description, setDescription] = React.useState<{ title: string; description: string } | undefined>(undefined);

  React.useEffect(() => {
    actions.doFetch('/medicalNetSetting', { medicalNetId: id })(dispatch);
  }, []);

  React.useEffect(() => {
    setRows(state.rows as MedicalNetSettingDto[]);
  }, [state.rows]);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (state.errorMessage) enqueueSnackbar(state.errorMessage, { variant: 'error' });
  }, [state.errorMessage]);

  const processRowUpdate = React.useCallback(async (newRow: MedicalNetSettingDto, oldRow: MedicalNetSettingDto) => {
    if (getValue(newRow) === getValue(oldRow)) return oldRow;
    const success = await actions.doUpdate('/medicalNetSetting', newRow.medicalNetSettingsId, { ...newRow, value: getStrValue(newRow) })(
      dispatch
    );
    if (success) enqueueSnackbar(t('COMMON.RECORDSAVED'), { variant: 'success' });
    return success ? newRow : oldRow;
  }, []);

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    enqueueSnackbar(error.message, { variant: 'error' });
  }, []);

  const showDescription = (item: MedicalNetSettingDto) => {
    if (item.description) {
      setDescription({
        title: item.name,
        description: item.description
      });
    } else {
      setDescription(undefined);
    }
  };

  const columns: GridColDef<MedicalNetSettingDto>[] = React.useMemo(() => {
    const uniqueGroups = new Set(rows.map((item) => item.groupName));
    return [
      {
        field: 'groupName',
        align: 'left',
        headerName: t('SETTING.FIELDS.groupName') ?? '',
        width: 150,
        type: 'singleSelect',
        valueOptions: [...uniqueGroups]
      },
      {
        field: 'name',
        align: 'left',
        headerName: t('SETTING.FIELDS.name') ?? '',
        minWidth: 200,
        flex: 1
      },
      {
        field: 'actions',
        align: 'left',
        headerName: '',
        sortable: false,
        filterable: false,
        type: 'actions',
        width: 30,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key="edit"
            icon={params.row.description ? <InfoIcon /> : <div />}
            label="Информация"
            color="default"
            onClick={() => showDescription(params.row)}
          />
        ]
      },
      {
        field: 'code',
        align: 'left',
        headerName: t('SETTING.FIELDS.code') ?? '',
        width: 300
      },
      {
        field: 'value',
        align: 'left',
        headerName: t('SETTING.FIELDS.value') ?? '',
        editable: true,
        width: 400,
        valueGetter: (value, row) => getValue(row),
        renderEditCell: renderInputCell,
        valueFormatter: formatValue
      }
    ];
  }, [languageState.language, rows]);

  return (
    <Widget inheritHeight noBodyPadding>
      <DescriptionDialog
        isOpen={!!description}
        title={description?.title}
        text={description?.description}
        onClose={() => setDescription(undefined)}
      />
      <DataGrid
        loading={state.loading}
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(row: MedicalNetSettingDto) => row.medicalNetSettingsId}
        getRowHeight={() => 'auto'}
        localeText={getGridLocaleText(languageState.language)}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        slots={{ toolbar: QuickSearchToolbar }}
      />
    </Widget>
  );
};

export default MedicalNetSettingsList;
