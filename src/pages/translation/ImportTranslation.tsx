import React from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormHelperText,
  Switch,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';

import useStyles from './styles';

import config from '../../config';
import { useTranslationState, useTranslationDispatch, actions } from '../../context/TranslationContext';
import isEmpty from '../../helpers/isEmpty';
import { uploadToServer } from '../../helpers/file';

const ImportTranslation = (): JSX.Element => {
  const classes = useStyles();
  const [isLoadingFile, setIsLoadingFile] = React.useState(false);
  const { filterVals } = useTranslationState();

  console.log('ImportTranslation filterVals', filterVals);
  const [pname, setPName] = React.useState(!isEmpty(filterVals) ? filterVals.pname : 'mobimed_site');
  const [deleteOldKeys, setDeleteOldKeys] = React.useState(false);
  const [doBackup, setDoBackup] = React.useState(true);

  const fileInput = React.useRef(null);

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(errorMessage?: string) {
    enqueueSnackbar(errorMessage || 'Translation imported', {
      variant: errorMessage ? 'warning' : 'success'
    });
  }

  React.useEffect(() => {
    sendNotification(' Обязательно выберете СВОЙ проект! ');
  }, []);
  const navigate = useNavigate();

  const translationDispatch = useTranslationDispatch();

  const handlePName = (e: SelectChangeEvent<unknown>): void => {
    if (!e.target.value) return;
    setPName(e.target.value as string);
    actions.setFilter({ pname: e.target.value as string })(translationDispatch);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    const filedata = event.target.files[0];
    const filename = filedata.name;
    const validEndings = ['en.json', 'eng.json', 'ru.json', 'rus.json', 'fr.json', 'fra.json'];
    if (filename != null && validEndings.find((it) => filename.toLowerCase().endsWith(it))) {
      setIsLoadingFile(true);

      await uploadToServer(`/translations/json/${pname}`, {
        filedata,
        deleteOldKeys: String(deleteOldKeys),
        doBackup: String(doBackup)
      })
        .then(() => {
          setIsLoadingFile(false);
          sendNotification();
          setTimeout(() => {
            navigate('/translation/list');
          }, 1000);
        })
        .catch((e) => {
          setIsLoadingFile(false);
          sendNotification(e.response.data.message);
        });
    } else {
      sendNotification(`Название файла должно оканчиваться на ${validEndings.join(' или ')}`);
    }
    return null;
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        {!isLoadingFile ? (
          <>
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="id-pname-label">Выберите название проекта:</InputLabel>
              <Select labelId="id-pname-label" id="id-pname-select" label="Выберите название проекта:" onChange={handlePName} value={pname}>
                <MenuItem value="">
                  <em>Все</em>
                </MenuItem>
                {config.pNames.map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControlLabel
              style={{ marginTop: 18 }}
              control={
                <Switch checked={deleteOldKeys} onChange={() => setDeleteOldKeys(!deleteOldKeys)} name="deleteOldKeys" color="primary" />
              }
              label="Удалить все переводы"
            />
            <FormHelperText color="warning">
              Будут удалены все переводы для выбранного проекта для всех языков. Будьте внимательны
            </FormHelperText>

            <FormControlLabel
              style={{ marginTop: 18 }}
              control={<Switch checked={doBackup} onChange={() => setDoBackup(!doBackup)} name="doBackup" color="primary" />}
              label="Сдеать Backup"
            />
            <FormHelperText color="warning">
              Будет создана копия всех строк, для данного проекта на определенное время чтобы была возможность отката
            </FormHelperText>

            <label className={classes.uploadLabel} style={{ cursor: 'pointer' }}>
              Выберите файл с переводом
              <input style={{ display: 'none' }} accept="application/js" type="file" ref={fileInput} onChange={handleFile} />
            </label>
            <FormHelperText>
              Название файла должно быть <strong>en.json</strong> или <strong>ru.json</strong> или <strong>fr.json</strong>
              <br />
              <strong>Нельзя использовать точку в названии ключа</strong>
            </FormHelperText>
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Box>
  );
};

export default ImportTranslation;
