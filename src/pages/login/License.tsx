import React, { useEffect } from 'react';

import { Button, TextField, Box, Link } from '@mui/material';

// context
import { useUserDispatch, setLicense } from '../../context/UserContext';

//form func
import useForm from '../../hooks/useForm';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { enqueueSnackbar } from 'notistack';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import useStyles from './styles';

function Login(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();
  // global
  const userDispatch = useUserDispatch();

  useEffect(() => {
    setValues({
      license: ''
    });
  }, []);

  function sendNotification(errorMessage?: string) {
    enqueueSnackbar(errorMessage || t('COMMON.RECORDSAVED'), {
      variant: errorMessage ? 'warning' : 'success'
    });
  }

  const saveData = () => {
    setLicense(values.license, sendNotification)(userDispatch, navigate);
  };

  const { values, handleChange, handleSubmit, setValues } = useForm<
    {
      license: string;
    },
    unknown
  >(saveData, () => ({}));

  return (
    <React.Fragment>
      <Header navigate={navigate} hasSideBar={false} />
      <div className={classes.container}>
        <Widget inheritHeight noBodyPadding header={t('LICENSE.TITLE')}>
          <Box display="flex" justifyContent="center" flexDirection="row">
            <Box display="flex" flexDirection="column" width={600}>
              <TextField
                variant="outlined"
                value={values.license}
                name="license"
                onChange={handleChange}
                style={{ marginBottom: 35 }}
                placeholder={t('MEDICALNET.FIELDS.license') ?? ''}
                label={t('MEDICALNET.FIELDS.license')}
                type="text"
                fullWidth
                multiline
                minRows={10}
              />
              <Box display="flex" justifyContent={'center'}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  {t('COMMON.SAVE')}
                </Button>
              </Box>
            </Box>
          </Box>
        </Widget>
      </div>
      <Footer>
        <div>
          <Link color={'primary'} href={'https://mobimed.ru/'} target={'_blank'} className={classes.link}>
            {t('BOTTOM.COPY')}
          </Link>
        </div>
      </Footer>
    </React.Fragment>
  );
}

export default Login;
