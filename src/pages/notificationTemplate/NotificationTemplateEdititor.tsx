import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';

import { useSnackbar } from 'notistack';
import { Info as InfoIcon } from '@mui/icons-material';

import useForm from '../../hooks/useForm';
import validate, { NotificationTemplateError } from './validation';
import { useUserState } from '../../context/UserContext';
import {
  isNetRole,
  NotificationRecordType,
  notificationRecordTypeNames,
  NotificationType,
  notificationTypeNames
} from '../../helpers/enums';
import { actions, useNotificationTemplateDispatch, useNotificationTemplateState } from '../../context/NotificationTemplateContext';
import { NotificationTemplateDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import DescriptionDialog from './DescriptionDialog';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const NotificationTemplateEdititor = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useNotificationTemplateDispatch();
  const { medicalNets, help, current } = useNotificationTemplateState();
  const {
    currentUser: { role, medicalNetId }
  } = useUserState();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      actions
        .doFind(Number(id))(dispatch)
        .then(() => {
          actions.doReferenceLists()(dispatch);
        });
    } else {
      actions.doReferenceLists()(dispatch);
    }
  }, [id]);

  const [description, setDescription] = React.useState<{ title: string; description: string } | undefined>(undefined);

  useEffect(() => {
    if (id && current) {
      setValues({
        ...current
      });
    }
  }, [current, id]);

  const createData = () => {
    actions.doCreate(
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/notificationTemplate/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const updateData = () => {
    actions.doUpdate(
      Number(id),
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/notificationTemplate/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleChange, handleChangeSelect, handleSubmit, setValues } = useForm<
    NotificationTemplateDto,
    NotificationTemplateError
  >(id ? updateData : createData, validate);

  useEffect(() => {
    if (id) return;
    if (isNetRole(role)) {
      setValues({
        ...values,
        medicalNetId,
        langCode: values.langCode || 'rus',
        notificationType: values.notificationType || NotificationType.Email,
        recordType: values.recordType || NotificationRecordType.Confirmation
      });
    } else {
      setValues({
        ...values,
        langCode: values.langCode || 'rus',
        notificationType: values.notificationType || NotificationType.Email,
        recordType: values.recordType || NotificationRecordType.Confirmation
      });
    }
  }, [id, role]);

  const hasDescription = React.useCallback(() => {
    return help.some((it) => it.code === NotificationRecordType[values.recordType]);
  }, [help, values.recordType]);

  const showDescription = React.useCallback(() => {
    const helpItem = help.find((it) => it.code === NotificationRecordType[values.recordType]);
    setDescription({
      title: NotificationRecordType[values.recordType],
      description: helpItem!.value
    });
  }, [hasDescription, values.recordType]);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <DescriptionDialog
        isOpen={!!description}
        title={description?.title}
        text={description?.description}
        onClose={() => setDescription(undefined)}
      />
      <Box display="flex" flexDirection="column" width={800}>
        <TextField
          variant="outlined"
          value={values?.description || ''}
          name="description"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('NOTIFICATIONTEMPLATE.FIELDS.description') ?? ''}
          label={t('NOTIFICATIONTEMPLATE.FIELDS.description')}
          type="text"
          fullWidth
          required
          error={errors?.description != null}
          helperText={errors?.description != null && errors?.description}
        />
        {!isNetRole(role) && (
          <FormControl variant="outlined" style={{ marginBottom: 35, marginRight: 8 }} fullWidth>
            <InputLabel id="id-medicalnet-label">{t('NOTIFICATIONTEMPLATE.FIELDS.medicalNetId')}</InputLabel>
            <Select
              name="medicalNetId"
              labelId="id-medicalnet-label"
              id="id-medicalnet-select"
              label={t('NOTIFICATIONTEMPLATE.FIELDS.medicalNetId')}
              onChange={handleChangeSelect}
              value={values?.medicalNetId || ''}
            >
              {medicalNets.map((item) => (
                <MenuItem value={item.medicalNetId} key={item.medicalNetId}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          variant="outlined"
          value={values?.clinicId || ''}
          name="clinicId"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('NOTIFICATIONTEMPLATE.FIELDS.clinicId') ?? ''}
          label={t('NOTIFICATIONTEMPLATE.FIELDS.clinicId')}
          type="number"
          fullWidth
        />
        <FormControl fullWidth style={{ marginBottom: 35 }}>
          <InputLabel id="nt-label">{t('NOTIFICATIONTEMPLATE.FIELDS.notificationType')}</InputLabel>
          <Select
            labelId="nt-label"
            label={t('NOTIFICATIONTEMPLATE.FIELDS.notificationType')}
            name="notificationType"
            onChange={handleChangeSelect}
            value={values?.notificationType || NotificationType.Email}
            required
            error={errors.notificationType != null}
          >
            {notificationTypeNames().map((k) => (
              <MenuItem key={k.value} value={k.value}>
                {k.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box display="flex" mb={2} alignItems="flex-start">
          <FormControl fullWidth style={{ marginBottom: 35 }}>
            <InputLabel id="nrt-label">{t('NOTIFICATIONTEMPLATE.FIELDS.recordType')}</InputLabel>
            <Select
              labelId="nrt-label"
              label={t('NOTIFICATIONTEMPLATE.FIELDS.recordType')}
              name="recordType"
              onChange={handleChangeSelect}
              value={values?.recordType || NotificationRecordType.Confirmation}
            >
              {notificationRecordTypeNames().map((k) => (
                <MenuItem key={k.value} value={k.value}>
                  {k.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton style={{ padding: 15 }} size="large" disabled={!hasDescription()} onClick={() => showDescription()}>
            <InfoIcon />
          </IconButton>
        </Box>
        <TextField
          variant="outlined"
          value={values?.langCode || 'rus'}
          name="langCode"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('NOTIFICATIONTEMPLATE.FIELDS.langCode') ?? ''}
          label={t('NOTIFICATIONTEMPLATE.FIELDS.langCode')}
          type="text"
          fullWidth
          required
          error={errors?.langCode != null}
          helperText={errors?.langCode != null && errors?.langCode}
        />
        <TextField
          variant="outlined"
          value={values?.template || ''}
          name="template"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('NOTIFICATIONTEMPLATE.FIELDS.template') ?? ''}
          label={t('NOTIFICATIONTEMPLATE.FIELDS.template')}
          multiline
          minRows={4}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.templateHtml || ''}
          name="templateHtml"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('NOTIFICATIONTEMPLATE.FIELDS.templateHtml') ?? ''}
          label={t('NOTIFICATIONTEMPLATE.FIELDS.templateHtml')}
          multiline
          minRows={4}
          type="text"
          fullWidth
        />
        <EditorButtons
          width={800}
          onCancel={() => navigate('/notificationTemplate/list')}
          submitDisabled={!isEmpty(errors)}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default NotificationTemplateEdititor;
