// src/pages/user/AddUser.tsx
import { Box, Button, Stack, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { actions, ManagementProvider, useManagementDispatch, useManagementState } from '../../context/ManagementContext';
import { UserDto } from '../../helpers/dto';
import useForm from '../../hooks/useForm';
import validate from './validation';

const AddUserComp = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useManagementDispatch();
  const { saveLoading, errorMessage } = useManagementState();

  const onSuccess = () => navigate('/user/list');
  const onError = (msg: string) => {
    // при желании тут можно показать snackbar
    console.error('Create error:', msg);
  };

  const save = () => {
    // простая проверка пароля на клиенте (бек всё равно проверит)
    if (!values.password || String(values.password).trim() === '') {
      // можно через setErrors в твоём useForm, но чтобы не тянуть — просто выходим
      console.warn('Password is required');
      return;
    }

    const payload: UserDto = {
      ...values,
      name: values.name && String(values.name).trim() !== '' ? values.name : null
      // balance оставляем как есть (string/decimal)
    };

    actions.doCreate(payload, onSuccess, onError)(dispatch);
  };

  const { values, errors, handleChange } = useForm<UserDto, any>(save, validate);

  const saveDisabled = useMemo(() => !!errors?.email || !!errors?.balance || saveLoading, [errors, saveLoading]);

  return (
    <Widget>
      <Box display="flex" flexDirection="column" gap={2} maxWidth={520}>
        <TextField
          name="email"
          label="Email"
          value={values.email ?? ''}
          onChange={handleChange}
          error={!!errors?.email}
          helperText={errors?.email || ''}
          autoComplete="email"
        />
        <TextField
          name="password"
          type="password"
          label="Password"
          value={values.password ?? ''}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <TextField name="name" label="Name" value={(values.name as any) ?? ''} onChange={handleChange} />
        <TextField
          name="balance"
          label="Balance (string/decimal)"
          value={values.balance ?? ''}
          onChange={handleChange}
          error={!!errors?.balance}
          helperText={errors?.balance || ''}
          inputProps={{ inputMode: 'decimal' }}
        />
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/user/list')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saveDisabled}>
            {saveLoading ? 'Saving…' : 'Save'}
          </Button>
        </Stack>

        {errorMessage ? <span style={{ color: '#d32f2f' }}>{errorMessage}</span> : null}
      </Box>
    </Widget>
  );
};

export default function AddUser(): JSX.Element {
  return (
    <ManagementProvider>
      <AddUserComp />
    </ManagementProvider>
  );
}
