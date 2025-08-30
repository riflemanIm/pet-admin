// src/pages/user/EditUser.tsx
import React, { useEffect } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useManagementDispatch, useManagementState, actions } from '../../context/ManagementContext';
import { UserDto } from '../../helpers/dto';
import useForm from '../../hooks/useForm';
import validate from './validation';

const EditUser = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useManagementDispatch();
  const { current } = useManagementState();

  useEffect(() => {
    if (id) actions.doFind(Number(id))(dispatch);
  }, [id]);

  const save = () => {
    if (!id) return;
    const payload: UserDto = { ...values, name: values.name ?? null };
    if (!payload.password) delete (payload as any).password; // не меняем пароль, если пуст
    actions.doUpdate(Number(id), payload, () => navigate('/user/list'))(dispatch);
  };

  const { values, errors, handleChange, setValues } = useForm<UserDto, any>(save, validate);

  useEffect(() => {
    if (current) setValues({ ...current, password: '' });
  }, [current]);

  return (
    <Widget>
      <Box display="flex" flexDirection="column" gap={2} maxWidth={520}>
        <TextField name="email" label="Email" value={values.email || ''} onChange={handleChange} />
        <TextField
          name="password"
          type="password"
          label="Password (leave blank to keep)"
          value={values.password || ''}
          onChange={handleChange}
        />
        <TextField name="name" label="Name" value={(values.name as any) || ''} onChange={handleChange} />
        <TextField name="balance" label="Balance (string/decimal)" value={values.balance ?? ''} onChange={handleChange} />
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/user/list')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={!!errors?.email || !!errors?.balance}>
            Save
          </Button>
        </Stack>
      </Box>
    </Widget>
  );
};

export default EditUser;
