import React from 'react';
import { useSnackbar } from 'notistack';

import Widget from '../../components/Widget';
import { SettingsContext, actions } from '../../context/SettingsContext';

import { SettingDto } from '../../helpers/dto';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getGridLocaleText } from '../../helpers/grid';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import { QuickSearchToolbar } from '../../components/SettingsGrid/quickSearchToolbar';
import { getValue, renderInputCell } from '../../components/SettingsGrid/utils';

const SettingsList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const [rows, setRows] = React.useState<SettingDto[]>([]);

  const { state, dispatch } = React.useContext(SettingsContext);

  React.useEffect(() => {
    actions.doFetch('/setting')(dispatch);
  }, [dispatch]);

  React.useEffect(() => {
    setRows(state.rows as SettingDto[]);
  }, [state.rows]);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (state.errorMessage) enqueueSnackbar(state.errorMessage, { variant: 'error' });
  }, [state.errorMessage]);

  const processRowUpdate = React.useCallback(async (newRow: SettingDto, oldRow: SettingDto) => {
    if (getValue(newRow) === getValue(oldRow)) return oldRow;
    const success = await actions.doUpdate('/setting', newRow.id, newRow)(dispatch);
    if (success) enqueueSnackbar(t('COMMON.RECORDSAVED'), { variant: 'success' });
    return success ? newRow : oldRow;
  }, []);

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    enqueueSnackbar(error.message, { variant: 'error' });
  }, []);

  const columns: GridColDef<SettingDto>[] = React.useMemo(() => {
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
        width: 300,
        valueGetter: (value, row: SettingDto) => getValue(row),
        renderEditCell: renderInputCell
      }
    ];
  }, [languageState.language, rows]);

  return (
    <Widget inheritHeight noBodyPadding>
      <DataGrid
        loading={state.loading}
        autoHeight
        rows={rows}
        columns={columns}
        getRowId={(row: SettingDto) => row.id}
        getRowHeight={() => 'auto'}
        localeText={getGridLocaleText(languageState.language)}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        hideFooter
        slots={{ toolbar: QuickSearchToolbar }}
      />
    </Widget>
  );
};

export default SettingsList;
