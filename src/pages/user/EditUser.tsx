// src/pages/user/EditUser.tsx
import React, { useEffect, useMemo } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useManagementDispatch, useManagementState, actions } from '../../context/ManagementContext';
import { UserDto } from '../../helpers/dto';
import useForm from '../../hooks/useForm';
import validate from './validation';

export default function EditUser(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useManagementDispatch();
  const { current, saveLoading, errorMessage } = useManagementState();

  // подгружаем пользователя
  useEffect(() => {
    if (id) actions.doFind(Number(id))(dispatch);
  }, [id, dispatch]);

  const onSuccess = () => navigate('/user/list');
  const onError = (msg: string) => {
    // сюда можно всплывашку/snackbar
    console.error('Update error:', msg);
  };

  const save = () => {
    if (!id) return;
    const payload: UserDto = {
      ...values,
      // пустое имя -> null
      name: values.name && String(values.name).trim() !== '' ? values.name : null
      // balance можно оставить строкой — Prisma Decimal его примет
    };

    // пустой пароль не отправляем
    if (!payload.password || String(payload.password).trim() === '') {
      delete (payload as any).password;
    }

    actions.doUpdate(Number(id), payload, onSuccess, onError)(dispatch);
  };

  const { values, errors, handleChange, setValues } = useForm<UserDto, any>(save, validate);

  // заполняем форму данными после загрузки
  useEffect(() => {
    if (current) {
      setValues({
        userId: current.userId,
        email: current.email ?? '',
        password: '',
        name: current.name ?? null,
        balance: current.balance ?? ''
      } as UserDto);
    }
  }, [current, setValues]);

  const saveDisabled = useMemo(() => !!errors?.email || !!errors?.balance || saveLoading, [errors, saveLoading]);

  return (
    <Widget title="Редакция пользователя">
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
          label="Password (leave blank to keep)"
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
}
