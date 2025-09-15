// pages/food/EditFood.tsx
import React, { useEffect } from 'react';
import { Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useFoodActions, useFoodDispatch, useFoodState } from '../../context/FoodContext';
import { useFoodRefs } from '../../context/FoodContext';
import { MultiDict, SingleDict } from './_formParts';
import ImageField from './_ImageField'; // ⬅️ добавили

const EditFood = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const actions = useFoodActions();
  const dispatch = useFoodDispatch();
  const { current } = useFoodState();
  const { refs } = useFoodRefs();

  const [form, setForm] = React.useState<any>(null);
  const [imgFile, setImgFile] = React.useState<File | null>(null); // ⬅️ добавили

  // загрузить детально
  useEffect(() => {
    if (id) actions.doFind(Number(id))(dispatch);
  }, [id]);

  // подставить в форму
  useEffect(() => {
    if (current) {
      setForm({
        ...current,
        // важно: чтобы можно было «очистить» картинку, держим поле img в форме
        img: current.img ?? null,
        designedForIds: current.designedForIds ?? [],
        ageIds: current.ageIds ?? [],
        typeTreatIds: current.typeTreatIds ?? [],
        petSizeIds: current.petSizeIds ?? [],
        packageIds: current.packageIds ?? [],
        specialNeedsIds: current.specialNeedsIds ?? []
      });
      setImgFile(null); // сброс выбранного файла при подстановке
    }
  }, [current]);

  if (!form) return <Widget>Загрузка…</Widget>;

  const onChange = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  // ⬇️ отправляем как multipart/form-data
  const save = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v === undefined) return;
      if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
      else if (v === null)
        fd.append(k, ''); // пустая строка => очистить (см. API)
      else fd.append(k, String(v));
    });
    if (imgFile) fd.append('imgFile', imgFile);

    actions.doUpdate(
      Number(id),
      fd as any,
      () => navigate('/food/list'),
      (msg) => console.error(msg)
    )(dispatch);
  };

  return (
    <Widget>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <TextField label="Артикул" value={form.artikul || ''} onChange={onChange('artikul')} />
            <TextField label="Название" value={form.title || ''} onChange={onChange('title')} />
            <TextField select label="Тип" value={form.type || 'Treat'} onChange={onChange('type')}>
              <MenuItem value="Treat">Treat</MenuItem>
              <MenuItem value="Souvenirs">Souvenirs</MenuItem>
              <MenuItem value="DryFood">DryFood</MenuItem>
            </TextField>
            <TextField type="number" label="Цена" value={form.price ?? 0} onChange={onChange('price')} />
            <TextField type="number" label="Скидка" value={form.priceDiscount ?? 0} onChange={onChange('priceDiscount')} />
            <TextField type="number" label="Сток" value={form.stock ?? 0} onChange={onChange('stock')} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <SingleDict
              label="Вкус"
              options={refs.taste}
              value={form.tasteId ?? null}
              onChange={(id) => setForm((f: any) => ({ ...f, tasteId: id }))}
            />
            <SingleDict
              label="Ингредиент"
              options={refs.ingredient}
              value={form.ingredientId ?? null}
              onChange={(id) => setForm((f: any) => ({ ...f, ingredientId: id }))}
            />
            <SingleDict
              label="Твёрдость"
              options={refs.hardness}
              value={form.hardnessId ?? null}
              onChange={(id) => setForm((f: any) => ({ ...f, hardnessId: id }))}
            />

            {/* ⬇️ блок загрузки/очистки изображения */}
            <ImageField
              value={form.img || null}
              onFileSelect={(file) => setImgFile(file)}
              onClear={() => setForm((f: any) => ({ ...f, img: null }))}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack spacing={2}>
            <MultiDict
              label="Назначение"
              options={refs.designedFor}
              value={form.designedForIds}
              onChange={(ids) => setForm((f: any) => ({ ...f, designedForIds: ids }))}
            />
            <MultiDict
              label="Возраст"
              options={refs.ages}
              value={form.ageIds}
              onChange={(ids) => setForm((f: any) => ({ ...f, ageIds: ids }))}
            />
            <MultiDict
              label="Тип лакомств"
              options={refs.typeTreats}
              value={form.typeTreatIds}
              onChange={(ids) => setForm((f: any) => ({ ...f, typeTreatIds: ids }))}
            />
            <MultiDict
              label="Размер питомца"
              options={refs.petSizes}
              value={form.petSizeIds}
              onChange={(ids) => setForm((f: any) => ({ ...f, petSizeIds: ids }))}
            />
            <MultiDict
              label="Упаковки"
              options={refs.packages}
              value={form.packageIds}
              onChange={(ids) => setForm((f: any) => ({ ...f, packageIds: ids }))}
            />
            <MultiDict
              label="Особые нужды"
              options={refs.specialNeeds}
              value={form.specialNeedsIds}
              onChange={(ids) => setForm((f: any) => ({ ...f, specialNeedsIds: ids }))}
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

export default EditFood;
