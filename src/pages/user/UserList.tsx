// src/pages/user/UserList.tsx
import React from 'react';
import { Button, Stack } from '@mui/material';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Add as AddIcon, CreateOutlined as CreateIcon, DeleteOutlined as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { BaseListGrid } from '../../components/BaseListGrid';
import { useManagementDispatch, useManagementState, actions } from '../../context/ManagementContext';
import { UserDto } from '../../helpers/dto';

const UserList = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useManagementDispatch();
  const st = useManagementState();

  React.useEffect(() => {
    actions.doFetch()(dispatch);
  }, []);

  const columns: GridColDef<UserDto>[] = [
    { field: 'userId', headerName: 'ID', width: 80, type: 'number' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      type: 'actions',
      getActions: (params: GridRowParams<UserDto>) => [
        <GridActionsCellItem key="edit" icon={<CreateIcon />} label="Edit" onClick={() => navigate(`/user/${params.id}/edit`)} />,
        <GridActionsCellItem
          key="del"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => actions.doOpenConfirm(params.id as number)(dispatch)}
        />
      ]
    },
    { field: 'email', headerName: 'Email', width: 240 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'balance', headerName: 'Balance', width: 140 }
  ];

  const handleDelete = () =>
    actions
      .doDelete(st.idToDelete as number)(dispatch)
      .then(() => actions.doFetch()(dispatch));
  const closeDelete = () => actions.doCloseConfirm()(dispatch);

  return (
    <Stack spacing={3}>
      <Widget inheritHeight noBodyPadding>
        <BaseListGrid<UserDto>
          columns={columns}
          idField="userId"
          exportName="users"
          storagePrefix="user"
          state={st}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[{ field: 'userId', sort: 'desc' }]}
          startActions={
            <Button size="small" color="primary" href="#user/add" startIcon={<AddIcon />}>
              Add
            </Button>
          }
          onDelete={handleDelete}
          onCloseDelete={closeDelete}
        />
      </Widget>
    </Stack>
  );
};

export default UserList;
