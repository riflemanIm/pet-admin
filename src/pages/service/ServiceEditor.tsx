import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { Box, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { useParams } from 'react-router';

import { useNavigate } from 'react-router-dom';

import { useServiceDispatch, useServiceState, actions } from '../../context/ServiceContext';

import useForm from '../../hooks/useForm';
import validate, { ClientServiceError, paramsSchema } from './validation';
import { ClientServiceDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';
import JSONEditor from '../../components/JSONEditor';
import { Content, createAjvValidator, Mode } from 'vanilla-jsoneditor';
import { PlayArrow } from '@mui/icons-material';
import ServiceController from './ServiceController';
import { EditorButtons } from '../../components/Common/editorButtons';
import isEmpty from '../../helpers/isEmpty';

const ServiceEditor = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [serviceController, setServiceController] = React.useState<{
    isOpen: boolean;
    address?: string;
  }>({
    isOpen: false
  });

  const dispatch = useServiceDispatch();
  const { current } = useServiceState();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (id) {
      actions.doFind(Number(id))(dispatch);
    }
  }, [id]);

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
        navigate('/service/list');
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
        navigate('/service/list');
      },
      (errorMessage: string) => {
        enqueueSnackbar(errorMessage, {
          variant: 'warning'
        });
      }
    )(dispatch);
  };

  const { values, errors, handleGenericChange, handleChange, handleChangeSelect, handleSubmit, setValues } = useForm<
    ClientServiceDto,
    ClientServiceError
  >(id ? updateData : createData, validate);

  const validator = createAjvValidator({
    schema: paramsSchema
  });

  const closeServiceController = () => {
    setServiceController({
      isOpen: false
    });
  };

  const controlService = (address: string) => {
    setServiceController({
      isOpen: true,
      address
    });
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="row">
      <ServiceController
        isOpen={serviceController.isOpen}
        address={serviceController.address || ''}
        onClose={closeServiceController}
        requestInfo={actions.requestInfo}
        executeCommand={actions.executeCommand}
      />
      <Box display="flex" flexDirection="column" width={680}>
        <TextField
          variant="outlined"
          value={values?.label || ''}
          name="label"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.label') ?? ''}
          label={t('SERVICE.FIELDS.label')}
          type="text"
          fullWidth
          required
          error={errors?.label != null}
          helperText={errors?.label != null && errors?.label}
        />
        <FormControl variant="outlined" margin="normal" fullWidth style={{ marginBottom: 35 }}>
          <InputLabel id="state-select-label">{t('SERVICE.FIELDS.state')}</InputLabel>
          <Select
            labelId="state-select-label"
            value={values?.state || ''}
            name="state"
            label={t('SERVICE.FIELDS.state')}
            onChange={handleChangeSelect}
          >
            <MenuItem value={'Active'}>Active</MenuItem>
            <MenuItem value={'Excluded'}>Excluded</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          value={values?.address || ''}
          name="address"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.address') ?? ''}
          label={t('SERVICE.FIELDS.address')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.fileServerAddress || ''}
          name="fileServerAddress"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.fileServerAddress') ?? ''}
          label={t('SERVICE.FIELDS.fileServerAddress')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.dbdataAddress || ''}
          name="dbdataAddress"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.dbdataAddress') ?? ''}
          label={t('SERVICE.FIELDS.dbdataAddress')}
          type="text"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="control service" onClick={() => controlService(values?.dbdataAddress || '')}>
                  <PlayArrow />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          variant="outlined"
          value={values?.hl7Address || ''}
          name="hl7Address"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.hl7Address') ?? ''}
          label={t('SERVICE.FIELDS.hl7Address')}
          type="text"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="control service" onClick={() => controlService(values?.hl7Address || '')}>
                  <PlayArrow />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          variant="outlined"
          value={values?.discoveryAddress || ''}
          name="discoveryAddress"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.discoveryAddress') ?? ''}
          label={t('SERVICE.FIELDS.discoveryAddress')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.discoveryToken || ''}
          name="discoveryToken"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.discoveryToken') ?? ''}
          label={t('SERVICE.FIELDS.discoveryToken')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.calypsoAddress || ''}
          name="calypsoAddress"
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.webformAddress') ?? ''}
          label={t('SERVICE.FIELDS.webformAddress')}
          type="text"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={values?.clientKey || ''}
          name="clientKey"
          multiline
          minRows={8}
          onChange={handleChange}
          style={{ marginBottom: 35 }}
          placeholder={t('SERVICE.FIELDS.clientKey') ?? ''}
          label={t('SERVICE.FIELDS.clientKey')}
          type="text"
          fullWidth
        />
        <JSONEditor
          label={t('SERVICE.FIELDS.params')}
          content={{
            text: values?.params || ''
          }}
          mainMenuBar={false}
          navigationBar={false}
          mode={Mode.text}
          validator={validator}
          style={{ marginBottom: 35 }}
          onChange={(content: Content) => {
            if ('text' in content) {
              handleGenericChange('params', content.text);
            } else if ('json' in content) {
              handleGenericChange('params', JSON.stringify(content.json));
            }
          }}
        />
        <EditorButtons onCancel={() => navigate('/service/list')} submitDisabled={!isEmpty(errors)} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default ServiceEditor;
