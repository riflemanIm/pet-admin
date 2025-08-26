import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { Box, TextField } from '@mui/material';

import { useMedicalBrandDispatch, useMedicalBrandState, actions } from '../../context/MedicalBrandContext';

import useForm from '../../hooks/useForm';
import validate, { MedicalBrandError } from './validation';
import { MedicalBrandDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import UploadImageButton from '../../components/Common/uploadImageButton';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const MedicalBrandEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useMedicalBrandDispatch();
  const { current } = useMedicalBrandState();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      actions.doFind(Number(id))(dispatch);
    }
  }, [id]);

  useEffect(() => {
    if (current && id) {
      setValues({
        ...current
      });
    }
  }, [current, id]);

  const createData = () => {
    actions.doCreate(
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/medical_brand/list');
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
        navigate('/medical_brand/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleGenericChange, handleChange, handleSubmit, setValues } = useForm<MedicalBrandDto, MedicalBrandError>(
    id ? updateData : createData,
    validate
  );

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        <TextField
          variant="outlined"
          value={values?.title || ''}
          name="title"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALBRAND.FIELDS.title') ?? ''}
          label={t('MEDICALBRAND.FIELDS.title')}
          type="text"
          fullWidth
          required
          error={errors?.title != null}
          helperText={errors?.title != null && errors?.title}
        />
        <TextField
          variant="outlined"
          value={values?.email || ''}
          name="email"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALBRAND.FIELDS.email') ?? ''}
          label={t('MEDICALBRAND.FIELDS.email')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.phone || ''}
          name="phone"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALBRAND.FIELDS.phone') ?? ''}
          label={t('MEDICALBRAND.FIELDS.phone')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.code || ''}
          name="code"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALBRAND.FIELDS.code') ?? ''}
          label={t('MEDICALBRAND.FIELDS.code')}
          type="text"
          fullWidth
          required
          error={errors?.code != null}
          helperText={errors?.code != null && errors?.code}
        />
        <UploadImageButton
          icon={values.logo}
          accept="image/png,image/jpeg"
          maxHeight={610}
          maxWidth={610}
          onChange={(newValue: string) => handleGenericChange('logo', newValue)}
          onDelete={() => handleGenericChange('logo', '')}
        />
        <EditorButtons
          width={600}
          onCancel={() => navigate('/medical_brand/list')}
          submitDisabled={!isEmpty(errors)}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default MedicalBrandEditor;
