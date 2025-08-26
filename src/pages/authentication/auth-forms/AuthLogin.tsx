import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import validate from '../validationLogin';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import FirebaseSocial from './FirebaseSocial';
import config from 'config';
import { loginUser, useUserDispatch } from 'context/UserContext';
import { useTranslation } from 'react-i18next';
import useForm from 'hooks/useForm';
import { CircularProgress, Fade } from '@mui/material';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorServer, setErrorServer] = useState<string>('');
  // global
  const userDispatch = useUserDispatch();

  useEffect(() => {
    setValues({
      login: config.auth.email,
      password: config.auth.password
    });
  }, []);

  const login = () => {
    loginUser(userDispatch, values.login, values.password, setIsLoading, setErrorServer, navigate);
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(login, validate);

  return (
    <>
      <Fade in={!!errorServer} style={!errorServer ? { display: 'none' } : { display: 'inline-block' }}>
        <Typography color="error" sx={{ textAlign: 'center' }}>
          {errorServer}
        </Typography>
      </Fade>

      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email-login">{t('SIGN.UP_EMPTY_EMAIL_OR_PHONE')}</InputLabel>
            <OutlinedInput
              name="login"
              type="email"
              value={values.login || ''}
              onChange={handleChange}
              placeholder={t('SIGN.UP_EMPTY_EMAIL_OR_PHONE') ?? ''}
              fullWidth
              required
              error={errors?.email != null}
            />
          </Stack>
          {errors.email && (
            <FormHelperText error id="standard-weight-helper-text-email-login">
              {errors.email}
            </FormHelperText>
          )}
        </Grid>
        <Grid size={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-login">Password</InputLabel>
            <OutlinedInput
              fullWidth
              error={Boolean(values.password && errors.password)}
              id="-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" color="secondary">
                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </IconButton>
                </InputAdornment>
              }
              placeholder="Enter password"
            />
          </Stack>
          {values.password && errors.password && (
            <FormHelperText error id="standard-weight-helper-text-password-login">
              {errors.password}
            </FormHelperText>
          )}
        </Grid>

        <Grid size={12} textAlign="center">
          {isLoading ? (
            <CircularProgress size={26} />
          ) : (
            <AnimateButton>
              <Button
                disabled={!values.login || !values.password}
                onClick={handleSubmit}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                {t('SIGN.IN_BUTTON')}
              </Button>
            </AnimateButton>
          )}
        </Grid>
        <Grid size={12}>
          <Divider>
            <Typography variant="caption"> Login with</Typography>
          </Divider>
        </Grid>
        <Grid size={12}>
          <FirebaseSocial />
        </Grid>
      </Grid>
    </>
  );
}
