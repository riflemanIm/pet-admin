import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, TextField, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

import useStyles from './styles';

import { useClinicDispatch, useClinicState, actions } from '../../context/ClinicContext';

// Icons
import { Edit, PermMedia } from '@mui/icons-material';

import useForm from '../../hooks/useForm';
import validate, { ClinicError } from './validation';
import Gallery from './Gallery';
import isEmpty from '../../helpers/isEmpty';
import { cleanPhoneValue } from '../../helpers/numberFormat';
import { ClinicDto, ClinicImageDto } from '../../helpers/dto';
import { useUserState } from '../../context/UserContext';
import { isNetRole } from '../../helpers/enums';
import { useTranslation } from 'react-i18next';
import { EditorButtons } from '../../components/Common/editorButtons';

const EditClinic = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    currentUser: { role }
  } = useUserState();

  const dispatch = useClinicDispatch();
  const { current, services, medicalBrands, medicalNets, clientDatabases, images } = useClinicState();

  const [tab, setTab] = React.useState(0);
  const handleChangeTab = (event: React.SyntheticEvent<any>, newValue: number) => {
    setTab(newValue);
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(errorMessage?: string) {
    enqueueSnackbar(errorMessage || t('COMMON.RECORDSAVED'), {
      variant: errorMessage ? 'warning' : 'success'
    });
  }

  useEffect(() => {
    if (id) {
      actions
        .doFind(Number(id))(dispatch)
        .then(() => {
          if (!isNetRole(role)) {
            actions
              .doReferenceLists()(dispatch)
              .then(() => console.log(medicalBrands, values.medicalBrandId));
          }
        });
    }
  }, [id]);

  const saveData = () => {
    actions.doUpdate(
      Number(id),
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/clinic/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };
  const addImages = (data: ClinicImageDto[]) => {
    if (!isEmpty(data)) {
      actions.doAddImages(data, sendNotification)(dispatch);
    }
  };

  const removeImage = (id: number) => {
    actions.doRemoveImage(id, sendNotification)(dispatch);
  };
  const { values, errors, handleChange, handleChangeSelect, handleCheckChange, handlePhoneChange, handleSubmit, setValues } = useForm<
    ClinicDto,
    ClinicError
  >(saveData, validate);

  useEffect(() => {
    if (current)
      setValues({
        ...current
      });
  }, [current, id]);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={1200}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={tab}
          onChange={handleChangeTab}
          aria-label="full width tabs example"
          sx={{ marginBottom: '35px' }}
        >
          <Tab label={t('CLINIC.DATATAB')} icon={<Edit />} className={classes.icon} />
          <Tab label={t('CLINIC.PHOTOTAB')} icon={<PermMedia />} className={classes.icon} />
        </Tabs>

        {tab === 0 && (
          <React.Fragment>
            <TextField
              variant="outlined"
              value={values?.code || ''}
              name="code"
              onChange={handleChange}
              disabled={isNetRole(role)}
              style={{ marginBottom: 35 }}
              placeholder={t('CLINIC.FIELDS.code') ?? ''}
              label={t('CLINIC.FIELDS.code')}
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
              placeholder={t('CLINIC.FIELDS.title') ?? ''}
              label={t('CLINIC.FIELDS.title')}
              type="text"
              fullWidth
              required
              error={errors?.title != null}
              helperText={errors?.title != null && errors?.title}
            />
            <FormControlLabel
              style={{ marginBottom: 35 }}
              control={<Checkbox checked={values?.isVisible ?? true} onChange={handleCheckChange} name="isVisible" color="primary" />}
              label={t('CLINIC.FIELDS.isVisible')}
            />
            <TextField
              variant="outlined"
              value={values?.url || ''}
              name="url"
              onChange={handleChange}
              style={{ marginBottom: 35 }}
              placeholder={t('CLINIC.FIELDS.url') ?? ''}
              label={t('CLINIC.FIELDS.url')}
              type="text"
              fullWidth
              required
              error={errors?.url != null}
              helperText={errors?.url != null && errors?.url}
            />
            <TextField
              variant="outlined"
              value={values?.postalAddress || ''}
              name="postalAddress"
              onChange={handleChange}
              style={{ marginBottom: 35 }}
              placeholder={t('CLINIC.FIELDS.postalAddress') ?? ''}
              label={t('CLINIC.FIELDS.postalAddress')}
              multiline
              minRows={4}
              type="text"
              fullWidth
              required
              error={errors?.postalAddress != null}
              helperText={errors?.postalAddress != null && errors?.postalAddress}
            />
            <TextField
              variant="outlined"
              value={values?.email || ''}
              name="email"
              onChange={handleChange}
              style={{ marginBottom: 35 }}
              placeholder={t('CLINIC.FIELDS.email') ?? ''}
              label={t('CLINIC.FIELDS.email')}
              type="text"
              fullWidth
              error={errors?.email != null}
              helperText={errors?.email != null && errors?.email}
            />
            <InputMask mask="+7 (999) 999 9999" value={values?.phone || ''} onChange={handlePhoneChange}>
              <TextField
                name="phone"
                variant="outlined"
                style={{ marginBottom: 35 }}
                label={t('CLINIC.FIELDS.phone')}
                type="tel"
                fullWidth
                required
                error={errors?.phone != null}
                helperText={errors?.phone != null && errors?.phone}
              />
            </InputMask>
            <FormControlLabel
              style={{ marginBottom: 35 }}
              control={
                <Checkbox
                  checked={values?.isAnonymousVisitsProhibited || false}
                  onChange={handleCheckChange}
                  name="isAnonymousVisitsProhibited"
                  color="primary"
                />
              }
              label={t('CLINIC.FIELDS.isAnonymousVisitsProhibited')}
            />
            {!isNetRole(role) && (
              <React.Fragment>
                <FormControl variant="outlined" style={{ marginBottom: 35, marginRight: 8 }} fullWidth>
                  <InputLabel id="id-client_database-label">{t('CLINIC.FIELDS.clientDatabaseId')}</InputLabel>
                  <Select
                    name="clientDatabaseId"
                    labelId="id-client_database-label"
                    id="id-client_database-select"
                    label={t('CLINIC.FIELDS.clientDatabaseId')}
                    onChange={handleChangeSelect}
                    value={values?.clientDatabaseId || ''}
                  >
                    {clientDatabases.map((item) => (
                      <MenuItem value={item.clientDatabaseId} key={item.clientDatabaseId}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ marginBottom: 35, marginRight: 8 }} fullWidth>
                  <InputLabel id="id-medical_net-label">{t('CLINIC.FIELDS.defaultMedicalNetId')}</InputLabel>
                  <Select
                    name="defaultMedicalNetId"
                    labelId="id-medical_net-label"
                    id="id-medical_net-select"
                    label={t('CLINIC.FIELDS.defaultMedicalNetId')}
                    onChange={handleChangeSelect}
                    value={values?.defaultMedicalNetId || ''}
                  >
                    {medicalNets.map((item) => (
                      <MenuItem value={item.medicalNetId} key={item.medicalNetId}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ marginBottom: 35, marginRight: 8 }} fullWidth>
                  <InputLabel id="id-services-label">{t('CLINIC.FIELDS.clientServiceId')}</InputLabel>
                  <Select
                    name="clientServiceId"
                    labelId="id-services-label"
                    id="id-services-select"
                    label={t('CLINIC.FIELDS.clientServiceId')}
                    onChange={handleChangeSelect}
                    value={values?.clientServiceId || ''}
                  >
                    {services.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ marginBottom: 35, marginRight: 8 }} fullWidth>
                  <InputLabel id="id-medical_brand-label">{t('CLINIC.FIELDS.medicalBrandId')}</InputLabel>
                  <Select
                    name="medicalBrandId"
                    labelId="id-medical_brand-label"
                    id="id-medical_brand-select"
                    label={t('CLINIC.FIELDS.medicalBrandId')}
                    onChange={handleChangeSelect}
                    value={values?.medicalBrandId || ''}
                  >
                    {medicalBrands.map((item) => (
                      <MenuItem value={item.medicalBrandId} key={item.medicalBrandId}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </React.Fragment>
            )}
            <EditorButtons onCancel={() => navigate('/clinic/list')} submitDisabled={!isEmpty(errors)} onSubmit={handleSubmit} />
          </React.Fragment>
        )}
        {tab === 1 && <Gallery imgs={images} addImages={addImages} removeImage={removeImage} clinicId={Number(id)} />}
      </Box>
    </Box>
  );
};

export default EditClinic;
