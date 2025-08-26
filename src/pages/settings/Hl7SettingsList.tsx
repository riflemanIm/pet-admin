import React from 'react';
import { useSnackbar } from 'notistack';

import Widget from '../../components/Widget';
import { SettingsContext, actions } from '../../context/SettingsContext';

import { Hl7SettingDto } from '../../helpers/dto';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import { getGridLocaleText } from '../../helpers/grid';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Hl7SettingsList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<Hl7SettingDto[]>([]);

  const { state, dispatch } = React.useContext(SettingsContext);

  React.useEffect(() => {
    actions.doFetch('/hl7Settings')(dispatch);
  }, [dispatch]);

  React.useEffect(() => {
    setRows(state.rows as Hl7SettingDto[]);
  }, [state.rows]);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (state.errorMessage) enqueueSnackbar(state.errorMessage, { variant: 'error' });
  }, [state.errorMessage]);

  const processRowUpdate = React.useCallback(async (newRow: Hl7SettingDto, oldRow: Hl7SettingDto) => {
    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) return oldRow;
    const success = await actions.doUpdate('/hl7Settings', newRow.hl7NotificationTypeId, newRow)(dispatch);
    if (success) enqueueSnackbar(t('COMMON.RECORDSAVED'), { variant: 'success' });
    return success ? newRow : oldRow;
  }, []);

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    enqueueSnackbar(error.message, { variant: 'error' });
  }, []);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: 'hl7NotificationType',
        align: 'left',
        headerName: t('SETTING.FIELDS.code') ?? '',
        width: 300
      },
      {
        field: 'actions',
        align: 'left',
        headerName: t('HL7SETTINGS.FIELDS.actions') ?? '',
        sortable: false,
        filterable: false,
        width: 80,
        type: 'actions',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key="edit"
            icon={<DatasetIcon />}
            label="Журнал"
            color="primary"
            onClick={() => navigate(`/hl7Setting/${params.id}/records`)}
          />
        ]
      },
      {
        field: 'handleMessages',
        type: 'boolean',
        headerName: t('HL7SETTINGS.FIELDS.handleMessages') ?? '',
        editable: true,
        width: 120
      },
      {
        field: 'logMessages',
        type: 'boolean',
        headerName: t('HL7SETTINGS.FIELDS.logMessages') ?? '',
        editable: true,
        width: 120
      }
    ],
    [languageState.language]
  );

  return (
    <Widget inheritHeight noBodyPadding>
      <DataGrid
        loading={state.loading}
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(row: Hl7SettingDto) => row.hl7NotificationTypeId}
        getRowHeight={() => 'auto'}
        localeText={getGridLocaleText(languageState.language)}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        hideFooter
      />
    </Widget>
  );
};

export default Hl7SettingsList;
