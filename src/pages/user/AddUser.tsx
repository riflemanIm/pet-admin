import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  OutlinedInput,
  IconButton,
  FormControl,
  InputLabel,
  InputAdornment,
  FormHelperText,
  Button,
  Typography,
  StepProps,
  Stack
} from '@mui/material';

import { VisibilityOff as VisibilityOffIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import useStyles from './styles';
import config from '../../config';

import Widget from '../../components/Widget';

import { useManagementDispatch, useManagementState, actions } from '../../context/ManagementContext';
import { extractExtensionFrom, uploadToServer, deleteAvararServer } from '../../helpers/file';
import isEmpty from '../../helpers/isEmpty';
import useForm from '../../hooks/useForm';
import validate from './validation';
import { cleanPhoneValue } from '../../helpers/numberFormat';
import { AccountRole, Gender, getEnumName, listEnums } from '../../helpers/enums';

import { useTranslation } from 'react-i18next';
import MuiUIPicker from '../../components/MUIDatePicker';
import dayjs from 'dayjs';
import { useUserState } from '../../context/UserContext';

function getSteps() {
  return ['Создать аккаунт', 'Персональная информация'];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return 'Создать аккаунт';
    case 1:
      return 'Персональная информация';
    default:
      return '';
  }
}

const AddUser = (): JSX.Element => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [isLoadingImg, setIsLoadingImg] = React.useState(false);
  const [visibilePass, setVisibilePass] = useState(false);
  const { current } = useManagementState();
  const userId = current?.userId;
  const { token } = useUserState();

  console.log('activeStep', activeStep, 'userId', userId);

  const fileInput = React.useRef(null);
  const steps = getSteps();
  const classes = useStyles();

  const deleteOneImage = async () => {
    if (userId) {
      setIsLoadingImg(true);
      await deleteAvararServer(`/users/upload-avatar/${userId}`)
        .then(() => {
          setIsLoadingImg(false);
        })
        .catch((e) => {
          console.log('delete img err', e);
          setIsLoadingImg(false);
        });
    }
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    const filedata = event.target.files[0];
    const filename = filedata.name;
    const extension = (filename && extractExtensionFrom(filename)) || '';
    if (filename != null && ['jpg', 'jpeg'].includes(extension.toLowerCase())) {
      const filename = `${userId}.${extension}`;

      setIsLoadingImg(true);
      await uploadToServer(`/user/photo/${userId}`, {
        filedata,
        filename
      })
        .then((res) => {
          setIsLoadingImg(false);
          console.log('res', res);
        })
        .catch((e) => {
          setIsLoadingImg(false);
          console.log('ee', e);
        });
    } else {
      sendNotification('Можно загружать только файлы с расширением .JPG, .JPEG');
    }
    return null;
  };

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(errorMessage?: string) {
    enqueueSnackbar(errorMessage || t('COMMON.RECORDSAVED'), {
      variant: errorMessage ? 'warning' : 'success'
    });
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const managementDispatch = useManagementDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    console.log('------- activeStep -----------', activeStep);
    if (activeStep === 0 && values.email !== '' && values.password !== '') {
      actions.doCreate(
        {
          email: values.email,
          password: values.password,
          isActive: false,
          userType: AccountRole.patient
        },
        () => {
          enqueueSnackbar(t('COMMON.RECORDSAVED'), {
            variant: 'success'
          });
        },
        (errorMessage) => {
          enqueueSnackbar(errorMessage, {
            variant: 'warning'
          });
          handleBack();
        }
      )(managementDispatch);
    }
    if (activeStep === 1 && userId != null) {
      actions.doUpdate(
        userId,
        values,
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
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const saveData = () => {
    const birthDate = dayjs(values.birthDate).format('YYYY-MM-DD');
    const data = { ...values, birthDate };
    if (userId)
      actions.doUpdate(
        userId,
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

  const { values, errors, handleGenericChange, handleChange, handleChangeSelect, handlePhoneChange } = useForm(saveData, validate);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validRoles = [];
  for (let role = AccountRole.unknown; role <= AccountRole.netMarketer; role++) validRoles.push(role);

  return (
    <Stack spacing={3}>
      <Widget>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: StepProps = {};
            const labelProps = {};
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps} classes={{ completed: classes.stepCompleted }}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Widget>

      <Widget>
        <Box display="flex" justifyContent="center" flexDirection="row">
          <Box display="flex" flexDirection="column" width={600}>
            <Typography variant="h5" style={{ marginBottom: 30 }}>
              {getStepContent(activeStep)}
            </Typography>
            {activeStep === 0 ? (
              <>
                <FormControl variant="outlined" margin="normal" fullWidth style={{ marginBottom: 35 }}>
                  <InputLabel id="id-role-label">Роль</InputLabel>
                  <Select
                    name="userType"
                    labelId="id-role-label"
                    value={values.userType || AccountRole.unknown}
                    onChange={handleChangeSelect}
                    label="Роль"
                  >
                    {validRoles.map((role) => (
                      <MenuItem value={role} key={role}>
                        {getEnumName(AccountRole, role, t, 'ENUMS.AccountRole')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  variant="outlined"
                  value={values?.email || ''}
                  name="email"
                  autoComplete="off"
                  onChange={handleChange}
                  style={{ marginBottom: 35 }}
                  label={t('USER.FIELDS.email')}
                  placeholder={t('USER.FIELDS.email') ?? ''}
                  type="text"
                  fullWidth
                />
                <InputMask mask="+7 (999) 999 9999" value={values?.phone || ''} onChange={handlePhoneChange}>
                  <TextField
                    name="phone"
                    variant="outlined"
                    style={{ marginBottom: 35 }}
                    label={t('USER.FIELDS.phone')}
                    type="tel"
                    fullWidth
                  />
                </InputMask>
                <FormControl variant="outlined" style={{ marginBottom: 35 }} fullWidth>
                  <InputLabel htmlFor="outlined-adornment-password">{t('USER.FIELDS.password')}</InputLabel>
                  <OutlinedInput
                    name="password"
                    autoComplete="off"
                    value={values.password || ''}
                    onChange={handleChange}
                    label={t('USER.FIELDS.password')}
                    type={visibilePass ? 'text' : 'password'}
                    required
                    error={errors?.password != null}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setVisibilePass(!visibilePass)}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {!visibilePass ? <VisibilityOffIcon color="error" /> : <VisibilityIcon color="primary" />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{errors?.password != null && errors?.password}</FormHelperText>
                </FormControl>
              </>
            ) : activeStep === 1 && userId != null ? (
              <>
                <Typography>Фото:</Typography>
                <div className={classes.galleryWrap}>
                  <div className={classes.imgWrap}>
                    {isLoadingImg ? (
                      <CircularProgress size={18} />
                    ) : (
                      <>
                        <span className={classes.deleteImageX} onClick={() => deleteOneImage()} role="button">
                          ×
                        </span>
                        <img src={`${config.baseURLApi}/user/photo/${userId}?token=${token}`} alt="" height={'100%'} />
                      </>
                    )}
                  </div>
                </div>
                <label className={classes.uploadLabel} style={{ cursor: 'pointer' }}>
                  {'Upload an image'}
                  <input style={{ display: 'none' }} accept="image/jpeg" type="file" ref={fileInput} onChange={handleFile} />
                </label>
                <Typography variant="subtitle2" style={{ marginBottom: 35 }}>
                  .JPG, .JPEG
                </Typography>
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
                  <Select
                    name="gender"
                    value={values.gender != null && values.gender}
                    onChange={handleChangeSelect}
                    label={t('USER.FIELDS.gender')}
                  >
                    {listEnums<Gender>(Gender, t, 'ENUMS.Gender').map((it) => (
                      <MenuItem key={it.value} value={it.value}>
                        {it.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            ) : null}
            <div>
              <div>
                {activeStep === 0 ? (
                  <Box display="flex" justifyContent={'flex-end'}>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                      Далее
                    </Button>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent={'space-between'}>
                    <Button onClick={handleBack} variant={'outlined'} color={'primary'}>
                      Назад
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleNext}>
                      {activeStep === steps.length - 1 ? t('COMMON.SAVE') : 'Далее'}
                    </Button>
                  </Box>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Widget>
    </Stack>
  );
};

export default AddUser;
