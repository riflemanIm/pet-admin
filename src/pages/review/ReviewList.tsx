import React from 'react';
import { useSnackbar } from 'notistack';
import DateFnsAdapter from '@date-io/date-fns';

import Widget from '../../components/Widget';
import { useReviewState, useReviewDispatch, actions } from '../../context/ReviewContext';

import { EmrReviewDto, GenericReviewDto } from '../../helpers/dto';

import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  List,
  MenuItem,
  Rating,
  Select,
  Stack,
  Typography
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useLanguageValue } from '../../context/LanguageContext';

const ReviewList = (): JSX.Element => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DateFnsAdapter();

  const [type, setType] = React.useState('doctor');
  const [rows, setRows] = React.useState<GenericReviewDto[]>([]);

  const state = useReviewState();
  const dispatch = useReviewDispatch();

  React.useEffect(() => {
    switch (type) {
      case 'doctor':
        actions.doFetchDoctorReviews()(dispatch);
        break;
      case 'emr':
        actions.doFetchEmrReviews()(dispatch);
        break;
    }
  }, [type]);

  React.useEffect(() => {
    setRows(state.rows as GenericReviewDto[]);
  }, [state.rows]);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (state.errorMessage) enqueueSnackbar(state.errorMessage, { variant: 'error' });
  }, [state.errorMessage]);

  const approve = React.useCallback(
    (id: number) => {
      actions.doApprove(id)(dispatch);
    },
    [dispatch]
  );

  const remove = React.useCallback(
    (id: number) => {
      actions.doDelete(id)(dispatch);
    },
    [dispatch]
  );

  const getUserInfo = React.useCallback((row: GenericReviewDto): string => {
    const parts: string[] = [row.userInfo.lastName, row.userInfo.firstName];
    if (row.userInfo.middleName) parts.push(row.userInfo.middleName);
    parts.push(`(${row.userId})`);
    const contacts: string[] = [];
    if (row.userInfo.phone) {
      contacts.push(row.userInfo.phone);
    }
    if (row.userInfo.email) {
      contacts.push(row.userInfo.email);
    }
    parts.push(contacts.join(', '));
    return parts.join(' ');
  }, []);

  const getDoctorHeader = React.useCallback(
    (row: GenericReviewDto): string => {
      const doctor = `${t('REVIEW.CLINIC')}: ${row.clinicName} (${row.clinicId}), ${t('REVIEW.DOCTOR')}: ${row.doctorInfo?.firstName} ${
        row.doctorInfo?.lastName
      } (${row.doctorId})`;

      if (type === 'doctor' || !(row as EmrReviewDto).visitDate) return doctor;

      const visitDate = dateFns.formatByString(new Date((row as EmrReviewDto).visitDate), 'dd.MM.yyyy');

      return `${t('REVIEW.VISITDATE')}: ${visitDate}, ${doctor}, ${t('REVIEW.VISITTYPE')}: ${(row as EmrReviewDto).visitType}`;
    },
    [languageState.language, type]
  );

  return (
    <Stack spacing={2}>
      <Widget inheritHeight>
        <FormControl variant="standard" size="small" style={{ marginLeft: 8, width: 300 }}>
          <InputLabel id="id-type-label">{t('REVIEW.TYPE')}</InputLabel>
          <Select
            name="type"
            id="id-type-select"
            labelId="id-type-label"
            label={t('REVIEW.TYPE')}
            onChange={(event) => setType(event.target.value)}
            value={type}
          >
            <MenuItem value="doctor">
              <em>{t('REVIEW.DOCTOR')}</em>
            </MenuItem>
            <MenuItem value="emr">
              <em>{t('REVIEW.EMR')}</em>
            </MenuItem>
          </Select>
        </FormControl>
      </Widget>
      <Widget inheritHeight noBodyPadding>
        <List>
          {rows.map((it) => {
            return (
              <Card key={it.id} variant="outlined" sx={{ margin: 1 }}>
                <CardHeader
                  avatar={
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  }
                  title={<Typography sx={{ fontSize: 16 }}>{getUserInfo(it)}</Typography>}
                  subheader={dateFns.formatByString(new Date(it.date), 'dd.MM.yyyy')}
                />
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {getDoctorHeader(it)}
                  </Typography>
                  <Rating name="read-only" value={it.rating} readOnly />
                  <Typography variant="body2">{it.text}</Typography>
                </CardContent>
                {type === 'doctor' && (
                  <CardActions>
                    <Button aria-label="approve" onClick={() => approve(it.id as number)}>
                      {t('COMMON.ACCEPT')}
                    </Button>
                    <Button aria-label="delete" onClick={() => remove(it.id as number)}>
                      {t('COMMON.DELETE')}
                    </Button>
                  </CardActions>
                )}
              </Card>
            );
          })}
        </List>
      </Widget>
    </Stack>
  );
};

export default ReviewList;
