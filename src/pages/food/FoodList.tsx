// pages/food/FoodList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Stack, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useFoodActions, useFoodDispatch, useFoodState } from '../../context/FoodContext';
import { useFoodRefs } from '../../context/FoodContext';

type Row = {
  id: number;
  artikul?: string | null;
  title?: string | null;
  type?: 'Treat' | 'Souvenirs' | 'DryFood';
  price?: number;
  priceDiscount?: number;
  stock?: number;
  isPromo?: boolean;
  createdAt?: string;

  tasteId?: number | null;
  ingredientId?: number | null;
  hardnessId?: number | null;

  designedForIds?: number[];
  ageIds?: number[];
  typeTreatIds?: number[];
  petSizeIds?: number[];
  packageIds?: number[];
  specialNeedsIds?: number[];
};
// безопасно достаём имя по id
// нормализуем к Number с безопасной обработкой null/undefined
const asNum = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const nameById = (list?: { id: number | string; name: string }[], id?: number | string | null) => {
  const lid = asNum(id);
  if (!Array.isArray(list) || lid == null) return '';
  const item = list.find((x) => asNum(x.id) === lid);
  return item?.name ?? '';
};

const nameOrId = (list?: { id: number | string; name: string }[], id?: number | string | null) => {
  const n = nameById(list, id);
  const lid = asNum(id);
  return n || (lid ?? '');
};

// для множественных
const chipsByIds = (list?: { id: number | string; name: string }[], ids?: Array<number | string>) =>
  !Array.isArray(list) || !Array.isArray(ids) || ids.length === 0 ? null : (
    <Stack direction="row" gap={0.5} flexWrap="wrap">
      {ids.map((id) => (
        <Chip key={String(id)} size="small" label={nameOrId(list, id)} />
      ))}
    </Stack>
  );

const FoodList = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useFoodDispatch();
  const actions = useFoodActions();
  const { refs } = useFoodRefs();

  const { rows, totalCount, loading, errorMessage } = useFoodState();

  const [filter, setFilter] = useState('');
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('refs keys:', Object.keys(refs || {}));
    // eslint-disable-next-line no-console
    console.log('taste len:', refs?.taste?.length, 'ingredient len:', refs?.ingredient?.length, 'hardness len:', refs?.hardness?.length);
  }, [refs]);
  useEffect(() => {
    const orderBy = sortModel[0]?.field ?? 'id';
    const order = (sortModel[0]?.sort ?? 'desc') as 'asc' | 'desc';
    actions.doFetch(pagination.page * pagination.pageSize, pagination.pageSize, filter || null, orderBy, order)(dispatch);
  }, [dispatch, actions, filter, pagination, sortModel]);

  const nameById = (list: { id: number; name: string }[] | undefined, id?: number | null) =>
    !list || !id ? '' : (list.find((x) => x.id === id)?.name ?? '');

  const chipsByIds = (list: { id: number; name: string }[] | undefined, ids?: number[]) =>
    !list || !ids?.length ? null : (
      <Stack direction="row" gap={0.5} flexWrap="wrap">
        {ids.map((id) => (
          <Chip key={id} size="small" label={nameById(list, id)} />
        ))}
      </Stack>
    );

  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      {
        field: 'img',
        headerName: 'Фото',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (p) =>
          p.value ? <img src={`/uploads/${p.value}`} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} /> : null
      },
      { field: 'artikul', headerName: 'Артикул', width: 140 },
      { field: 'title', headerName: 'Название', flex: 1, minWidth: 220 },
      { field: 'type', headerName: 'Тип', width: 120 },
      { field: 'price', headerName: 'Цена', width: 120, type: 'number' },
      { field: 'priceDiscount', headerName: 'Скидка', width: 120, type: 'number' },
      { field: 'stock', headerName: 'Сток', width: 90, type: 'number' },
      {
        field: 'isPromo',
        headerName: 'Промо',
        width: 100,
        type: 'boolean',
        renderCell: (p) => (p.value ? <Chip size="small" label="Да" /> : <Chip size="small" variant="outlined" label="Нет" />)
      },
      // 1→N (valueGetter с защитой)
      {
        field: 'tasteId',
        headerName: 'Вкус',
        width: 160,
        renderCell: (p) => <span>{nameOrId(refs?.taste, (p?.row as any)?.tasteId ?? p?.value ?? null)}</span>
      },
      {
        field: 'ingredientId',
        headerName: 'Ингредиент',
        width: 180,
        renderCell: (p) => <span>{nameOrId(refs?.ingredient, (p?.row as any)?.ingredientId ?? p?.value ?? null)}</span>
      },
      {
        field: 'hardnessId',
        headerName: 'Твёрдость',
        width: 160,
        renderCell: (p) => <span>{nameOrId(refs?.hardness, (p?.row as any)?.hardnessId ?? p?.value ?? null)}</span>
      },
      // M:N (chips с защитой)
      {
        field: 'designedForIds',
        headerName: 'Назначение',
        flex: 1,
        minWidth: 220,
        renderCell: (p) => chipsByIds(refs?.designedFor, (p?.row as any)?.designedForIds)
      },
      {
        field: 'ageIds',
        headerName: 'Возраст',
        flex: 1,
        minWidth: 160,
        renderCell: (p) => chipsByIds(refs?.ages, (p?.row as any)?.ageIds)
      },
      {
        field: 'typeTreatIds',
        headerName: 'Тип лакомств',
        flex: 1,
        minWidth: 180,
        renderCell: (p) => chipsByIds(refs?.typeTreats, (p?.row as any)?.typeTreatIds)
      },
      {
        field: 'petSizeIds',
        headerName: 'Размер питомца',
        flex: 1,
        minWidth: 180,
        renderCell: (p) => chipsByIds(refs?.petSizes, (p?.row as any)?.petSizeIds)
      },
      {
        field: 'packageIds',
        headerName: 'Упаковки',
        flex: 1,
        minWidth: 180,
        renderCell: (p) => chipsByIds(refs?.packages, (p?.row as any)?.packageIds)
      },
      {
        field: 'specialNeedsIds',
        headerName: 'Особые нужды',
        flex: 1,
        minWidth: 220,
        renderCell: (p) => chipsByIds(refs?.specialNeeds, (p?.row as any)?.specialNeedsIds)
      },
      {
        field: '__actions',
        headerName: 'Действия',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Button size="small" variant="outlined" onClick={() => navigate(`/food/edit/${params.row.id}`)}>
            Редактировать
          </Button>
        )
      }
    ],
    [navigate, refs]
  );

  return (
    <Widget>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
        <TextField size="small" label="Поиск" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: 320 }} />
        <Button variant="contained" onClick={() => navigate('/food/add')}>
          Добавить
        </Button>
      </Stack>

      <Box sx={{ height: 700, width: '100%' }}>
        <DataGrid
          rows={(rows ?? []) as Row[]}
          getRowId={(r) => (r as any)?.id}
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
