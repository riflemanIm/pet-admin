import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Checkbox, FormControlLabel } from '@mui/material';

import { useSnackbar } from 'notistack';

import useForm from '../../hooks/useForm';
import validate, { RateLimitError } from './validation';
import { useUserState } from '../../context/UserContext';
import { actions, useRateLimitDispatch, useRateLimitState } from '../../context/RateLimitContext';
import { RateLimitDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const RateLimitEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useRateLimitDispatch();
  const { current } = useRateLimitState();
  const {
    currentUser: { role }
  } = useUserState();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      actions.doFind(Number(id))(dispatch);
    }
  }, [id]);

  useEffect(() => {
    if (id && current) {
      setValues({
        ...current
      });
    }
  }, [current, id]);

  const updateData = () => {
    actions.doUpdate(
      Number(id),
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/rateLimit/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const createData = () => {
    actions.doCreate(
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/rateLimit/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleChange, handleCheckChange, handleSubmit, setValues } = useForm<RateLimitDto, RateLimitError>(
    id ? updateData : createData,
    validate
  );

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        <TextField
          variant="outlined"
          value={values?.routePath ?? ''}
          name="routePath"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('RATELIMIT.FIELDS.routePath') ?? ''}
          label={t('RATELIMIT.FIELDS.routePath')}
          type="text"
          fullWidth
          required
          error={errors?.routePath != null}
          helperText={errors?.routePath != null && errors?.routePath}
        />
        <TextField
          variant="outlined"
          value={values?.windowMs || ''}
          name="windowMs"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('RATELIMIT.FIELDS.windowMs') ?? ''}
          label={t('RATELIMIT.FIELDS.windowMs')}
          type="text"
          fullWidth
          required
          error={errors?.routePath != null}
          helperText={errors?.routePath != null && errors?.routePath}
        />
        <TextField
          variant="outlined"
          value={values?.rateLimit || ''}
          name="rateLimit"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('RATELIMIT.FIELDS.rateLimit') ?? ''}
          label={t('RATELIMIT.FIELDS.rateLimit')}
          type="text"
          required
          fullWidth
          error={errors?.rateLimit != null}
          helperText={errors?.rateLimit != null && errors?.rateLimit}
        />
        <TextField
          variant="outlined"
          value={values?.limitReason || ''}
          name="limitReason"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('RATELIMIT.FIELDS.limitReason') ?? ''}
          label={t('RATELIMIT.FIELDS.limitReason')}
          type="text"
          multiline
          minRows={4}
          fullWidth
        />
        <FormControlLabel
          style={{ marginBottom: 35 }}
          control={<Checkbox checked={values?.isEnabled ?? true} onChange={handleCheckChange} name="isEnabled" color="primary" />}
          label={t('RATELIMIT.FIELDS.isEnabled')}
        />
        <EditorButtons width={600} onCancel={() => navigate('/rateLimit/list')} submitDisabled={!isEmpty(errors)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default RateLimitEditor;
