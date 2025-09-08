// pages/food/AddFood.tsx
import React from 'react';
import { Box, Button, Grid, Stack, TextField, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useFoodActions } from '../../context/FoodContext';
import { useFoodRefs } from '../../context/FoodContext';
import { MultiDict, SingleDict } from './_formParts';
import ImageField from './_ImageField';
const AddFood = (): JSX.Element => {
  const navigate = useNavigate();
  const actions = useFoodActions();
  const { refs } = useFoodRefs();

  const [form, setForm] = React.useState({
    artikul: '',
    img: null,
    title: '',
    type: 'Treat' as 'Treat' | 'Souvenirs' | 'DryFood',
    price: 0,
    priceDiscount: 0,
    stock: 0,
    isPromo: false,
    tasteId: null as number | null,
    ingredientId: null as number | null,
    hardnessId: null as number | null,
    designedForIds: [] as number[],
    ageIds: [] as number[],
    typeTreatIds: [] as number[],
    petSizeIds: [] as number[],
    packageIds: [] as number[],
    specialNeedsIds: [] as number[],
    imgsAdd: [] as string[]
  });

  const onChange = (k: string) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const [imgFile, setImgFile] = React.useState<File | null>(null);

  const save = async () => {
    const fd = new FormData();
    // простые поля
    Object.entries(form).forEach(([k, v]) => {
      if (v == null) return;
      if (Array.isArray(v)) {
        fd.append(k, JSON.stringify(v)); // массивы — как JSON
      } else {
        fd.append(k, String(v));
      }
    });
    if (imgFile) fd.append('imgFile', imgFile);

    actions.doCreate(
      fd as any, // genericActions шлёт как есть
      () => navigate('/food/list'),
      (msg) => console.error(msg)
    );
  };

  return (
    <Widget>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            {/* ... taste/ingredient/hardness ... */}
            <ImageField
              value={form.img || null}
              onFileSelect={(file) => setImgFile(file)}
              onClear={() => setForm((f) => ({ ...f, img: null }))}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <TextField label="Артикул" value={form.artikul} onChange={onChange('artikul')} />
            <TextField label="Название" value={form.title} onChange={onChange('title')} />
            <TextField select label="Тип" value={form.type} onChange={onChange('type')}>
              <MenuItem value="Treat">Treat</MenuItem>
              <MenuItem value="Souvenirs">Souvenirs</MenuItem>
              <MenuItem value="DryFood">DryFood</MenuItem>
            </TextField>
            <TextField type="number" label="Цена" value={form.price} onChange={onChange('price')} />
            <TextField type="number" label="Скидка" value={form.priceDiscount} onChange={onChange('priceDiscount')} />
            <TextField type="number" label="Сток" value={form.stock} onChange={onChange('stock')} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <SingleDict label="Вкус" options={refs.taste} value={form.tasteId} onChange={(id) => setForm((f) => ({ ...f, tasteId: id }))} />
            <SingleDict
              label="Ингредиент"
              options={refs.ingredient}
              value={form.ingredientId}
              onChange={(id) => setForm((f) => ({ ...f, ingredientId: id }))}
            />
            <SingleDict
              label="Твёрдость"
              options={refs.hardness}
              value={form.hardnessId}
              onChange={(id) => setForm((f) => ({ ...f, hardnessId: id }))}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={2}>
            <MultiDict
              label="Назначение"
              options={refs.designedFor}
              value={form.designedForIds}
              onChange={(ids) => setForm((f) => ({ ...f, designedForIds: ids }))}
            />
            <MultiDict
              label="Возраст"
              options={refs.ages}
              value={form.ageIds}
              onChange={(ids) => setForm((f) => ({ ...f, ageIds: ids }))}
            />
            <MultiDict
              label="Тип лакомств"
              options={refs.typeTreats}
              value={form.typeTreatIds}
              onChange={(ids) => setForm((f) => ({ ...f, typeTreatIds: ids }))}
            />
            <MultiDict
              label="Размер питомца"
              options={refs.petSizes}
              value={form.petSizeIds}
              onChange={(ids) => setForm((f) => ({ ...f, petSizeIds: ids }))}
            />
            <MultiDict
              label="Упаковки"
              options={refs.packages}
              value={form.packageIds}
              onChange={(ids) => setForm((f) => ({ ...f, packageIds: ids }))}
            />
            <MultiDict
              label="Особые нужды"
              options={refs.specialNeeds}
              value={form.specialNeedsIds}
              onChange={(ids) => setForm((f) => ({ ...f, specialNeedsIds: ids }))}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined" onClick={() => navigate('/food/list')}>
              Отмена
            </Button>
            <Button variant="contained" onClick={save}>
              Сохранить
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Widget>
  );
};

export default AddFood;
