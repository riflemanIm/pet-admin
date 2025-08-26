import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, FormControlLabel, Typography, Switch } from '@mui/material';
import useStyles from './styles';

import { useTranslationDispatch, useTranslationState, actions } from '../../context/TranslationContext';

import useForm from '../../hooks/useForm';
import validate, { TranslationsError } from './validation';
import { ArrowRightAlt as ArrowRight } from '@mui/icons-material';

import { useUserState } from '../../context/UserContext';
import capitalizeFirst from '../../helpers/capitalize';
import { AccountRole } from '../../helpers/enums';
import { TranslationCheckIndex, TranslationsDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const EditTranslation = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const translationDispatch = useTranslationDispatch();
  const { current } = useTranslationState();
  const {
    currentUser: { userId, role }
  } = useUserState();

  const [checked, setChecked] = React.useState({
    checkedRu: role === AccountRole.interpreter,
    checkedEn: role === AccountRole.interpreter,
    checkedFr: role === AccountRole.interpreter
  });
  const handleChecked = (lang: string) => {
    const newChecked = {} as Record<TranslationCheckIndex, boolean>;
    newChecked[`checked${capitalizeFirst(lang)}` as TranslationCheckIndex] =
      !checked[`checked${capitalizeFirst(lang)}` as TranslationCheckIndex];
    setChecked({ ...checked, ...newChecked });
  };

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      actions.doFind(Number(id))(translationDispatch);
    }
  }, [id]);

  useEffect(() => {
    if (current) {
      setValues({ ...current });
    }
  }, [current, id]);

  const saveData = () => {
    actions.doUpdate(
      Number(id),
      {
        langRu: values.langRu,
        langEn: values.langEn,
        langFr: values.langFr,
        ...checked,
        accountId: userId
      },
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/translation/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(translationDispatch);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm<TranslationsDto, TranslationsError>(saveData, validate);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        <Typography color="primary" variant={'h6'} style={{ marginBottom: 35 }}>
          {values.gkey} <ArrowRight className={classes.iconTitleArrow} />
          {values.tkey}
        </Typography>

        <Typography variant={'body2'}>Russian</Typography>

        <TextField
          variant="outlined"
          value={values.langRu}
          name="langRu"
          onChange={handleChange}
          placeholder={`${values.gkey} ${values.tkey}`}
          multiline
          minRows={4}
          fullWidth
          required
          error={errors?.langRu != null}
          helperText={errors?.langRu != null && errors?.langRu}
        />
        {role === AccountRole.interpreter && (
          <FormControlLabel
            control={<Switch checked={checked.checkedRu} onChange={() => handleChecked('ru')} value={true} color="primary" />}
            label={
              <Typography variant="h6" color="textSecondary">
                Verified
              </Typography>
            }
          />
        )}

        <Typography variant={'body2'} style={{ marginTop: 35 }}>
          English
        </Typography>
        <TextField
          variant="outlined"
          value={values.langEn}
          name="langEn"
          onChange={handleChange}
          placeholder={`${values.gkey} ${values.tkey}`}
          multiline
          minRows={4}
          fullWidth
          required
          error={errors?.langEn != null}
          helperText={errors?.langEn != null && errors?.langEn}
        />
        {role === AccountRole.interpreter && (
          <FormControlLabel
            control={<Switch checked={checked.checkedEn} onChange={() => handleChecked('en')} value={true} color="primary" />}
            label={
              <Typography variant="h6" color="textSecondary">
                Verified
              </Typography>
            }
          />
        )}

        <Typography variant={'body2'} style={{ marginTop: 35 }}>
          French
        </Typography>
        <TextField
          variant="outlined"
          value={values.langFr}
          name="langFr"
          onChange={handleChange}
          placeholder={`${values.gkey} ${values.tkey}`}
          multiline
          minRows={4}
          fullWidth
          required
          error={errors?.langFr != null}
          helperText={errors?.langFr != null && errors?.langFr}
        />
        {role === AccountRole.interpreter && (
          <FormControlLabel
            control={<Switch checked={checked.checkedFr} onChange={() => handleChecked('fr')} value={true} color="primary" />}
            label={
              <Typography variant="h6" color="textSecondary">
                Verified
              </Typography>
            }
          />
        )}
        <EditorButtons onCancel={() => navigate('/translation/list')} submitDisabled={!isEmpty(errors)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default EditTranslation;
