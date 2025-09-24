// pages/food/EditFood.tsx
import React, { useEffect } from 'react';
import { Button, MenuItem, Stack, TextField, Switch, FormControlLabel, Typography, Divider } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // ✅ MUI v6 Grid2
import { useNavigate, useParams } from 'react-router-dom';
import Widget from '../../components/Widget';
import { imgApiUrl, useFoodActions, useFoodDispatch, useFoodState } from '../../context/FoodContext';
import { useFoodRefs } from '../../context/FoodContext';
import { MultiDict, SingleDict } from './_formParts';
import ImageField from './_ImageField';
import HtmlEditor from '../../components/HtmlEditor';

const EditFood = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const actions = useFoodActions();
  const dispatch = useFoodDispatch();
  const { current } = useFoodState();
  const { refs } = useFoodRefs();

  const [form, setForm] = React.useState<any>(null);

  // файлы изображений: основное + 10 доп.
  const [imgFile, setImgFile] = React.useState<File | null>(null);
  const [img1File, setImg1File] = React.useState<File | null>(null);
  const [img2File, setImg2File] = React.useState<File | null>(null);
  const [img3File, setImg3File] = React.useState<File | null>(null);
  const [img4File, setImg4File] = React.useState<File | null>(null);
  const [img5File, setImg5File] = React.useState<File | null>(null);
  const [img6File, setImg6File] = React.useState<File | null>(null);
  const [img7File, setImg7File] = React.useState<File | null>(null);
  const [img8File, setImg8File] = React.useState<File | null>(null);
  const [img9File, setImg9File] = React.useState<File | null>(null);
  const [img10File, setImg10File] = React.useState<File | null>(null);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const onStr = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value);
  const onNum = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value === '' ? null : Number(e.target.value));
  const onBool = (k: string) => (_: any, checked: boolean) => set(k, checked);

  useEffect(() => {
    if (id) actions.doFind(Number(id))(dispatch);
  }, [id]);

  useEffect(() => {
    if (current) {
      setForm({
        ...current,
        // базовые строковые/числовые/булевые
        artikul: current.artikul ?? '',
        title: current.title ?? '',
        type: current.type ?? 'Treat',
        price: current.price ?? null,
        priceDiscount: current.priceDiscount ?? null,
        stock: current.stock ?? null,
        vat: !!current.vat,
        isPromo: !!current.isPromo,
        ozonId: current.ozonId ?? '',
        imgUrl: current.imgUrl ?? '',
        feature: current.feature ?? '',
        weight: current.weight ?? null,
        quantity: current.quantity ?? null,
        quantityPackages: current.quantityPackages ?? null,
        expiration: current.expiration ?? null,
        packageSize: current.packageSize ?? '',
        annotation: current.annotation ?? '',

        // связи 1→N
        tasteId: current.tasteId ?? null,
        ingredientId: current.ingredientId ?? null,
        hardnessId: current.hardnessId ?? null,

        // связи M:N – всегда массивы
        designedForIds: current.designedForIds ?? [],
        ageIds: current.ageIds ?? [],
        typeTreatIds: current.typeTreatIds ?? [],
        petSizeIds: current.petSizeIds ?? [],
        packageIds: current.packageIds ?? [],
        specialNeedsIds: current.specialNeedsIds ?? [],

        // изображения
        img: current.img ?? null,
        img1: (current as any).img1 ?? null,
        img2: (current as any).img2 ?? null,
        img3: (current as any).img3 ?? null,
        img4: (current as any).img4 ?? null,
        img5: (current as any).img5 ?? null,
        img6: (current as any).img6 ?? null,
        img7: (current as any).img7 ?? null,
        img8: (current as any).img8 ?? null,
        img9: (current as any).img9 ?? null,
        img10: (current as any).img10 ?? null
      });

      // сброс файлов
      setImgFile(null);
      setImg1File(null);
      setImg2File(null);
      setImg3File(null);
      setImg4File(null);
      setImg5File(null);
      setImg6File(null);
      setImg7File(null);
      setImg8File(null);
      setImg9File(null);
      setImg10File(null);
    }
  }, [current]);

  if (!form) return <Widget>Загрузка…</Widget>;

  const appendIfDefined = (fd: FormData, key: string, val: any) => {
    if (val === undefined) return;
    if (Array.isArray(val)) fd.append(key, JSON.stringify(val));
    else if (val === null) fd.append(key, '');
    else if (typeof val === 'boolean') fd.append(key, val ? 'true' : 'false');
    else fd.append(key, String(val));
  };

  const save = () => {
    const fd = new FormData();

    // простые/JSON поля
    Object.entries(form).forEach(([k, v]) => appendIfDefined(fd, k, v));

    // файлы (если выбраны)
    if (imgFile) fd.append('imgFile', imgFile);
    if (img1File) fd.append('img1File', img1File);
    if (img2File) fd.append('img2File', img2File);
    if (img3File) fd.append('img3File', img3File);
    if (img4File) fd.append('img4File', img4File);
    if (img5File) fd.append('img5File', img5File);
    if (img6File) fd.append('img6File', img6File);
    if (img7File) fd.append('img7File', img7File);
    if (img8File) fd.append('img8File', img8File);
    if (img9File) fd.append('img9File', img9File);
    if (img10File) fd.append('img10File', img10File);

    actions.doUpdate(
      Number(id),
      fd as any,
      () => navigate('/food/list'),
      (msg) => console.error(msg)
    )(dispatch);
  };

  return (
    <Widget>
      <Grid2 container spacing={3}>
        {/* Левая колонка */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <TextField label="Артикул" value={form.artikul} onChange={onStr('artikul')} />
            <TextField label="Название" value={form.title} onChange={onStr('title')} />
            <TextField select label="Тип" value={form.type} onChange={onStr('type')}>
              <MenuItem value="Treat">Treat</MenuItem>
              <MenuItem value="Souvenirs">Souvenirs</MenuItem>
              <MenuItem value="DryFood">DryFood</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2}>
              <TextField type="number" label="Цена" value={form.price ?? ''} onChange={onNum('price')} sx={{ flex: 1 }} />
              <TextField type="number" label="Скидка" value={form.priceDiscount ?? ''} onChange={onNum('priceDiscount')} sx={{ flex: 1 }} />
            </Stack>

            <TextField type="number" label="Сток" value={form.stock ?? ''} onChange={onNum('stock')} />

            <Stack direction="row" spacing={2}>
              <FormControlLabel control={<Switch checked={!!form.vat} onChange={onBool('vat')} />} label="НДС" />
              <FormControlLabel control={<Switch checked={!!form.isPromo} onChange={onBool('isPromo')} />} label="Промо" />
            </Stack>

            <Divider />

            <Typography variant="subtitle2">Marketplace / ссылки</Typography>
            <TextField label="Ozon ID" value={form.ozonId} onChange={onStr('ozonId')} />
            <TextField label="Img URL" value={form.imgUrl} onChange={onStr('imgUrl')} />
          </Stack>
        </Grid2>

        {/* Правая колонка */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            <TextField label="Короткое описание (feature)" value={form.feature} onChange={onStr('feature')} />

            <Stack direction="row" spacing={2}>
              <TextField type="number" label="Вес (г)" value={form.weight ?? ''} onChange={onNum('weight')} sx={{ flex: 1 }} />
              <TextField type="number" label="Кол-во (шт)" value={form.quantity ?? ''} onChange={onNum('quantity')} sx={{ flex: 1 }} />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                type="number"
                label="Кол-во упаковок"
                value={form.quantityPackages ?? ''}
                onChange={onNum('quantityPackages')}
                sx={{ flex: 1 }}
              />
              <TextField
                type="number"
                label="Срок годн. (дн.)"
                value={form.expiration ?? ''}
                onChange={onNum('expiration')}
                sx={{ flex: 1 }}
              />
            </Stack>

            <TextField label="Размер упаковки" value={form.packageSize} onChange={onStr('packageSize')} />

            <Typography variant="subtitle2">Аннотация</Typography>
            <HtmlEditor value={form.annotation ?? ''} onChange={(html) => set('annotation', html)} />

            <SingleDict label="Вкус" options={refs.taste} value={form.tasteId} onChange={(id) => set('tasteId', id)} />
            <SingleDict label="Ингредиент" options={refs.ingredient} value={form.ingredientId} onChange={(id) => set('ingredientId', id)} />
            <SingleDict label="Твёрдость" options={refs.hardness} value={form.hardnessId} onChange={(id) => set('hardnessId', id)} />

            {/* Основное изображение */}
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Основное изображение
            </Typography>

            <ImageField value={form.img} onFileSelect={setImgFile} onClear={() => set('img', null)} />
          </Stack>
        </Grid2>

        {/* M:N словари */}
        <Grid2 size={12}>
          <Stack spacing={2}>
            <MultiDict
              label="Назначение"
              options={refs.designedFor}
              value={form.designedForIds}
              onChange={(ids) => set('designedForIds', ids)}
            />
            <MultiDict label="Возраст" options={refs.ages} value={form.ageIds} onChange={(ids) => set('ageIds', ids)} />
            <MultiDict
              label="Тип лакомств"
              options={refs.typeTreats}
              value={form.typeTreatIds}
              onChange={(ids) => set('typeTreatIds', ids)}
            />
            <MultiDict label="Размер питомца" options={refs.petSizes} value={form.petSizeIds} onChange={(ids) => set('petSizeIds', ids)} />
            <MultiDict label="Упаковки" options={refs.packages} value={form.packageIds} onChange={(ids) => set('packageIds', ids)} />
            <MultiDict
              label="Особые нужды"
              options={refs.specialNeeds}
              value={form.specialNeedsIds}
              onChange={(ids) => set('specialNeedsIds', ids)}
            />
          </Stack>
        </Grid2>

        {/* Доп. изображения img1..img10 */}
        <Grid2 size={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Дополнительные изображения (до 10 шт.)
          </Typography>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 1</Typography>
              <ImageField value={form.img1 || null} onFileSelect={setImg1File} onClear={() => set('img1', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 2</Typography>
              <ImageField value={form.img2 || null} onFileSelect={setImg2File} onClear={() => set('img2', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 3</Typography>
              <ImageField value={form.img3 || null} onFileSelect={setImg3File} onClear={() => set('img3', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 4</Typography>
              <ImageField value={form.img4 || null} onFileSelect={setImg4File} onClear={() => set('img4', null)} />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 5</Typography>
              <ImageField value={form.img5 || null} onFileSelect={setImg5File} onClear={() => set('img5', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 6</Typography>
              <ImageField value={form.img6 || null} onFileSelect={setImg6File} onClear={() => set('img6', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 7</Typography>
              <ImageField value={form.img7 || null} onFileSelect={setImg7File} onClear={() => set('img7', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 8</Typography>
              <ImageField value={form.img8 || null} onFileSelect={setImg8File} onClear={() => set('img8', null)} />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 9</Typography>
              <ImageField value={form.img9 || null} onFileSelect={setImg9File} onClear={() => set('img9', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 10</Typography>
              <ImageField value={form.img10 || null} onFileSelect={setImg10File} onClear={() => set('img10', null)} />
            </Grid2>
          </Grid2>
        </Grid2>

        {/* Кнопки */}
        <Grid2 size={12}>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button variant="outlined" onClick={() => navigate('/food/list')}>
              Отмена
            </Button>
            <Button variant="contained" onClick={save}>
              Сохранить
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </Widget>
  );
};

export default EditFood;
