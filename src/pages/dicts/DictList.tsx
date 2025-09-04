import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { EntityName, useDictActions, useDictDispatch, useDictMeta, useDictState } from '../../context/DictContext';
import { DictDto } from '../../helpers/dto';

export default function DictList({ entity }: { entity: EntityName }) {
  const navigate = useNavigate();
  const dispatch = useDictDispatch();
  const actions = useDictActions();
  const { state } = { state: useDictState() };
  const { rows, totalCount, loading, errorMessage } = state;
  const { entity: ctxEntity } = useDictMeta();
  console.log('ctxEntity }', ctxEntity);
  // safety: если вложили не тем entity, можно подсветить
  const title = useMemo(() => {
    const map: Record<EntityName, string> = {
      ages: 'Возраст',
      taste: 'Вкус',
      designedFor: 'Для кого',
      ingredient: 'Ингредиент',
      hardness: 'Жёсткость',
      packages: 'Упаковки',
      petSizes: 'Размеры питомца',
      specialNeeds: 'Особые потребности'
    };
    return map[entity] ?? entity;
  }, [entity]);

  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'asc' }]);

  useEffect(() => {
    actions.doFetch(
      pagination.page * pagination.pageSize,
      pagination.pageSize,
      filter || null,
      sortModel[0]?.field ?? 'id',
      (sortModel[0]?.sort as 'asc' | 'desc' | undefined) ?? 'asc'
    )(dispatch);
  }, [dispatch, actions, filter, pagination, sortModel, ctxEntity]);

  const columns = useMemo<GridColDef<DictDto>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'name', headerName: 'Название', flex: 1, minWidth: 220 },
      {
        field: 'actions',
        headerName: '',
        sortable: false,
        filterable: false,
        width: 120,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={() => navigate(`/dicts/${entity}/edit/${params.row.id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => actions.doDelete(params.row.id as number)(dispatch)}>
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        )
      }
    ],
    [actions, dispatch, entity, navigate]
  );

  return (
    <Widget>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
        <Typography variant="h6">{title}</Typography>
        <Stack direction="row" gap={2}>
          <TextField size="small" label="Поиск" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: 260 }} />
          <Button variant="contained" onClick={() => navigate(`/dicts/${entity}/add`)}>
            Добавить
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ height: 560, width: '100%' }}>
        <DataGrid
          rows={rows}
          getRowId={(r) => r.id as number}
          columns={columns}
          rowCount={totalCount}
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          pageSizeOptions={[10, 25, 50]}
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
        />
      </Box>

      {errorMessage ? <div style={{ color: '#d32f2f', marginTop: 8 }}>{errorMessage}</div> : null}
    </Widget>
  );
}
