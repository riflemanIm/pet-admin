import React, { useEffect, useMemo } from 'react';
import { Box, Button, Stack, TextField, FormControlLabel, Switch, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Widget from '../../components/Widget/Widget';
import { FoodProvider, useFoodActions, useFoodDispatch, useFoodState } from '../../context/FoodContext';
import useForm from '../../hooks/useForm';

const EditFoodComp = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useFoodDispatch();
  const actions = useFoodActions();
  const { current, saveLoading } = useFoodState();

  useEffect(() => {
    if (id) actions.doFind(Number(id))(dispatch);
  }, [id, actions, dispatch]);

  const onSuccess = () => navigate('/food/list');
  const onError = (msg: string) => console.error('Update food error:', msg);

  const save = () => {
    if (!id) return;
    const payload: any = {
      ...values,
      price: Number(values.price) || 0,
      priceDiscount: Number(values.priceDiscount) || 0,
      weight: values.weight ? Number(values.weight) : null,
      quantity: values.quantity ? Number(values.quantity) : null,
      quantityPackages: values.quantityPackages ? Number(values.quantityPackages) : null,
      expiration: values.expiration ? Number(values.expiration) : null,
      stock: values.stock ? Number(values.stock) : 0,
      title: values.title?.trim() || null,
      artikul: values.artikul?.trim() || null,
      annotation: values.annotation?.trim() || null,
      packageSize: values.packageSize?.trim() || null,
      feature: values.feature?.trim() || null
    };
    actions.doUpdate(Number(id), payload, onSuccess, onError)(dispatch);
  };

  const { values, errors, handleChange, setValues } = useForm<any, any>(save, () => ({}));

  useEffect(() => {
    if (current) {
      setValues({
        ...current
      });
    }
  }, [current, setValues]);

  const saveDisabled = useMemo(() => saveLoading, [saveLoading]);

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
            {saveLoading ? 'Saving…' : 'Save'}
          </Button>
        </Stack>
      </Box>
    </Widget>
  );
};

export default function EditFood(): JSX.Element {
  return <EditFoodComp />;
}
