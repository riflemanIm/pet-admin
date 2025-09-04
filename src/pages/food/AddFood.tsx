import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, Switch, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget';
import { useFoodActions, useFoodDispatch } from '../../context/FoodContext';
import useForm from '../../hooks/useForm';

const AddFoodComp = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useFoodDispatch();
  const actions = useFoodActions();

  const onSuccess = () => navigate('/food/list');
  const onError = (msg: string) => console.error('Create food error:', msg);

  const save = () => {
    const payload: any = {
      ...values,
      price: Number(values.price) || 0,
      priceDiscount: Number(values.priceDiscount) || 0,
      weight: values.weight ? Number(values.weight) : null,
      quantity: values.quantity ? Number(values.quantity) : null,
      quantityPackages: values.quantityPackages ? Number(values.quantityPackages) : null,
      expiration: values.expiration ? Number(values.expiration) : null,
      stock: values.stock ? Number(values.stock) : 0,
      // name->null для пустых строк
      title: values.title?.trim() || null,
      artikul: values.artikul?.trim() || null,
      annotation: values.annotation?.trim() || null,
      packageSize: values.packageSize?.trim() || null,
      feature: values.feature?.trim() || null
    };
    actions.doCreate(payload, onSuccess, onError)(dispatch);
  };

  const { values, errors, handleChange } = useForm<any, any>(save, () => ({}));
  const saveDisabled = useMemo(() => false, []);

  return (
    <Widget>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} maxWidth={1000}>
        <TextField name="artikul" label="Артикул" value={values.artikul ?? ''} onChange={handleChange} />
        <TextField name="title" label="Название" value={values.title ?? ''} onChange={handleChange} />

        <TextField name="price" label="Цена" value={values.price ?? ''} onChange={handleChange} />
        <TextField name="priceDiscount" label="Скидка" value={values.priceDiscount ?? ''} onChange={handleChange} />

        <FormControlLabel
          control={
            <Switch checked={!!values.vat} onChange={(e) => handleChange({ target: { name: 'vat', value: e.target.checked } } as any)} />
          }
          label="VAT"
        />
        <FormControlLabel
          control={
            <Switch
              checked={!!values.isPromo}
              onChange={(e) => handleChange({ target: { name: 'isPromo', value: e.target.checked } } as any)}
            />
          }
          label="Промо"
        />

        <TextField name="img" label="Img" value={values.img ?? ''} onChange={handleChange} />
        <TextField name="imgUrl" label="Img URL" value={values.imgUrl ?? ''} onChange={handleChange} />
        <TextField name="ozonId" label="Ozon ID" value={values.ozonId ?? ''} onChange={handleChange} />

        <TextField name="feature" label="Характеристики" value={values.feature ?? ''} onChange={handleChange} />
        <TextField name="weight" label="Вес (г)" value={values.weight ?? ''} onChange={handleChange} />
        <TextField name="quantity" label="Кол-во" value={values.quantity ?? ''} onChange={handleChange} />
        <TextField name="quantityPackages" label="Кол-во упак." value={values.quantityPackages ?? ''} onChange={handleChange} />

        <FormControl fullWidth>
          <InputLabel id="type-label">Тип</InputLabel>
          <Select labelId="type-label" name="type" label="Тип" value={values.type ?? ''} onChange={handleChange}>
            <MenuItem value="Treat">Treat</MenuItem>
            <MenuItem value="Souvenirs">Souvenirs</MenuItem>
            <MenuItem value="DryFood">DryFood</MenuItem>
          </Select>
        </FormControl>

        <TextField name="expiration" label="Годность (дней)" value={values.expiration ?? ''} onChange={handleChange} />
        <TextField name="annotation" multiline minRows={3} label="Описание" value={values.annotation ?? ''} onChange={handleChange} />
        <TextField name="packageSize" label="Размер упаковки" value={values.packageSize ?? ''} onChange={handleChange} />

        <TextField name="stock" label="Сток" value={values.stock ?? ''} onChange={handleChange} />

        <Stack direction="row" gap={2} justifyContent="flex-end" gridColumn="1/-1">
          <Button variant="outlined" onClick={() => navigate('/food/list')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saveDisabled}>
            Save
          </Button>
        </Stack>
      </Box>
    </Widget>
  );
};
export default function AddFood(): JSX.Element {
  return <AddFoodComp />;
}
