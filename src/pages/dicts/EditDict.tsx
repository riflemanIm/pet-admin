// src/pages/dicts/EditDictComp.tsx
import { Box, Button, Stack, TextField } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Widget from '../../components/Widget';
import { DictProvider, EntityName, useDictActions, useDictDispatch, useDictState } from '../../context/DictContext';
import { DictDto } from '../../helpers/dto';
import useForm from '../../hooks/useForm';
import validate from './validation';

function EditDictComp({ entity }: { entity: EntityName }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDictDispatch();
  const actions = useDictActions();
  const { current, saveLoading } = useDictState();

  useEffect(() => {
    if (id) actions.doFind(Number(id))(dispatch);
  }, [id, actions, dispatch]);

  const onSuccess = () => navigate(`/dicts/${entity}/list`);
  const onError = (msg: string) => console.error('Update dict error:', msg);

  const save = () => {
    if (!id) return;
    const payload: DictDto = {
      id: Number(id),
      name: values.name && String(values.name).trim() !== '' ? values.name : null
    };
    actions.doUpdate(Number(id), payload, onSuccess, onError)(dispatch);
  };

  const { values, errors, handleChange, setValues } = useForm<DictDto, any>(save, validate);

  useEffect(() => {
    if (current) setValues({ id: current.id, name: current.name ?? '' } as DictDto);
  }, [current, setValues]);

  const saveDisabled = useMemo(() => !!errors?.name || saveLoading, [errors, saveLoading]);

  return (
    <Widget>
      <Box display="flex" flexDirection="column" gap={2} maxWidth={520}>
        <TextField
          name="name"
          label="Название"
          value={(values.name as any) ?? ''}
          onChange={handleChange}
          error={!!errors?.name}
          helperText={errors?.name || ''}
        />
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saveDisabled}>
            {saveLoading ? 'Saving…' : 'Save'}
          </Button>
        </Stack>
      </Box>
    </Widget>
  );
}

export default function EditDict(): JSX.Element {
  const { entity } = useParams<{ entity: EntityName }>();
  const e = (entity ?? 'ages') as EntityName;

  return (
    <DictProvider entity={e}>
      <EditDictComp entity={e} />
    </DictProvider>
  );
}
