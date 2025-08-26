import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Box, TextField, Typography } from '@mui/material';

import { useSpecializationDispatch, useSpecializationState, actions } from '../../context/SpecializationContext';

import useForm from '../../hooks/useForm';
import validate, { SpecializationError } from './validation';
import SpecializationImage from './SpecializationImage';
import { SpecializationDto, SpecializationNameDto } from '../../helpers/dto';
import { LangCode } from '../../helpers/enums';
import { useTranslation } from 'react-i18next';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const SpecializationEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const langs: LangCode[] = ['rus', 'eng', 'fra'];

  const dispatch = useSpecializationDispatch();
  const { current } = useSpecializationState();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      actions.doFind(Number(id))(dispatch);
    }
  }, [id]);

  const getNameItem = (langCode: LangCode): SpecializationNameDto => {
    let item = values.names?.find((it) => it.langCode === langCode);
    if (!item) {
      item = {
        langCode,
        specializationId: values.specializationId as number,
        name: '',
        description: '',
        shortDescription: ''
      };
    }
    return item;
  };

  useEffect(() => {
    if (id && current) {
      setValues({
        ...current
      });
    }
  }, [id, current]);

  const updateData = () => {
    const vals = {
      ...values,
      names: values.names.filter((it) => !!it.name)
    };
    actions.doUpdate(
      Number(id),
      vals,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/specialization/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const createData = () => {
    const vals = {
      ...values,
      names: values.names.filter((it) => !!it.name)
    };

    actions.doCreate(
      vals,
      () => {
        enqueueSnackbar(t('COMMON.RECORDSAVED'), {
          variant: 'success'
        });
        navigate('/specialization/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleGenericChange, handleChange, handleSubmit, setValues } = useForm<SpecializationDto, SpecializationError>(
    id ? updateData : createData,
    validate
  );

  const handleLangChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    event.persist();
    const name = (event.target.name as string).split('_');
    const value = event.target.value;

    const names = [...(values.names || [])];
    const index = names.findIndex((it) => it.langCode === name[1]);
    if (index >= 0) {
      names[index] = {
        ...names[index],
        [name[0]]: value
      };
    } else {
      names.push({
        langCode: name[1],
        specializationId: values.specializationId as number,
        name: '',
        description: '',
        shortDescription: ''
      });
    }

    setValues({
      ...values,
      names
    });
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <Box display="flex" flexDirection="column" width={600}>
        <TextField
          variant="outlined"
          value={values?.code || ''}
          name="code"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder="Код"
          label="Код"
          type="text"
          fullWidth
          required
          error={errors?.code != null}
          helperText={errors?.code != null && errors?.code}
        />
        {langs.map((lang: LangCode) => (
          <React.Fragment key={lang}>
            <Typography variant="subtitle1" style={{ marginTop: 35 }}>
              {lang}
            </Typography>
            <TextField
              variant="outlined"
              value={getNameItem(lang).name}
              name={`name_${lang}`}
              onChange={handleLangChange}
              style={{ marginBottom: 35 }}
              placeholder={`Специализация(${lang})`}
              label={`Специализация(${lang})`}
              multiline
              minRows={1}
              type="text"
              fullWidth
            />
            <TextField
              variant="outlined"
              value={getNameItem(lang).description || ''}
              name={`description_${lang}`}
              onChange={handleLangChange}
              style={{ marginBottom: 35 }}
              placeholder={`Описание(${lang})`}
              label={`Описание(${lang})`}
              multiline
              minRows={4}
              type="text"
              fullWidth
            />
            <TextField
              variant="outlined"
              value={getNameItem(lang).shortDescription || ''}
              name={`shortDescription_${lang}`}
              onChange={handleLangChange}
              style={{ marginBottom: 35 }}
              placeholder={`Короткое описание(${lang})`}
              label={`Короткое описание(${lang})`}
              multiline
              minRows={4}
              type="text"
              fullWidth
            />
          </React.Fragment>
        ))}
        <Box display="flex" justifyContent={'space-between'} width={600}>
          <SpecializationImage
            id="image"
            value={values.image}
            onChange={(newValue: string | null) => handleGenericChange('image', newValue)}
            title="Мобильное изображение"
          />
          <SpecializationImage
            id="largeImage"
            value={values.largeImage}
            onChange={(newValue: string | null) => handleGenericChange('largeImage', newValue)}
            title="Изображение для сайта"
          />
        </Box>
        <EditorButtons
          width={600}
          onCancel={() => navigate('/specialization/list')}
          submitDisabled={!isEmpty(errors)}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default SpecializationEditor;
