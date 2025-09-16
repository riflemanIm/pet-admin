// pages/food/FoodList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Stack, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridPaginationModel, GridRowParams, GridSortModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { imgApiUrl, useFoodActions, useFoodDispatch, useFoodState } from '../../context/FoodContext';
import { useFoodRefs } from '../../context/FoodContext';
import EditIcon from '@mui/icons-material/Edit';
import { FoodDto } from 'helpers/dto';
import { BaseListGrid } from 'components/BaseListGrid';
import { Add as AddIcon, CreateOutlined as CreateIcon, DeleteOutlined as DeleteIcon } from '@mui/icons-material';

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
// const chipsByIds = (list?: { id: number | string; name: string }[], ids?: Array<number | string>) =>
//   !Array.isArray(list) || !Array.isArray(ids) || ids.length === 0 ? null : (
//     <Stack direction="row" gap={0.5} flexWrap="wrap">
//       {ids.map((id) => (
//         <Chip key={String(id)} size="small" label={nameOrId(list, id)} />
//       ))}
//     </Stack>
//   );

const FoodList = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useFoodDispatch();
  const actions = useFoodActions();
  const { refs } = useFoodRefs();

  const state = useFoodState();

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

  const columns = useMemo<GridColDef<FoodDto>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      // {
      //   field: '__actions',
      //   headerName: 'Действия',
      //   width: 140,
      //   sortable: false,
      //   filterable: false,
      //   renderCell: (params) => (
      //     <Button startIcon={<EditIcon />} size="small" variant="outlined" onClick={() => navigate(`/food/edit/${params.row.id}`)}>
      //       Ред.
      //     </Button>
      //   )
      // },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        filterable: false,
        type: 'actions',
        getActions: (params: GridRowParams<FoodDto>) => [
          <GridActionsCellItem key="edit" icon={<CreateIcon />} label="Edit" onClick={() => navigate(`/food/${params.id}/edit`)} />,
          <GridActionsCellItem
            key="del"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => actions.doOpenConfirm(params.id as number)(dispatch)}
          />
        ]
      },
      {
        field: 'img',
        headerName: 'Фото',
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (p) =>
          p.value ? (
            <img src={`${imgApiUrl}/${p.value}`} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
          ) : null
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
      }
    ],
    [navigate, refs]
  );
  const handleDelete = () =>
    actions
      .doDelete(state.idToDelete as number)(dispatch)
      .then(() => actions.doFetch()(dispatch));
  const closeDelete = () => actions.doCloseConfirm()(dispatch);

  return (
    <Stack spacing={3}>
      <Widget inheritHeight noBodyPadding title="Каталог">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
          <TextField size="small" label="Поиск" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ width: 320 }} />
        </Stack>

        <BaseListGrid<FoodDto>
          columns={columns}
          idField="id"
          exportName="food"
          storagePrefix="food"
          state={state}
          dispatch={dispatch}
          doFetch={actions.doFetch}
          defaultSort={[{ field: 'id', sort: 'desc' }]}
          startActions={
            <Button size="small" color="primary" href="#food/add" startIcon={<AddIcon />}>
              Добавить
            </Button>
          }
          onDelete={handleDelete}
          onCloseDelete={closeDelete}
        />
      </Widget>
    </Stack>
  );
};

export default FoodList;
