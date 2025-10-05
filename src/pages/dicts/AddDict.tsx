// src/pages/dicts/AddDict.tsx
import { Box, Button, Stack, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useDictActions, useDictDispatch, useDictMeta } from '../../context/DictContext';
import { DictDto } from '../../helpers/dto';
import useForm from '../../hooks/useForm';
import validate from './validation';

export default function AddDict(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDictDispatch();
  const actions = useDictActions();
  const { entity } = useDictMeta();

  const onSuccess = () => navigate(`/dicts/${entity}`);
  const onError = (msg: string) => console.error('Create dict error:', msg);

  const save = () => {
    const payload: DictDto = {
      name: values.name && String(values.name).trim() !== '' ? values.name : null
    };
    actions.doCreate(payload, onSuccess, onError)(dispatch);
  };

  const { values, errors, handleChange } = useForm<DictDto, any>(save, validate);
  const saveDisabled = useMemo(() => !!errors?.name, [errors]);

  return (
    <Widget>
      <Box display="flex" flexDirection="column" gap={2} maxWidth={520}>
        <TextField
          name="name"
          label="Название"
          value={values.name ?? ''}
          onChange={handleChange}
          error={!!errors?.name}
          helperText={errors?.name || ''}
        />
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saveDisabled}>
            Save
          </Button>
        </Stack>
      </Box>
    </Widget>
  );
}
