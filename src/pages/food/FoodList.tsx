// pages/food/FoodList.tsx
import React, { useMemo, useState } from 'react';
import {
  Button,
  Chip,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  ImageList,
  ImageListItem,
  Typography,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { FoodDto, imgApiUrl, useFoodActions, useFoodDispatch, useFoodState } from '../../context/FoodContext';
import { useFoodRefs } from '../../context/FoodContext';

import { BaseListGrid } from 'components/BaseListGrid';
import { Add as AddIcon, CreateOutlined as CreateIcon, DeleteOutlined as DeleteIcon } from '@mui/icons-material';

type FoodDispatch = ReturnType<typeof useFoodDispatch>;

const imageKeys = ['img', 'img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9', 'img10'] as const;

const collectImageNames = (row: FoodDto): string[] => {
  const names: string[] = [];
  imageKeys.forEach((key) => {
    const value = (row as Record<string, unknown>)[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) names.push(trimmed);
    }
  });
  return names;
};

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
  const state = useFoodState();

  const [filter, setFilter] = useState('');

  // state для диалога картинок
  const [imgDialogOpen, setImgDialogOpen] = useState(false);
  const [imgDialogTitle, setImgDialogTitle] = useState<string>('');
  const [imgDialogItems, setImgDialogItems] = useState<string[]>([]);

  const openImagesDialog = (row: FoodDto) => {
    const names = collectImageNames(row);
    if (names.length === 0) return;
    setImgDialogTitle(row?.title || `Товар #${row?.id}`);
    setImgDialogItems(names);
    setImgDialogOpen(true);
  };

  const columns = useMemo<GridColDef<FoodDto>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
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
        width: 220,
        sortable: false,
        filterable: false,
        renderCell: (p) => {
          const row = p.row as FoodDto;
          const imageNames = collectImageNames(row);
          const clickable = imageNames.length > 0;

          const handleClick = (e: React.MouseEvent) => {
            if (!clickable) return;
            e.stopPropagation();
            openImagesDialog(row);
          };

          return (
            <Stack alignItems="center" flexDirection="row" spacing={1} sx={{ width: '100%' }}>
              {p.value ? (
                <img
                  src={`${imgApiUrl}/${p.value}`}
                  alt=""
                  style={{
                    width: 56,
                    height: 56,
                    objectFit: 'cover',
                    borderRadius: 8,
                    display: 'block',
                    cursor: clickable ? 'pointer' : 'default'
                  }}
                  onClick={handleClick}
                />
              ) : (
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1,
                    bgcolor: 'grey.100',
                    cursor: clickable ? 'pointer' : 'default'
                  }}
                  onClick={handleClick}
                />
              )}
            </Stack>
          );
        }
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
      {
        field: 'tasteId',
        headerName: 'Вкус',
        width: 160,
        renderCell: (p) => <span>{nameOrId(refs?.taste, (p.row as any)?.tasteId)}</span>
      },
      {
        field: 'ingredientId',
        headerName: 'Ингредиент',
        width: 180,
        renderCell: (p) => <span>{nameOrId(refs?.ingredient, (p.row as any)?.ingredientId)}</span>
      },
      {
        field: 'hardnessId',
        headerName: 'Твёрдость',
        width: 160,
        renderCell: (p) => <span>{nameOrId(refs?.hardness, (p.row as any)?.hardnessId)}</span>
      },
      {
        field: 'designedForIds',
        headerName: 'Назначение',
        flex: 1,
        minWidth: 220,
        renderCell: (p) => chipsByIds(refs?.designedFor, (p.row as any)?.designedForIds)
      },
      { field: 'ageIds', headerName: 'Возраст', flex: 1, minWidth: 160, renderCell: (p) => chipsByIds(refs?.ages, (p.row as any)?.ageIds) },
      {
        field: 'typeTreatIds',
        headerName: 'Тип лакомств',
        flex: 1,
        minWidth: 180,
        renderCell: (p) => chipsByIds(refs?.typeTreats, (p.row as any)?.typeTreatIds)
      },
      {
        field: 'petSizeIds',
        headerName: 'Размер питомца',
        flex: 1,
        minWidth: 180,
        renderCell: (p) => chipsByIds(refs?.petSizes, (p.row as any)?.petSizeIds)
      },
      {
        field: 'packageIds',
        headerName: 'Упаковки',
        flex: 1,
        minWidth: 180,
        renderCell: (p) => chipsByIds(refs?.packages, (p.row as any)?.packageIds)
      },
      {
        field: 'specialNeedsIds',
        headerName: 'Особые нужды',
        flex: 1,
        minWidth: 220,
        renderCell: (p) => chipsByIds(refs?.specialNeeds, (p.row as any)?.specialNeedsIds)
      }
    ],
    [navigate, refs]
  );

  const handleDelete = () =>
    actions
      .doDelete(state.idToDelete as number)(dispatch)
      .then(() => actions.doFetch()(dispatch));
  const closeDelete = () => actions.doCloseConfirm()(dispatch);

  const applyFilter = () => actions.doFetch(0, undefined, filter || null)(dispatch);

  return (
    <Stack spacing={3}>
      <Widget inheritHeight noBodyPadding title="Каталог">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
          <TextField
            size="small"
            label="Поиск"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
            sx={{ width: 320 }}
          />
          <Button size="small" variant="outlined" onClick={applyFilter}>
            Найти
          </Button>
        </Stack>

        <BaseListGrid<FoodDto, FoodDispatch>
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

      {/* Диалог с доп. фотографиями */}
      <Dialog open={imgDialogOpen} onClose={() => setImgDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          {imgDialogTitle}
          <IconButton aria-label="close" onClick={() => setImgDialogOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ImageList cols={3} gap={12}>
            {imgDialogItems.map((name, idx) => (
              <ImageListItem key={`${name}-${idx}`}>
                <img
                  src={`${imgApiUrl}/${name}`}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} title={name}>
                  {name}
                </Typography>
              </ImageListItem>
            ))}
          </ImageList>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

export default FoodList;
