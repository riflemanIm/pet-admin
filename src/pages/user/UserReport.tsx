import React from 'react';
import DateFnsAdapter from '@date-io/date-fns';
import ReactECharts from 'echarts-for-react';

import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';

import { useManagementDispatch, useManagementState, actions } from '../../context/ManagementContext';
import {
  AgeGroup,
  getEnumName,
  isNetRole,
  NotificationRecordType,
  NotificationType,
  RegistrationSource,
  TranslationFunction
} from '../../helpers/enums';
import {
  AgeDistributionDto,
  DoctorCallDistributionDto,
  EmrRecordDistributionByMonthDto,
  NotificationDistributionDto,
  SourceDistributionDto,
  UserReportConditionDto,
  VisitDistributionByMonthDto,
  VisitDistributionDto
} from '../../helpers/dto';
import Widget from '../../components/Widget';
import { Locales } from '../../helpers/dateFormat';
import { Doughnut, DoughnutValueItem } from '../statistics/doughnut';

import { useUserState } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useLanguageValue } from '../../context/LanguageContext';
import MuiUIPicker from '../../components/MUIDatePicker';
import { RefreshOutlined } from '@mui/icons-material';

const sourceDistribution = (t: TranslationFunction, data?: SourceDistributionDto[]): DoughnutValueItem[] => {
  return (
    data?.map((row) => ({
      value: row.cnt,
      name: getEnumName(RegistrationSource, row.registrationSourceId, t, 'ENUMS.RegistrationSource') || t('ENUMS.UNKNOWN')
    })) || []
  );
};

const ageDistribution = (t: TranslationFunction, data?: AgeDistributionDto[]): DoughnutValueItem[] => {
  const values: Record<string, number> = {};
  for (const item of data || []) {
    if (item.age === null) {
      values[t('ENUMS.UNKNOWN')] = item.cnt;
    } else if (item.age < 25) {
      values['< 25'] = (values['< 25'] ?? 0) + item.cnt;
    } else if (item.age < 30) {
      values['20-30'] = (values['20-30'] ?? 0) + item.cnt;
    } else if (item.age < 40) {
      values['30-40'] = (values['30-40'] ?? 0) + item.cnt;
    } else if (item.age < 50) {
      values['40-50'] = (values['40-50'] ?? 0) + item.cnt;
    } else if (item.age < 60) {
      values['50-60'] = (values['50-60'] ?? 0) + item.cnt;
    } else {
      values['> 60'] = (values['> 60'] ?? 0) + item.cnt;
    }
  }

  return (
    Object.entries(values).map(([name, value]) => ({
      value,
      name
    })) || []
  );
};

const visitDistribution = (t: TranslationFunction, data?: VisitDistributionDto[]): DoughnutValueItem[] => {
  return (
    data?.map((row) => ({
      name: [
        row.isAnonymous ? t('REPORT.visitDistribution.ANONYMOUS') : t('REPORT.visitDistribution.MMK'),
        row.isMobimedCreated ? t('REPORT.visitDistribution.MOBIMED') : t('REPORT.visitDistribution.MIS')
      ].join(', '),
      value: row.cnt
    })) || []
  );
};

const doctorCallDistribution = (t: TranslationFunction, data?: DoctorCallDistributionDto[]): DoughnutValueItem[] => {
  return (
    data?.map((row) => ({
      value: row.cnt,
      name: getEnumName(AgeGroup, row.ageGroup, t, 'ENUMS.AgeGroup')
    })) || []
  );
};

