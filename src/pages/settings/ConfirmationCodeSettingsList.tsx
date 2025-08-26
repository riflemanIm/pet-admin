import React from 'react';
import { useSnackbar } from 'notistack';

import Widget from '../../components/Widget';
import { SettingsContext, actions } from '../../context/SettingsContext';

import { ConfirmationCodeSettingDto } from '../../helpers/dto';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import DatasetIcon from '@mui/icons-material/DatasetOutlined';
import { getGridLocaleText } from '../../helpers/grid';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { AccountRole, ConfirmationCodeType, getEnumName } from '../../helpers/enums';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '../../context/UserContext';

const ConfirmationCodeSettingsList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    currentUser: { role }
  } = useUserState();
  const [rows, setRows] = React.useState<ConfirmationCodeSettingDto[]>([]);

  const { state, dispatch } = React.useContext(SettingsContext);

  React.useEffect(() => {
    actions.doFetch('/confirmationCode')(dispatch);
  }, [dispatch]);

  React.useEffect(() => {
    setRows(state.rows as ConfirmationCodeSettingDto[]);
  }, [state.rows]);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (state.errorMessage) enqueueSnackbar(state.errorMessage, { variant: 'error' });
  }, [state.errorMessage]);

  const processRowUpdate = React.useCallback(async (newRow: ConfirmationCodeSettingDto, oldRow: ConfirmationCodeSettingDto) => {
    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) return oldRow;
    const success = await actions.doUpdate('/confirmationCode', newRow.confirmationCodeType, newRow)(dispatch);
    if (success) enqueueSnackbar(t('COMMON.RECORDSAVED'), { variant: 'success' });
    return success ? newRow : oldRow;
  }, []);

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    enqueueSnackbar(error.message, { variant: 'error' });
  }, []);

  const columns: GridColDef[] = React.useMemo(() => {
    const result: GridColDef[] = [
      {
        field: 'confirmationCodeType',
        align: 'left',
        headerName: t('CONFIRMATIONCODESETTING.FIELDS.confirmationCodeType') ?? '',
        valueFormatter: (value: string) => getEnumName(ConfirmationCodeType, value, t, 'ENUMS.ConfirmationCodeType') ?? '',
        width: 240
      }
    ];
    if (role === AccountRole.admin) {
      result.push({
        field: 'actions',
        align: 'left',
        headerName: t('HL7SETTINGS.FIELDS.actions') ?? '',
        sortable: false,
        filterable: false,
        width: 100,
        type: 'actions',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key="edit"
            icon={<DatasetIcon />}
            label="Журнал"
            color="primary"
            onClick={() => navigate(`/confirmationCodeSetting/${params.id}/records`)}
          />
        ]
      });
    }
    result.push(
      {
        field: 'lifeTime',
        align: 'right',
        headerName: t('CONFIRMATIONCODESETTING.FIELDS.lifeTime') ?? '',
        editable: true,
        width: 150,
        type: 'number'
      },
      {
        field: 'maxTryCount',
        align: 'right',
        headerName: t('CONFIRMATIONCODESETTING.FIELDS.maxTryCount') ?? '',
        editable: true,
        width: 150,
        type: 'number'
      },
      {
        field: 'nextCodeDelay',
        align: 'right',
        headerName: t('CONFIRMATIONCODESETTING.FIELDS.nextCodeDelay') ?? '',
        editable: true,
        width: 150,
        type: 'number'
      }
    );
    return result;
  }, [languageState.language]);

  return (
    <Widget inheritHeight noBodyPadding>
      <DataGrid
        loading={state.loading}
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(row: ConfirmationCodeSettingDto) => row.confirmationCodeType}
        getRowHeight={() => 'auto'}
        localeText={getGridLocaleText(languageState.language)}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        hideFooter
      />
    </Widget>
  );
};

export default ConfirmationCodeSettingsList;
