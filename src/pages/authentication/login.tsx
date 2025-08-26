import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router';
// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import { useUserState } from 'context/UserContext';

// ================================|| LOGIN ||================================ //

export default function Login() {
  const { t } = useTranslation();
  const { isAuthenticated } = useUserState();
  console.log('isAuthenticated', isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" />;
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Typography variant="h3">{t('SIGN.SIGN')}</Typography>
        </Grid>
        <Grid size={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