const notificationDistribution = (t: TranslationFunction, data?: NotificationDistributionDto[]) => {
  // 1 уровень - вид доставки
  // 2 уровень - тип уведомления
  const dataset = {
    dimensions: [] as string[],
    source: [] as Record<string, any>[]
  };

  let recordTypes: NotificationRecordType[] = [];

  if (data) {
    recordTypes = Array.from(new Set(data.map((it) => it.recordType)));
    dataset.dimensions = ['type', ...recordTypes.map((it) => getEnumName(NotificationRecordType, it, t, 'ENUMS.NotificationRecordType'))];
    const source = new Map<NotificationType, Record<string, any>>();
    for (const row of data) {
      if (!source.has(row.notificationType)) {
        source.set(row.notificationType, {
          type: getEnumName(NotificationType, row.notificationType, t, 'ENUMS.NotificationType')
        });
      }
      const v = source.get(row.notificationType);
      if (!v) continue;
      v[getEnumName(NotificationRecordType, row.recordType, t, 'ENUMS.NotificationRecordType')] = row.cnt;
    }
    dataset.source.push(...Array.from(source.values()));
  }

  return {
    title: {
      left: 'center',
      text: t('REPORT.notificationDistribution.TITLE')
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: [{ type: 'category' }],
    yAxis: {},
    dataset,
    series: recordTypes.map((it) => ({
      name: getEnumName(NotificationRecordType, it, t, 'ENUMS.NotificationRecordType'),
      type: 'bar',
      stack: 'type'
    }))
  };
};

const visitDistributionByMonth = (months: string[], t: TranslationFunction, data?: VisitDistributionByMonthDto[]) => {
  type Value = {
    false: {
      false: number | null;
      true: number | null;
    };
    true: {
      false: number | null;
      true: number | null;
    };
  };
  const values = new Map<string, Value>();
  if (data) {
    for (const row of data) {
      const label = `${row.year} ${months[row.month - 1]}`;
      if (!values.has(label)) {
        values.set(label, {
          false: {
            false: null,
            true: null
          },
          true: {
            false: null,
            true: null
          }
        });
      }
      (values.get(label) as Value)[`${row.isAnonymous}`][`${row.isMobimedCreated}`] = row.cnt;
    }
  }

  return {
    title: {
      left: 'center',
      text: t('REPORT.visitDistributionByMonth.TITLE')
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: Array.from(values.keys()),
        axisLabel: { interval: 0, rotate: 30 }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: [t('REPORT.visitDistribution.MMK'), t('REPORT.visitDistribution.MIS')].join(', '),
        data: Array.from(values.values()).map((it) => it['false']['false']),
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        stack: 'type'
      },
      {
        name: [t('REPORT.visitDistribution.MMK'), t('REPORT.visitDistribution.MOBIMED')].join(', '),
        data: Array.from(values.values()).map((it) => it['false']['true']),
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        stack: 'type'
      },
      {
        name: [t('REPORT.visitDistribution.ANONYMOUS'), t('REPORT.visitDistribution.MIS')].join(', '),
        data: Array.from(values.values()).map((it) => it['true']['false']),
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        stack: 'type'
      },
      {
        name: [t('REPORT.visitDistribution.ANONYMOUS'), t('REPORT.visitDistribution.MOBIMED')].join(', '),
        data: Array.from(values.values()).map((it) => it['true']['true']),
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        stack: 'type'
      }
    ]
  };
};

