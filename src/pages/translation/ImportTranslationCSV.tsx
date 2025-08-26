import React from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { Box, FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress, SelectChangeEvent } from '@mui/material';

import useStyles from './styles';

import config from '../../config';
import { useTranslationState, useTranslationDispatch, actions } from '../../context/TranslationContext';
import isEmpty from '../../helpers/isEmpty';
import { uploadToServer } from '../../helpers/file';

const ImportTranslationCSV = (): JSX.Element => {
  const classes = useStyles();
  const [isLoadingFile, setIsLoadingFile] = React.useState(false);
  const { filterVals } = useTranslationState();
  const [pname, setPName] = React.useState(!isEmpty(filterVals) ? filterVals.pname : 'mobimed_site');

  const fileInput = React.useRef(null);

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(errorMessage?: string) {
    enqueueSnackbar(errorMessage || 'Translation imported', {
      variant: errorMessage ? 'warning' : 'success'
    });
  }

  React.useEffect(() => {
    sendNotification(' Make sure the correct project is selected! ');
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
    if (filename != null && ['translation.csv'].includes(filename.toLowerCase())) {
      setIsLoadingFile(true);

      await uploadToServer(`/translations/csv/${pname}`, {
        filedata,
        filename
      })
        .then((res) => {
          setIsLoadingFile(false);
          sendNotification();
          console.log('res', res);
          setTimeout(() => {
            navigate('/translation/list');
          }, 1000);
        })
        .catch((e) => {
          setIsLoadingFile(false);
          console.log('ee', e.response);
          sendNotification(e.response);
        });
    } else {
      sendNotification('The file name should be translation.csv');
    }
    return null;
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        {!isLoadingFile ? (
          <>
            <FormControl variant="outlined" margin="dense" fullWidth>
              <InputLabel id="id-pname-label">Select project name:</InputLabel>
              <Select labelId="id-pname-label" id="id-pname-select" label="Select project name:" onChange={handlePName} value={pname}>
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

            <FormHelperText color="warning">
              All translations for the selected project for all languages will be deleted. be careful
            </FormHelperText>

            <label className={classes.uploadLabel} style={{ cursor: 'pointer' }}>
              Select file <strong>translation.csv</strong>
              <input style={{ display: 'none' }} accept="application/js" type="file" ref={fileInput} onChange={handleFile} />
            </label>
            <FormHelperText>
              The file name should be <strong>translation.csv</strong>
            </FormHelperText>
          </>
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Box>
  );
};

export default ImportTranslationCSV;
