import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import Widget from '../../components/Widget';
import { useFoodActions, useFoodDispatch, useFoodState } from '../../context/FoodContext';

const FoodList = (): JSX.Element => {
  const dispatch = useFoodDispatch();
  const actions = useFoodActions();

  const { rows, totalCount, loading, errorMessage } = useFoodState();

  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);

  useEffect(() => {
    const orderBy = sortModel[0]?.field ?? 'id';
    const order = (sortModel[0]?.sort ?? 'desc') as 'asc' | 'desc';
    actions.doFetch(pagination.page * pagination.pageSize, pagination.pageSize, filter || null, orderBy, order)(dispatch);
  }, [dispatch, actions, filter, pagination, sortModel]);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      { field: 'artikul', headerName: 'Артикул', width: 140 },
      { field: 'title', headerName: 'Название', flex: 1, minWidth: 240 },
      { field: 'type', headerName: 'Тип', width: 120 },
      { field: 'price', headerName: 'Цена', width: 120, type: 'number' },
      { field: 'priceDiscount', headerName: 'Скидка', width: 120, type: 'number' },
      { field: 'stock', headerName: 'Сток', width: 100, type: 'number' },
      { field: 'isPromo', headerName: 'Промо', width: 110, type: 'boolean' },
      { field: 'createdAt', headerName: 'Создан', width: 170 }
    ],
    []
  );

  return (
    <Widget>
      <Box mb={2}>
        <TextField size="small" label="Поиск" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: 320 }} />
      </Box>

      <Box sx={{ height: 650, width: '100%' }}>
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
};

export default FoodList;
