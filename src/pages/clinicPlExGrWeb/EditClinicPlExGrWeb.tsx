import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import useForm from '../../hooks/useForm';
import validate, { ClinicPlExGrWebError } from './validation';
import { ClinicPlExGrWebDto, SpecializationDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import { actions, useClinicPlExGrWebDispatch, useClinicPlExGrWebState } from '../../context/ClinicPlExGrWebContext';
import { EditorButtons } from '../../components/Common/editorButtons';

const EditClinicPlExGrWeb = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clinicId, id } = useParams();

  const dispatch = useClinicPlExGrWebDispatch();
  const { current, specializations, saveLoading } = useClinicPlExGrWebState();

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
        navigate(`/clinic/${clinicId}/plExGrWeb`);
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, handleChangeSelect, handleSubmit, setValues } = useForm<ClinicPlExGrWebDto, ClinicPlExGrWebError>(saveData, validate);

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
          value={values?.code || ''}
          name="code"
          style={{ marginBottom: 35 }}
          placeholder={t('CLINICPLEXGRWEB.FIELDS.code') ?? ''}
          label={t('CLINICPLEXGRWEB.FIELDS.code')}
          type="text"
          fullWidth
          disabled
        />
        <FormControl variant="outlined" margin="normal" fullWidth style={{ marginBottom: 35 }}>
          <InputLabel id="demo-simple-select-outlined-label">{t('CLINICPLEXGRWEB.FIELDS.specializationId')}</InputLabel>
          <Select
            name="specializationId"
            value={values.specializationId || ''}
            onChange={handleChangeSelect}
            label={t('CLINICPLEXGRWEB.FIELDS.specializationId')}
          >
            {specializations.map((it: SpecializationDto) => (
              <MenuItem key={it.specializationId} value={it.specializationId}>
                {it.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <EditorButtons width={600} onCancel={() => navigate(`/clinic/${clinicId}/plExGrWeb`)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default EditClinicPlExGrWeb;
