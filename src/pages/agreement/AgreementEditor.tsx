import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { useSnackbar } from 'notistack';

import useForm from '../../hooks/useForm';
import validate, { AgreementError } from './validation';
import { useUserState } from '../../context/UserContext';
import { isNetRole } from '../../helpers/enums';
import { actions, useAgreementDispatch, useAgreementState } from '../../context/AgreementContext';
import { AgreementDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const AgreementEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useAgreementDispatch();
  const { medicalNets, agreementTypes, current } = useAgreementState();
  const {
    currentUser: { role, medicalNetId }
  } = useUserState();

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (id) {
      actions
        .doFind(Number(id))(dispatch)
        .then(() => actions.doReferenceLists()(dispatch));
    } else {
      actions.doReferenceLists()(dispatch);
    }
  }, [id]);

  useEffect(() => {
    if (!current || !id) return;
    setValues({
      ...current
    });
  }, [current, id]);

  const createData = () => {
    actions.doCreate(
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/agreement/list');
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
        navigate('/agreement/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleChange, handleChangeSelect, handleSubmit, setValues } = useForm<AgreementDto, AgreementError>(
    id ? updateData : createData,
    validate
  );

  useEffect(() => {
    if (!id && isNetRole(role)) {
      setValues({
        ...values,
        medicalNetId
      });
    }
  }, [id, medicalNetId, role]);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={800}>
        {!isNetRole(role) && (
          <FormControl variant="outlined" style={{ marginBottom: 25, marginRight: 8 }} fullWidth>
            <InputLabel id="id-medicalnet-label">{t('AGREEMENT.FIELDS.medicalNetId')}</InputLabel>
            <Select
              name="medicalNetId"
              labelId="id-medicalnet-label"
              id="id-medicalnet-select"
              label={t('AGREEMENT.FIELDS.medicalNetId')}
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
        <FormControl variant="outlined" style={{ marginBottom: 25, marginRight: 8 }} fullWidth>
          <InputLabel id="id-agreementtype-label">{t('AGREEMENT.FIELDS.agreementTypeId')}</InputLabel>
          <Select
            name="agreementTypeId"
            labelId="id-agreementtype-label"
            id="id-agreementtype-select"
            label={t('AGREEMENT.FIELDS.agreementTypeId')}
            onChange={handleChangeSelect}
            value={values?.agreementTypeId || ''}
          >
            {agreementTypes.map((item) => (
              <MenuItem value={item.agreementTypeId} key={item.agreementTypeId}>
                {item.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: 25 }}>
          <InputLabel id="nt-label">{t('AGREEMENT.FIELDS.platform')}</InputLabel>
          <Select
            labelId="nt-label"
            label={t('AGREEMENT.FIELDS.platform')}
            name="platform"
            onChange={handleChangeSelect}
            value={values?.platform || ''}
          >
            {['-', 'ios', 'android', 'web'].map((k) => (
              <MenuItem key={k} value={k === '-' ? '' : k}>
                {k}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          value={values?.langCode || ''}
          name="langCode"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('AGREEMENT.FIELDS.langCode') ?? ''}
          label={t('AGREEMENT.FIELDS.langCode')}
          type="text"
          fullWidth
          required
          error={errors?.langCode != null}
          helperText={errors?.langCode != null && errors?.langCode}
        />
        <TextField
          variant="outlined"
          value={values?.description || ''}
          name="description"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('AGREEMENT.FIELDS.description') ?? ''}
          label={t('AGREEMENT.FIELDS.description')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.agreement || ''}
          name="agreement"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('AGREEMENT.FIELDS.agreement') ?? ''}
          label={t('AGREEMENT.FIELDS.agreement')}
          multiline
          minRows={4}
          type="text"
          required
          fullWidth
          error={errors?.agreement != null}
          helperText={errors?.agreement != null && errors?.agreement}
        />
        <TextField
          variant="outlined"
          value={values?.sortOrder != null ? `${values?.sortOrder}` : ''}
          name="sortOrder"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('AGREEMENT.FIELDS.sortOrder') ?? ''}
          label={t('AGREEMENT.FIELDS.sortOrder')}
          type="text"
          fullWidth
        />
        <EditorButtons width={800} onCancel={() => navigate('/agreement/list')} submitDisabled={!isEmpty(errors)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default AgreementEditor;
