import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import InputMask from 'react-input-mask';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

import { useManagementDispatch, useManagementState, actions } from '../../context/ManagementContext';

import isEmpty from '../../helpers/isEmpty';
import useForm from '../../hooks/useForm';
import validate, { UserError } from './validation';
import { cleanPhoneValue } from '../../helpers/numberFormat';
import { UserDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import { Gender, listEnums } from '../../helpers/enums';
import MuiUIPicker from '../../components/MUIDatePicker';
import dayjs from 'dayjs';
import { EditorButtons } from '../../components/Common/editorButtons';

const EditUserNet = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams();
  const managementDispatch = useManagementDispatch();
  const { current } = useManagementState();

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (id) {
      actions.doFind(Number(id))(managementDispatch);
    }
  }, [id]);

  useEffect(() => {
    if (!current) return;
    setValues({
      ...current
    });
  }, [current, id]);

  const saveData = () => {
    const birthDate = dayjs(values.birthDate).format('YYYY-MM-DD');
    const data = { ...values, birthDate };
    delete data.password;
    actions.doUpdate(
      Number(id),
      data,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/user/list');
      },
      (errorMessage) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(managementDispatch);
  };

  const { values, errors, handleGenericChange, handleChange, handleChangeSelect, handlePhoneChange, handleSubmit, setValues } = useForm<
    UserDto,
    UserError
  >(saveData, validate);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        <TextField
          variant="outlined"
          value={(!isEmpty(values) && values.firstName) || ''}
          name="firstName"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          label={t('USER.FIELDS.firstName')}
          placeholder={t('USER.FIELDS.firstName') ?? ''}
          type="text"
          fullWidth
          required
          error={errors?.firstName != null}
          helperText={errors?.firstName != null && errors?.firstName}
        />
        <TextField
          variant="outlined"
          value={values.middleName || ''}
          name="middleName"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          label={t('USER.FIELDS.middleName')}
          placeholder={t('USER.FIELDS.middleName') ?? ''}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values.lastName || ''}
          name="lastName"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          label={t('USER.FIELDS.lastName')}
          placeholder={t('USER.FIELDS.lastName') ?? ''}
          type="text"
          fullWidth
          required
          error={errors?.lastName != null}
          helperText={errors?.lastName != null && errors?.lastName}
        />
        <MuiUIPicker
          label={t('USER.FIELDS.birthDate')}
          value={values?.birthDate != null ? values?.birthDate : null}
          handleChange={(value) => handleGenericChange('birthDate', value)}
          required={true}
          errorText={errors?.birthDate}
        />
        <FormControl variant="outlined" margin="normal" fullWidth style={{ marginBottom: 35 }}>
          <InputLabel id="demo-simple-select-outlined-label">{t('USER.FIELDS.gender')}</InputLabel>
          <Select name="gender" value={(values.gender || '').toUpperCase()} onChange={handleChangeSelect} label={t('USER.FIELDS.gender')}>
            {listEnums<Gender>(Gender, t, 'ENUMS.Gender').map((it) => (
              <MenuItem key={it.value} value={it.value}>
                {it.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          value={values?.email || ''}
          name="email"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          label={t('USER.FIELDS.email')}
          placeholder={t('USER.FIELDS.email') ?? ''}
          type="text"
          fullWidth
          error={errors?.email != null}
          helperText={errors?.email != null && errors?.email}
        />
        <InputMask mask="+7 (999) 999 9999" value={values?.phone || ''} onChange={handlePhoneChange}>
          <TextField
            name="phone"
            variant="outlined"
            label={t('USER.FIELDS.phone')}
            placeholder={t('USER.FIELDS.phone') ?? ''}
            style={{ marginBottom: 35 }}
            type="tel"
            fullWidth
            error={errors?.phone != null}
            helperText={errors?.phone != null && errors?.phone}
          />
        </InputMask>

        <EditorButtons onCancel={() => navigate('/user/list')} submitDisabled={!isEmpty(errors)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default EditUserNet;
