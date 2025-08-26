import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import InputMask from 'react-input-mask';
import {
  Tabs,
  Tab,
  Box,
  Checkbox,
  Switch,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  OutlinedInput,
  IconButton,
  FormControl,
  FormControlLabel,
  InputLabel,
  InputAdornment,
  FormHelperText,
  Typography
} from '@mui/material';

import {
  VisibilityOff as VisibilityOffIcon,
  Visibility as VisibilityIcon,
  PersonOutline as PersonOutlineIcon,
  Lock as LockIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

import { useManagementDispatch, useManagementState, actions } from '../../context/ManagementContext';
import config from '../../config';

import isEmpty from '../../helpers/isEmpty';
import { extractExtensionFrom, uploadToServer, deleteAvararServer } from '../../helpers/file';

import useForm from '../../hooks/useForm';
import validate, { UserError } from './validation';
import { cleanPhoneValue } from '../../helpers/numberFormat';
import useStyles from './styles';
import { AccountRole, Gender, getEnumName, listEnums } from '../../helpers/enums';
import { UserDto } from '../../helpers/dto';

import { useTranslation } from 'react-i18next';
import MuiUIPicker from '../../components/MUIDatePicker';
import dayjs from 'dayjs';
import { useUserState } from '../../context/UserContext';
import { EditorButtons } from '../../components/Common/editorButtons';

const EditUser = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [visibilePass, setVisibilePass] = useState(false);

  const [editable, setEditable] = useState(false);
  const [isLoadingImg, setIsLoadingImg] = useState(false);

  const { id } = useParams();

  const fileInput = useRef(null);
  const handleChangeTab = (event: React.SyntheticEvent<any>, newValue: number) => {
    setTab(newValue);
  };
  const location = useLocation();
  const managementDispatch = useManagementDispatch();
  const { current } = useManagementState();
  const { token } = useUserState();

  const deleteOneImage = async () => {
    setIsLoadingImg(true);
    await deleteAvararServer(`/users/upload-avatar/${id}`)
      .then(() => {
        setIsLoadingImg(false);
      })
      .catch((e) => {
        console.log('delete img err', e);
        setIsLoadingImg(false);
      });
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    const filedata = event.target.files[0];
    const filename = filedata.name;
    const extension = (filename && extractExtensionFrom(filename)) || '';
    if (filename != null && ['jpg', 'jpeg'].includes(extension.toLowerCase())) {
      const filename = `${id}.${extension}`;

      setIsLoadingImg(true);
      await uploadToServer(`/user/photo/${id}`, {
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

  useEffect(() => {
    if (id) {
      actions.doFind(Number(id))(managementDispatch);
    }
  }, [id]);

  useEffect(() => {
    if (location.pathname.includes('edit')) {
      setEditable(true);
    }
  }, [location.pathname]);

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

  function handleUpdatePassword() {
    if (!values?.password) return;
    actions.doChangePassword(Number(id), values.password, sendNotification)(managementDispatch, navigate);
  }

  const { values, errors, handleGenericChange, handleChange, handleChangeSelect, handlePhoneChange, handleSubmit, setValues } = useForm<
    UserDto,
    UserError
  >(saveData, validate);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validRoles = [];
  for (let role = AccountRole.unknown; role <= AccountRole.netMarketer; role++) validRoles.push(role);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          value={tab}
          onChange={handleChangeTab}
          aria-label="full width tabs example"
          sx={{ marginBottom: '35px' }}
        >
          <Tab label="ACCOUNT" icon={<PersonOutlineIcon />} />
          <Tab label="CHANGE PASSWORD" icon={<LockIcon />} />
          <Tab label="SETTINGS" icon={<SettingsIcon />} disabled />
        </Tabs>
        {tab === 0 ? (
          <React.Fragment>
            <Typography variant="h5" style={{ marginBottom: 30 }}>
              Аккаунт
            </Typography>
            <FormControl variant="outlined" margin="normal" fullWidth style={{ marginBottom: 35 }}>
              <InputLabel id="id-role-label">{t('USER.FIELDS.userType')}</InputLabel>
              <Select
                name="userType"
                labelId="id-role-label"
                value={values.userType || AccountRole.unknown}
                onChange={handleChangeSelect}
                label={t('USER.FIELDS.userType')}
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
                label={t('USER.FIELDS.phone')}
                style={{ marginBottom: 35 }}
                type="tel"
                fullWidth
                required
                error={errors?.phone != null}
                helperText={errors?.phone != null && errors?.phone}
              />
            </InputMask>
            <Typography variant="h5" style={{ marginBottom: 35 }}>
              Персональная информация
            </Typography>
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
                    <img src={`${config.baseURLApi}/user/photo/${id}?token=${token}`} alt="" height={'100%'} />
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
                value={(values.gender || '').toUpperCase()}
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
          </React.Fragment>
        ) : tab === 1 ? (
          <React.Fragment>
            <FormControl variant="outlined" style={{ marginBottom: 35 }} fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
              <OutlinedInput
                name="password"
                autoComplete="off"
                value={values.password || ''}
                onChange={handleChange}
                label="Пароль"
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
          </React.Fragment>
        ) : tab === 2 ? (
          <React.Fragment>
            <Typography variant="h5" style={{ marginBottom: 35 }}>
              Settings
            </Typography>
            <FormControl variant="outlined" style={{ marginBottom: 35 }}>
              <Select labelId="demo-simple-select-outlined-label" id="demo-simple-select-outlined" value={10}>
                <MenuItem value={10}>English</MenuItem>
                <MenuItem value={20}>Admin</MenuItem>
                <MenuItem value={30}>Super Admin</MenuItem>
              </Select>
            </FormControl>
            <Typography>Communication:</Typography>
            <Box display="flex">
              <FormControlLabel control={<Checkbox checked name="checkedB" color="secondary" />} label="Email" />
              <FormControlLabel control={<Checkbox name="checkedB" color="secondary" />} label="Messages" />
              <FormControlLabel control={<Checkbox name="checkedB" color="secondary" />} label="Phone" />
            </Box>
            <Box display="flex" mt={2} alignItems={'center'}>
              <Typography>Email notification</Typography>
              <Switch color={'primary'} checked />
            </Box>
            <Box display="flex" mt={2} mb={2} alignItems={'center'}>
              <Typography>Send copy to personal email</Typography>
              <Switch color={'primary'} />
            </Box>
          </React.Fragment>
        ) : null}
        {editable && (
          <React.Fragment>
            {tab !== 1 ? (
              <EditorButtons
                onCancel={() => {
                  navigate('/user/list');
                }}
                submitDisabled={!isEmpty(errors)}
                onSubmit={handleSubmit}
              />
            ) : (
              <EditorButtons
                onCancel={() => {
                  navigate('/user/list');
                }}
                submitDisabled={values.password == null || errors.password != null}
                submitText="Сохранить пароль"
                onSubmit={handleUpdatePassword}
              />
            )}
          </React.Fragment>
        )}
      </Box>
    </Box>
  );
};

export default EditUser;
