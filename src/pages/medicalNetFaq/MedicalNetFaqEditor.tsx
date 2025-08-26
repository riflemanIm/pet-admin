import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Typography } from '@mui/material';
import MDEditor from '@uiw/react-markdown-editor';

import { useSnackbar } from 'notistack';

import useForm from '../../hooks/useForm';
import validate, { MedicalNetFaqError } from './validation';
import { actions, useMedicalNetFaqDispatch, useMedicalNetFaqState } from '../../context/MedicalNetFaqContext';
import { MedicalNetFaqDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import { closedGalleryState, GalleryOpenState, getMarkdownCommands, transformImageUri } from './MarkdownCommands';
import ImageGallery from './ImageGallery';
import useStyles from './styles';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const MedicalNetFaqEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  const [galleryOpen, setGalleryOpen] = React.useState<GalleryOpenState>(closedGalleryState);

  const dispatch = useMedicalNetFaqDispatch();
  const { current, medicalNetId } = useMedicalNetFaqState();

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

  const updateData = () => {
    actions.doUpdate(
      Number(id),
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/medicalNetFaq/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const createData = () => {
    actions.doCreate(
      values,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/medicalNetFaq/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleChange, handleGenericChange, handleSubmit, setValues } = useForm<MedicalNetFaqDto, MedicalNetFaqError>(
    id ? updateData : createData,
    validate
  );

  const handleAnswerChange = (value?: string) => {
    handleGenericChange('answer', value);
  };

  useEffect(() => {
    if (!id) {
      setValues({
        ...values,
        medicalNetId: Number(medicalNetId)
      });
    }
  }, [id, medicalNetId]);

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <ImageGallery isOpen={galleryOpen.open} medicalNetId={values?.medicalNetId} onClose={galleryOpen.onClose} />
      <Box display="flex" flexDirection="column" width={1200}>
        <TextField
          variant="outlined"
          value={`${values?.langCode || ''}`}
          name="langCode"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('MEDICALNETFAQ.FIELDS.langCode') ?? ''}
          label={t('MEDICALNETFAQ.FIELDS.langCode')}
          type="text"
          fullWidth
          required
          error={errors?.langCode != null}
          helperText={errors?.langCode != null && errors?.langCode}
        />
        <TextField
          variant="outlined"
          value={values?.questionGroup || ''}
          name="questionGroup"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNETFAQ.FIELDS.questionGroup') ?? ''}
          label={t('MEDICALNETFAQ.FIELDS.questionGroup')}
          type="text"
          fullWidth
          required
          error={errors?.questionGroup != null}
          helperText={errors?.questionGroup != null && errors?.questionGroup}
        />
        <TextField
          variant="outlined"
          value={values?.question || ''}
          name="question"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('MEDICALNETFAQ.FIELDS.question') ?? ''}
          label={t('MEDICALNETFAQ.FIELDS.question')}
          type="text"
          fullWidth
          required
          error={errors?.question != null}
          helperText={errors?.question != null && errors?.question}
        />
        <Box style={{ marginBottom: 35 }}>
          <Typography variant="body2">{t('MEDICALNETFAQ.FIELDS.answer')} </Typography>
          <div data-color-mode="light" className={classes.mdEditor}>
            <MDEditor
              value={values?.answer || ''}
              onChange={handleAnswerChange}
              placeholder={t('MEDICALNETFAQ.FIELDS.answer') ?? ''}
              toolbars={getMarkdownCommands(setGalleryOpen)}
              previewProps={{
                urlTransform: transformImageUri
              }}
              height="400px"
            />
          </div>
          <Typography variant="body2" color="#FF4842">
            {errors?.answer != null && errors?.answer}
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          value={values?.sortOrder != null ? `${values?.sortOrder}` : ''}
          name="sortOrder"
          onChange={handleChange}
          style={{ marginBottom: 25 }}
          placeholder={t('MEDICALNETFAQ.FIELDS.sortOrder') ?? ''}
          label={t('MEDICALNETFAQ.FIELDS.sortOrder')}
          type="text"
          fullWidth
        />
        <EditorButtons
          width={1200}
          onCancel={() => navigate('/medicalNetFaq/list')}
          submitDisabled={!isEmpty(errors)}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default MedicalNetFaqEditor;
