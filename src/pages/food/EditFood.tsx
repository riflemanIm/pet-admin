// pages/food/EditFood.tsx
import React, { useEffect } from 'react';
import { Box, Button, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useFoodActions, useFoodDispatch, useFoodState } from '../../context/FoodContext';
import { useFoodRefs } from '../../context/FoodContext';
import { MultiDict, SingleDict } from './_formParts';

const EditFood = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const actions = useFoodActions();
  const dispatch = useFoodDispatch();
  const { current } = useFoodState();
  const { refs } = useFoodRefs();

  const [form, setForm] = React.useState<any>(null);

  // загрузить детально
  useEffect(() => {
    if (id) actions.doFind(Number(id))(dispatch);
  }, [id]);

  // подставить в форму
  useEffect(() => {
    if (current) {
      setForm({
        ...current,
        designedForIds: current.designedForIds ?? [],
        ageIds: current.ageIds ?? [],
        typeTreatIds: current.typeTreatIds ?? [],
        petSizeIds: current.petSizeIds ?? [],
        packageIds: current.packageIds ?? [],
        specialNeedsIds: current.specialNeedsIds ?? []
      });
    }
  }, [current]);

  if (!form) return <Widget>Загрузка…</Widget>;

  const onChange = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));

  const save = () => {
    actions.doUpdate(
      Number(id),
      form,
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
