import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

import { useSnackbar } from 'notistack';

import useForm from '../../hooks/useForm';
import validate, { WebFormError } from './validation';
import { useUserState } from '../../context/UserContext';
import { isNetRole } from '../../helpers/enums';
import { WebFormDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import { actions, useWebFormDispatch, useWebFormState } from '../../context/WebFormContext';
import { WebFormControl } from './enums';
import UploadImageButton from '../../components/Common/uploadImageButton';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const WebFormEdititor = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useWebFormDispatch();
  const { medicalNets, current } = useWebFormState();
  const {
    currentUser: { role }
  } = useUserState();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      actions
        .doFind(Number(id))(dispatch)
        .then(() => {
          actions.doReferenceLists()(dispatch);
        });
    } else {
      actions.doReferenceLists()(dispatch);
    }
  }, [id]);

  useEffect(() => {
    if (!current) return;
    setValues({
      ...current
    });
  }, [current, id]);

  const updateData = () => {
    actions.doUpdate(
      Number(id),
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/webForm/list');
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
        navigate('/webForm/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleGenericChange, handleChange, handleChangeSelect, handleCheckChange, handleSubmit, setValues } = useForm<
    WebFormDto,
    WebFormError
  >(id ? updateData : createData, validate);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        {!isNetRole(role) && (
          <FormControl variant="outlined" style={{ marginBottom: 35, marginRight: 8 }} fullWidth>
            <InputLabel id="id-medicalnet-label">{t('WEBFORM.FIELDS.medicalNetId')}</InputLabel>
            <Select
              name="medicalNetId"
              labelId="id-medicalnet-label"
              id="id-medicalnet-select"
              label={t('WEBFORM.FIELDS.medicalNetId')}
              onChange={handleChangeSelect}
              value={values?.medicalNetId || ''}
            >
              {medicalNets.map((item) => (
                <MenuItem value={item.medicalNetId} key={item.medicalNetId}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          variant="outlined"
          value={values?.formUUID || ''}
          name="formUUID"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('WEBFORM.FIELDS.formUUID') ?? ''}
          label={t('WEBFORM.FIELDS.formUUID')}
          type="text"
          fullWidth
          required
          error={errors?.formUUID != null}
          helperText={errors?.formUUID != null && errors?.formUUID}
        />
        <TextField
          variant="outlined"
          value={values?.scope || ''}
          name="scope"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('WEBFORM.FIELDS.scope') ?? ''}
          label={t('WEBFORM.FIELDS.scope')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.title || ''}
          name="title"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('WEBFORM.FIELDS.title') ?? ''}
          label={t('WEBFORM.FIELDS.title')}
          type="text"
          fullWidth
          required
          error={errors?.title != null}
          helperText={errors?.title != null && errors?.title}
        />

        <UploadImageButton
          icon={values.icon}
          onDelete={() => handleGenericChange('icon', '')}
          onChange={(newValue: string) => handleGenericChange('icon', newValue)}
          accept="image/png,image/jpeg"
          maxWidth={610}
          maxHeight={610}
        />
        <FormControl fullWidth style={{ marginBottom: 35 }} required error={errors?.control != null}>
          <InputLabel id="nrt-label">{t('WEBFORM.FIELDS.control')}</InputLabel>
          <Select
            labelId="nrt-label"
            label={t('WEBFORM.FIELDS.control')}
            name="control"
            onChange={handleChangeSelect}
            value={values?.control || 'profile'}
          >
            {WebFormControl.map((k) => (
              <MenuItem key={k} value={k}>
                {k}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          value={values?.position || ''}
          name="position"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('WEBFORM.FIELDS.position') ?? ''}
          label={t('WEBFORM.FIELDS.position')}
          type="number"
          fullWidth
        />
        <FormControlLabel
          style={{ marginBottom: 35 }}
          control={<Checkbox checked={values?.isEnabled ?? true} onChange={handleCheckChange} name="isEnabled" color="primary" />}
          label={t('WEBFORM.FIELDS.isEnabled')}
        />
        <EditorButtons width={600} onCancel={() => navigate('/webForm/list')} submitDisabled={!isEmpty(errors)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default WebFormEdititor;
