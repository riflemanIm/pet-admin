import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { Box, TextField } from '@mui/material';

import { useMedicalNetDispatch, useMedicalNetState, actions } from '../../context/MedicalNetContext';
import useForm from '../../hooks/useForm';
import validate, { MedicalNetError } from './validation';
import { MedicalNetDto } from '../../helpers/dto';
import { isNetRole } from '../../helpers/enums';
import { useUserState } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';
import isEmpty from '../../helpers/isEmpty';
import { EditorButtons } from '../../components/Common/editorButtons';

const MedicalNetEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    currentUser: { role }
  } = useUserState();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useMedicalNetDispatch();
  const { current } = useMedicalNetState();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (id) {
      actions.doFind(Number(id))(dispatch);
    }
  }, [id]);

  useEffect(() => {
    if (id && current)
      setValues({
        ...(current as MedicalNetDto)
      });
  }, [current, id]);

  const createData = () => {
    actions.doCreate(
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/medical_net/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const updateData = () => {
    actions.doUpdate(
      Number(id),
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/medical_net/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm<MedicalNetDto, MedicalNetError>(
    id ? updateData : createData,
    validate
  );

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        <TextField
          variant="outlined"
          value={values?.code || ''}
          name="code"
          disabled={isNetRole(role) && !!id}
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNET.FIELDS.code') ?? ''}
          label={t('MEDICALNET.FIELDS.code')}
          type="text"
          fullWidth
          required
          error={errors?.code != null}
          helperText={errors?.code != null && errors?.code}
        />
        <TextField
          variant="outlined"
          value={values?.title || ''}
          name="title"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNET.FIELDS.title') ?? ''}
          label={t('MEDICALNET.FIELDS.title')}
          type="text"
          fullWidth
          required
          error={errors?.title != null}
          helperText={errors?.title != null && errors?.title}
        />
        <TextField
          variant="outlined"
          name="appCode"
          value={values?.appCode || ''}
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNET.FIELDS.appCode') ?? ''}
          label={t('MEDICALNET.FIELDS.appCode')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.logo || ''}
          name="logo"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNET.FIELDS.logo') ?? ''}
          label={t('MEDICALNET.FIELDS.logo')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.license || ''}
          name="license"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNET.FIELDS.license') ?? ''}
          label={t('MEDICALNET.FIELDS.license')}
          type="text"
          fullWidth
          multiline
          minRows={3}
        />
        <TextField
          variant="outlined"
          value={values?.websiteUrl || ''}
          name="websiteUrl"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNET.FIELDS.websiteUrl') ?? ''}
          label={t('MEDICALNET.FIELDS.websiteUrl')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.notifyEmail || ''}
          name="notifyEmail"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNET.FIELDS.notifyEmail') ?? ''}
          label={t('MEDICALNET.FIELDS.notifyEmail')}
          type="text"
          fullWidth
          required
          error={errors?.notifyEmail != null}
          helperText={errors?.notifyEmail != null && errors?.notifyEmail}
        />
        <TextField
          variant="outlined"
          value={values?.notifyPhone || ''}
          name="notifyPhone"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNET.FIELDS.notifyPhone') ?? ''}
          label={t('MEDICALNET.FIELDS.notifyPhone')}
          type="text"
          fullWidth
          required
          error={errors?.notifyPhone != null}
          helperText={errors?.notifyPhone != null && errors?.notifyPhone}
        />
        <EditorButtons
          width={600}
          onCancel={() => navigate('/medical_net/list')}
          submitDisabled={!isEmpty(errors)}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default MedicalNetEditor;
