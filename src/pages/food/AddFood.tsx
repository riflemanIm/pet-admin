// pages/food/AddFood.tsx
import React from 'react';
import { Button, Divider, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useFoodActions, useFoodDispatch, useFoodRefs } from '../../context/FoodContext';
import { MultiDict, SingleDict } from './_formParts';
import ImageField from './_ImageField';
import HtmlEditor from '../../components/HtmlEditor';

type AddFoodForm = {
  artikul: string;
  title: string;
  type: 'Treat' | 'Souvenirs' | 'DryFood';
  price: number | null;
  priceDiscount: number | null;
  stock: number | null;
  vat: boolean;
  isPromo: boolean;
  ozonId: string;
  imgUrl: string;
  feature: string;
  weight: number | null;
  quantity: number | null;
  quantityPackages: number | null;
  expiration: number | null;
  packageSize: string;
  annotation: string;
  tasteId: number | null;
  ingredientId: number | null;
  hardnessId: number | null;
  designedForIds: number[];
  ageIds: number[];
  typeTreatIds: number[];
  petSizeIds: number[];
  packageIds: number[];
  specialNeedsIds: number[];
  img: string | null;
  img1: string | null;
  img2: string | null;
  img3: string | null;
  img4: string | null;
  img5: string | null;
  img6: string | null;
  img7: string | null;
  img8: string | null;
  img9: string | null;
  img10: string | null;
};

const initialFormState: AddFoodForm = {
  artikul: '',
  title: '',
  type: 'Treat',
  price: null,
  priceDiscount: null,
  stock: null,
  vat: false,
  isPromo: false,
  ozonId: '',
  imgUrl: '',
  feature: '',
  weight: null,
  quantity: null,
  quantityPackages: null,
  expiration: null,
  packageSize: '',
  annotation: '',
  tasteId: null,
  ingredientId: null,
  hardnessId: null,
  designedForIds: [],
  ageIds: [],
  typeTreatIds: [],
  petSizeIds: [],
  packageIds: [],
  specialNeedsIds: [],
  img: null,
  img1: null,
  img2: null,
  img3: null,
  img4: null,
  img5: null,
  img6: null,
  img7: null,
  img8: null,
  img9: null,
  img10: null
};

const AddFood = (): JSX.Element => {
  const navigate = useNavigate();
  const actions = useFoodActions();
  const dispatch = useFoodDispatch();
  const { refs } = useFoodRefs();

  const [form, setForm] = React.useState<AddFoodForm>(() => initialFormState);

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

  const setField = React.useCallback(<K extends keyof AddFoodForm>(key: K, value: AddFoodForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const onStr = (key: keyof AddFoodForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) =>
    setField(key, e.target.value as any);
  const onNum = (key: keyof AddFoodForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setField(key, value === '' ? null : (Number(value) as any));
  };
  const onBool = (key: keyof AddFoodForm) => (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setField(key, checked as any);

  const appendIfDefined = (fd: FormData, key: string, val: any) => {
    if (val === undefined) return;
    if (Array.isArray(val)) {
      fd.append(key, JSON.stringify(val));
    } else if (val === null) {
      fd.append(key, '');
    } else if (typeof val === 'boolean') {
      fd.append(key, val ? 'true' : 'false');
    } else {
      fd.append(key, String(val));
    }
  };

  const save = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => appendIfDefined(fd, key, value));

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

    actions.doCreate(
      fd as any,
      () => navigate('/food/list'),
      (msg) => console.error(msg)
    )(dispatch);
  };

  return (
    <Widget>
      <Grid2 container spacing={3}>
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
            <HtmlEditor value={form.annotation ?? ''} onChange={(html) => setField('annotation', html)} />

            <SingleDict label="Вкус" options={refs.taste} value={form.tasteId} onChange={(id) => setField('tasteId', id)} />
            <SingleDict
              label="Ингредиент"
              options={refs.ingredient}
              value={form.ingredientId}
              onChange={(id) => setField('ingredientId', id)}
            />
            <SingleDict label="Твёрдость" options={refs.hardness} value={form.hardnessId} onChange={(id) => setField('hardnessId', id)} />

            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Основное изображение
            </Typography>
            <ImageField value={form.img} onFileSelect={setImgFile} onClear={() => setField('img', null)} />
          </Stack>
        </Grid2>

        <Grid2 size={12}>
          <Stack spacing={2}>
            <MultiDict
              label="Назначение"
              options={refs.designedFor}
              value={form.designedForIds}
              onChange={(ids) => setField('designedForIds', ids)}
            />
            <MultiDict label="Возраст" options={refs.ages} value={form.ageIds} onChange={(ids) => setField('ageIds', ids)} />
            <MultiDict
              label="Тип лакомств"
              options={refs.typeTreat}
              value={form.typeTreatIds}
              onChange={(ids) => setField('typeTreatIds', ids)}
            />
            <MultiDict
              label="Размер питомца"
              options={refs.petSizes}
              value={form.petSizeIds}
              onChange={(ids) => setField('petSizeIds', ids)}
            />
            <MultiDict label="Упаковки" options={refs.packages} value={form.packageIds} onChange={(ids) => setField('packageIds', ids)} />
            <MultiDict
              label="Особые нужды"
              options={refs.specialNeeds}
              value={form.specialNeedsIds}
              onChange={(ids) => setField('specialNeedsIds', ids)}
            />
          </Stack>
        </Grid2>

        <Grid2 size={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Дополнительные изображения (до 10 шт.)
          </Typography>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 1</Typography>
              <ImageField value={form.img1} onFileSelect={setImg1File} onClear={() => setField('img1', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 2</Typography>
              <ImageField value={form.img2} onFileSelect={setImg2File} onClear={() => setField('img2', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 3</Typography>
              <ImageField value={form.img3} onFileSelect={setImg3File} onClear={() => setField('img3', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 4</Typography>
              <ImageField value={form.img4} onFileSelect={setImg4File} onClear={() => setField('img4', null)} />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 5</Typography>
              <ImageField value={form.img5} onFileSelect={setImg5File} onClear={() => setField('img5', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 6</Typography>
              <ImageField value={form.img6} onFileSelect={setImg6File} onClear={() => setField('img6', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 7</Typography>
              <ImageField value={form.img7} onFileSelect={setImg7File} onClear={() => setField('img7', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 8</Typography>
              <ImageField value={form.img8} onFileSelect={setImg8File} onClear={() => setField('img8', null)} />
            </Grid2>

            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 9</Typography>
              <ImageField value={form.img9} onFileSelect={setImg9File} onClear={() => setField('img9', null)} />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Typography variant="caption">Изображение 10</Typography>
              <ImageField value={form.img10} onFileSelect={setImg10File} onClear={() => setField('img10', null)} />
            </Grid2>
          </Grid2>
        </Grid2>

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

export default AddFood;
