import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import useForm from '../../hooks/useForm';
import validate, { ClinicSpecializationError } from './validation';
import { ClinicSpecializationDto, SpecializationDto } from '../../helpers/dto';
import { actions, useClinicSpecializationDispatch, useClinicSpecializationState } from '../../context/ClinicSpecializationContext';
import { useTranslation } from 'react-i18next';
import { EditorButtons } from '../../components/Common/editorButtons';

const EditClinicSpecialization = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clinicId, id } = useParams();

  const dispatch = useClinicSpecializationDispatch();
  const { current, specializations, saveLoading } = useClinicSpecializationState();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id && clinicId) {
      actions
        .doFind(Number(clinicId))(Number(id))(dispatch)
        .then(() => {
          actions.doReferenceLists()(dispatch);
        });
    }
  }, [saveLoading, id, clinicId]);

  const saveData = () => {
    actions.doUpdate(Number(clinicId))(
      Number(id),
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate(`/clinic/${clinicId}/specialization`);
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, handleChangeSelect, handleSubmit, setValues } = useForm<ClinicSpecializationDto, ClinicSpecializationError>(
    saveData,
    validate
  );

  useEffect(() => {
    if (current)
      setValues({
        ...current
      });
  }, [current, clinicId, id]);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        <TextField
          variant="outlined"
          value={values?.name || ''}
          name="name"
          style={{ marginBottom: 35 }}
          placeholder={t('CLINICSPECIALIZATION.FIELDS.name') ?? ''}
          label={t('CLINICSPECIALIZATION.FIELDS.name')}
          type="text"
          fullWidth
          disabled
        />
        <FormControl variant="outlined" margin="normal" fullWidth style={{ marginBottom: 35 }}>
          <InputLabel id="demo-simple-select-outlined-label">{t('CLINICSPECIALIZATION.FIELDS.specializationId')}</InputLabel>
          <Select
            name="specializationId"
            value={values.specializationId || ''}
            onChange={handleChangeSelect}
            label={t('CLINICSPECIALIZATION.FIELDS.specializationId')}
          >
            {specializations.map((it: SpecializationDto) => (
              <MenuItem key={it.specializationId} value={it.specializationId}>
                {it.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <EditorButtons width={600} onCancel={() => navigate(`/clinic/${clinicId}/specialization`)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default EditClinicSpecialization;
