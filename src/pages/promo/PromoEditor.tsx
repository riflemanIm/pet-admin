import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

import { useSnackbar } from 'notistack';
import useStyles from './styles';

import { actions, usePromoDispatch, usePromoState } from '../../context/PromoContext';

import useForm from '../../hooks/useForm';
import { resizeImageBase64 } from '../../helpers/base64';
import validate, { PromoError } from './validation';
import { useUserState } from '../../context/UserContext';
import { isNetRole, listEnums, PromoActionType } from '../../helpers/enums';
import convert from './convertion';
import { MedicalNetActionDto } from '../../helpers/dto';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { Locales } from '../../helpers/dateFormat';
import { useTranslation } from 'react-i18next';
import SuggestionsButton from './Suggestions';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const PromoEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = usePromoDispatch();
  const { medicalNets, current } = usePromoState();
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

  useEffect(() => {
    if (!current) return;
    setValues({
      ...current
    });
  }, [current, id]);

  const createData = () => {
    actions.doCreate(
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/promo/list');
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
        navigate('/promo/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleGenericChange, handleChange, handleChangeSelect, handleSubmit, setValues } = useForm<
    MedicalNetActionDto,
    PromoError
  >(id ? updateData : createData, validate, convert);

  useEffect(() => {
    if (!id && isNetRole(role)) {
      setValues({
        ...values,
        medicalNetId
      });
    }
  }, [id, medicalNetId, role]);

  const fileInput = React.useRef(null);

  const deleteOneImage = () => {
    handleGenericChange('image', '');
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    const filedata = event.target.files[0];
    const base64result = await resizeImageBase64(filedata, 610, 610);
    const image = base64result.split(',')[1];
    handleGenericChange('image', image);
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={800}>
        {!isNetRole(role) && (
          <FormControl variant="outlined" style={{ marginBottom: 35, marginRight: 8 }} fullWidth>
            <InputLabel id="id-medicalnet-label">{t('PROMOACTION.FIELDS.medicalNetId')}</InputLabel>
            <Select
              name="medicalNetId"
              labelId="id-medicalnet-label"
              id="id-medicalnet-select"
              label={t('PROMOACTION.FIELDS.medicalNetId')}
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
        <FormControl variant="outlined" margin="normal" fullWidth style={{ marginBottom: 35 }}>
          <InputLabel id="demo-simple-select-outlined-label">{t('PROMOACTION.FIELDS.actionType')}</InputLabel>
          <Select
            name="actionType"
            value={values?.actionType || ''}
            onChange={handleChangeSelect}
            label={t('PROMOACTION.FIELDS.actionType')}
          >
            {listEnums<PromoActionType>(PromoActionType, t, 'ENUMS.PromoActionType').map((it) => (
              <MenuItem key={it.value} value={it.value}>
                {it.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          value={values?.description || ''}
          name="description"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('PROMOACTION.FIELDS.description') ?? ''}
          label={`${t('PROMOACTION.FIELDS.description')} (${(values?.description || '').length}/100)`}
          multiline
          minRows={4}
          type="text"
          fullWidth
          required
          error={errors?.description != null}
          helperText={errors?.description != null && errors?.description}
        />
        <TextField
          variant="outlined"
          value={values?.actionText || ''}
          name="actionText"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('PROMOACTION.FIELDS.actionText') ?? ''}
          label={`${t('PROMOACTION.FIELDS.actionText')} (${(values?.actionText || '').length}/1000)`}
          multiline
          minRows={4}
          type="text"
          fullWidth
          required
          error={errors?.actionText != null}
          helperText={errors?.actionText != null && errors?.actionText}
        />
        <TextField
          variant="outlined"
          value={values?.sortOrder != null ? `${values?.sortOrder}` : ''}
          name="sortOrder"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('PROMOACTION.FIELDS.sortOrder') ?? ''}
          label={t('PROMOACTION.FIELDS.sortOrder')}
          type="text"
          fullWidth
          required
          error={errors?.sortOrder != null}
          helperText={errors?.sortOrder != null && errors?.sortOrder}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={Locales.ru}>
          <DatePicker
            format="dd.MM.yyyy"
            label={t('PROMOACTION.FIELDS.dateFrom')}
            value={values?.dateFrom != null ? new Date(values?.dateFrom) : null}
            onChange={(dateFrom) => handleGenericChange('dateFrom', dateFrom || null)}
            slotProps={{
              textField: {
                margin: 'normal',
                error: errors?.dateFrom != null,
                helperText: errors?.dateFrom != null && errors?.dateFrom,
                fullWidth: true
              }
            }}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={Locales.ru}>
          <DatePicker
            format="dd.MM.yyyy"
            label={t('PROMOACTION.FIELDS.dateTo')}
            value={values?.dateTo != null ? new Date(values?.dateTo) : null}
            onChange={(dateTo) => handleGenericChange('dateTo', dateTo || null)}
            slotProps={{
              textField: {
                margin: 'normal',
                error: errors?.dateTo != null,
                helperText: errors?.dateTo != null && errors?.dateTo,
                fullWidth: true
              }
            }}
          />
        </LocalizationProvider>

        <TextField
          variant="outlined"
          value={values?.url || ''}
          style={{ marginBottom: 35 }}
          name="url"
          onChange={handleChange}
          placeholder={t('PROMOACTION.FIELDS.url') ?? ''}
          label={t('PROMOACTION.FIELDS.url')}
          type="text"
          fullWidth
        />
        {values.image != null ? (
          <div className={classes.images}>
            <span className={classes.deleteImageX} onClick={() => deleteOneImage()} role="button">
              ×
            </span>
            <div className={classes.galleryWrap}>
              <Typography variant="subtitle2">Вид для сайта</Typography>
              <div className={classes.imgWrap}>
                <img src={`data:image/jpeg;base64,${values.image}`} alt="" className={classes.img} />
              </div>
            </div>
            <div className={classes.galleryWrap}>
              <Typography variant="subtitle2">Мобильный вид</Typography>
              <div className={classes.imgWrapMob}>
                <img src={`data:image/jpeg;base64,${values.image}`} alt="" className={classes.img} />
              </div>
            </div>
            <SuggestionsButton variant="outlined" />
          </div>
        ) : (
          <React.Fragment>
            <Typography variant="body1" color="error">
              {t('PROMOACTION.IMAGE.REQUIRED')}
            </Typography>
            <SuggestionsButton variant="outlined" />
          </React.Fragment>
        )}

        <label className={classes.uploadLabel} style={{ cursor: 'pointer' }}>
          {t('COMMON.CHOOSEFILE')}
          <input style={{ display: 'none' }} accept="image/*" type="file" ref={fileInput} onChange={handleFile} />
        </label>
        <Typography variant="subtitle2">
          {t('PROMOACTION.IMAGE.INFO')}
          <br />
          {t('PROMOACTION.IMAGE.FORMAT')}: <strong>.jpg, .png</strong>
          <br /> {t('PROMOACTION.IMAGE.RESIZEINFO')}:
          <br /> maxWidth: <strong>610px</strong>, <br />
          maxHeight: <strong>610px</strong>
        </Typography>
        <EditorButtons width={800} onCancel={() => navigate('/promo/list')} submitDisabled={!isEmpty(errors)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default PromoEditor;