const emrRecordDistributionByMonth = (months: string[], t: TranslationFunction, data?: EmrRecordDistributionByMonthDto[]) => {
  const values = new Map<string, number>();
  if (data) {
    for (const row of data) {
      const label = `${row.year} ${months[row.month - 1]}`;
      if (!values.has(label)) {
        values.set(label, row.cnt);
      }
    }
  }

  return {
    title: {
      left: 'center',
      text: t('REPORT.emrRecordDistributionByMonth.TITLE')
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: Array.from(values.keys()),
        axisLabel: { interval: 0, rotate: 30 }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        data: Array.from(values.values()),
        type: 'bar',
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };
};

const UserReport = (): JSX.Element => {
  const { t } = useTranslation();
  const { languageState } = useLanguageValue();
  const dateFns = new DateFnsAdapter({
    locale: Locales[languageState.language]
  });
  const dispatch = useManagementDispatch();
  const { report, medicalNets } = useManagementState();
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    currentUser: { role }
  } = useUserState();

  const months = dateFns.getMonthArray(new Date()).map((it) => dateFns.formatByString(it, dateFns.formats.month));

  const [condition, setCondition] = React.useState<UserReportConditionDto | undefined>({
    dateFrom: dateFns.startOfYear(new Date()),
    dateTo: dateFns.endOfYear(new Date()),
    medicalNetId: undefined
  });

  React.useEffect(() => {
    actions.doReferenceLists()(dispatch);
  }, []);

  React.useEffect(() => {
    setLoading(true);
    actions
      .doReport(
        condition?.dateFrom,
        condition?.dateTo,
        condition?.medicalNetId
      )(dispatch)
      .finally(() => {
        setLoading(false);
      });
  }, [condition?.dateFrom?.valueOf(), condition?.dateTo?.valueOf(), condition?.medicalNetId]);

  React.useEffect(() => {
    if (report?.condition) setCondition(report?.condition);
  }, [report?.condition]);

  // раз в минуту обновляем статистику
  // useInterval(
  //   () => {
  //     actions.doReport(
  //       condition?.dateFrom,
  //       condition?.dateTo,
  //       condition?.medicalNetId
  //     )(dispatch);
  //   },
  //   true,
  //   60000
  // );

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12}>
        <Widget inheritHeight>
          <Box justifyContent={'flex-start'} display="flex" alignItems={'center'}>
            <Typography>{t('REPORT.PERIOD')}:</Typography>
            <MuiUIPicker
              value={report?.condition.dateFrom}
              disabled={loading}
              handleChange={(dateFrom) =>
                setCondition({
                  ...(condition || {}),
                  dateFrom: dateFrom ? new Date(dateFrom) : undefined
                })
              }
              fullWidth={false}
              variant="standard"
              mx={true}
            />

            <MuiUIPicker
              value={report?.condition.dateTo}
              disabled={loading}
              handleChange={(dateTo) =>
                setCondition({
                  ...(condition || {}),
                  dateTo: dateTo ? new Date(dateTo) : undefined
                })
              }
              fullWidth={false}
              variant="standard"
              mx={true}
            />

            {!isNetRole(role) && (
              <FormControl variant="standard" size="small" style={{ marginLeft: 8, width: 300 }}>
                <InputLabel id="id-medical_net-label">{t('REPORT.MEDICALNET')}</InputLabel>
                <Select
                  name="medicalNetId"
                  id="id-medical_net-select"
                  labelId="id-medical_net-label"
                  label={t('REPORT.MEDICALNET')}
                  disabled={loading}
                  onChange={(event) =>
                    setCondition({
                      ...(condition || {}),
                      medicalNetId: event.target.value as number
                    })
                  }
                  value={report?.condition.medicalNetId || ''}
                >
                  <MenuItem value="">
                    <em>Нет</em>
                  </MenuItem>
                  {medicalNets.map((item) => (
                    <MenuItem value={item.medicalNetId} key={item.medicalNetId}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {loading ? (
              <CircularProgress sx={{ marginLeft: 1, padding: 1 }} />
            ) : (
              <IconButton
                onClick={() => {
                  setLoading(true);
                  actions
                    .doReport(
                      condition?.dateFrom,
                      condition?.dateTo,
                      condition?.medicalNetId
                    )(dispatch)
                    .finally(() => {
                      setLoading(false);
                    });
                }}
                color="primary"
              >
                <RefreshOutlined />
              </IconButton>
            )}
          </Box>
        </Widget>
      </Grid2>
      <Grid2 size={4}>
        <Card>
          <CardContent
            sx={{
              width: 500,
              height: 500
            }}
          >
            <Doughnut
              title={t('REPORT.sourceDistribution.TITLE')}
              serieName={t('REPORT.sourceDistribution.SERIE')}
              data={sourceDistribution(t, report?.sourceDistribution)}
              style={{ height: 500 }}
            />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={4}>
        <Card>
          <CardContent
            sx={{
              width: 500,
              height: 500
            }}
          >
            <Doughnut
              title={t('REPORT.ageDistribution.TITLE')}
              serieName={t('REPORT.ageDistribution.SERIE')}
              data={ageDistribution(t, report?.ageDistribution)}
              style={{ height: 500 }}
            />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={4}>
        <Card>
          <CardContent
            sx={{
              width: 500,
              height: 500
            }}
          >
            <Doughnut
              title={t('REPORT.visitDistribution.TITLE')}
              serieName={t('REPORT.visitDistribution.SERIE')}
              data={visitDistribution(t, report?.visitDistribution)}
              style={{ height: 500 }}
            />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={4}>
        <Card>
          <CardContent
            sx={{
              width: 500,
              height: 500
            }}
          >
            <Doughnut
              title={t('REPORT.doctorCallDistribution.TITLE')}
              serieName={t('REPORT.doctorCallDistribution.SERIE')}
              data={doctorCallDistribution(t, report?.doctorCallDistribution)}
              style={{ height: 500 }}
            />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={6}>
        <Card
          sx={{
            width: '100%',
            height: 500
          }}
        >
          <CardContent>
            <ReactECharts
              option={visitDistributionByMonth(months, t, report?.visitDistributionByMonth)}
              lazyUpdate={true}
              style={{ height: 500 }}
            />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={6}>
        <Card
          sx={{
            width: '100%',
            height: 500
          }}
        >
          <CardContent>
            <ReactECharts
              option={emrRecordDistributionByMonth(months, t, report?.emrRecordDistributionByMonth)}
              lazyUpdate={true}
              style={{ height: 500 }}
            />
          </CardContent>
        </Card>
      </Grid2>
      <Grid2 size={9}>
        <Card>
          <CardContent
            sx={{
              width: '100%',
              height: 500
            }}
          >
            <ReactECharts
              option={notificationDistribution(t, report?.notificationDistribution)}
              notMerge={true}
              lazyUpdate={true}
              style={{ height: 500 }}
            />
          </CardContent>
        </Card>
      </Grid2>
      {!isNetRole(role) && (
        <Grid2 size={3}>
          <Card>
            <CardHeader title={t('REPORT.notificationStatusDistribution.TITLE')} />
            <CardContent>
              <Alert variant="filled" severity="error" style={{ marginBottom: 8 }}>
                {report?.notificationStatusDistribution.errors} {t('REPORT.notificationStatusDistribution.ERRORS')}
              </Alert>
              <Alert variant="filled" severity="error" style={{ marginBottom: 8 }}>
                {report?.notificationStatusDistribution.errorsInLog} {t('REPORT.notificationStatusDistribution.ERRORSINLOG')}
              </Alert>
              <Alert variant="filled" severity="warning" style={{ marginBottom: 8 }}>
                {report?.notificationStatusDistribution.retries} {t('REPORT.notificationStatusDistribution.RETRIES')}
              </Alert>
              <Alert variant="filled" severity="info">
                {report?.notificationStatusDistribution.waiting} {t('REPORT.notificationStatusDistribution.WAITING')}
              </Alert>
            </CardContent>
          </Card>
        </Grid2>
      )}
    </Grid2>
  );
};

export default UserReport;
