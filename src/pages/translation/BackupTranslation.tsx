import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import DateFnsAdapter from '@date-io/date-fns';

import { Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, SelectChangeEvent } from '@mui/material';

import { useTranslationDispatch, useTranslationState, actions } from '../../context/TranslationContext';
import isEmpty from '../../helpers/isEmpty';
import { EditorButtons } from '../../components/Common/editorButtons';

const BackupTranslation = (): JSX.Element => {
  const dateFns = new DateFnsAdapter();
  const navigate = useNavigate();
  const [backupVal, setBackupVal] = React.useState('');
  const translationDispatch = useTranslationDispatch();
  const { backupsTranslation, findLoading } = useTranslationState();

  React.useEffect(() => {
    actions.doFetchBackups()(translationDispatch);
  }, []);
  React.useEffect(() => {
    if (!isEmpty(backupsTranslation)) {
      setBackupVal(`${backupsTranslation[0].pname}__${backupsTranslation[0].backuped_at}`);
    }
  }, [backupsTranslation]);
  const handleChangeSelect = (e: SelectChangeEvent<unknown>): void => {
    setBackupVal(e.target.value as string);
  };

  const handleSubmit = () => {
    actions.doRestoreBackup(backupVal, navigate)(sendNotification);
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(errorMessage?: string) {
    enqueueSnackbar(errorMessage || 'Перевод восстановлен', {
      variant: errorMessage ? 'warning' : 'success'
    });
  }

  return (
    <React.Fragment>
      {findLoading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" justifyContent="center" flexDirection="row">
          <Box display="flex" flexDirection="column" width={600}>
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="id-backup-select-label">Выберите бекап</InputLabel>
              <Select
                labelId="id-backup-select-label"
                id="id-backup-select"
                label="Выберите бекап"
                onChange={handleChangeSelect}
                value={backupVal}
              >
                {backupsTranslation.map((item) => (
                  <MenuItem value={`${item.pname}__${item.backuped_at}`} key={`${item.pname}__${item.backuped_at}`}>
                    {dateFns.formatByString(new Date(item.backuped_at), 'dd.MM.yyyy HH:mm:ss')} {item.pname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <EditorButtons onCancel={() => navigate('/translation/list')} submitText="Востановить" onSubmit={handleSubmit} />
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default BackupTranslation;
