// src/pages/user/AddUser.tsx
import React from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useManagementDispatch, actions } from '../../context/ManagementContext';
import { UserDto } from '../../helpers/dto';
import useForm from '../../hooks/useForm';
import validate from './validation';

const AddUser = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useManagementDispatch();

  const save = () => {
    const payload: UserDto = { ...values, name: values.name ?? null };
    actions.doCreate(payload, () => navigate('/user/list'))(dispatch);
  };

  const { values, errors, handleChange } = useForm<UserDto, any>(save, validate);

  return (
    <Widget>
      <Box display="flex" flexDirection="column" gap={2} maxWidth={520}>
        <TextField name="email" label="Email" value={values.email || ''} onChange={handleChange} />
        <TextField name="password" type="password" label="Password" value={values.password || ''} onChange={handleChange} />
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

export default AddUser;
