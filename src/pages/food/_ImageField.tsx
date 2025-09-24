// pages/food/_ImageField.tsx
import * as React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { imgApiUrl } from 'context/FoodContext';

type Props = {
  label?: string;
  /** Имя файла или полный URL */
  value: string | null;
  /** Сообщаем родителю выбранный файл (или null при очистке) */
  onFileSelect: (file: File | null) => void;
  /** Очистить текущее значение на форме (родитель обнуляет поле img/img1...) */
  onClear: () => void;
  /** Базовый URL для относительных имён файлов (value без http/https). По умолчанию '/uploads' */
  baseUrl?: string;

  // зарезервировано, если где-то передаётся — не ломаем внешние вызовы
  formKey?: string; // 'img', 'img1', ...
  fileKey?: string; // 'imgFile', 'img1File', ...
};

export default function ImageField({ label, value, onFileSelect, onClear, baseUrl = imgApiUrl }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  // чищаем ObjectURL при размонтировании/смене файла
  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const openPicker = () => inputRef.current?.click();

  const handleClear = () => {
    // сбрасываем локальный превью и уведомляем родителя
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    onFileSelect(null);
    onClear();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // чистим предыдущий превью если был
      if (preview) URL.revokeObjectURL(preview);
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelect(file);
    }
    // позволяем выбрать тот же файл повторно
    e.currentTarget.value = '';
  };

  const isAbsolute = (src?: string | null) => !!src && /^(https?:)?\/\//i.test(src);
  const currentSrc = preview || (value ? (isAbsolute(value) ? value : `${baseUrl.replace(/\/$/, '')}/${value.replace(/^\//, '')}`) : null);

  return (
    <Stack spacing={1}>
      {label ? (
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      ) : null}

      <Box>
        <Button variant="outlined" onClick={openPicker}>
          {currentSrc ? 'Заменить изображение' : 'Загрузить изображение'}
        </Button>
        {currentSrc ? (
          <Button sx={{ ml: 1 }} color="error" onClick={handleClear}>
            Удалить
          </Button>
        ) : null}
      </Box>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />

      {currentSrc ? (
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #eee'
          }}
        >
          <img src={currentSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      ) : null}
    </Stack>
  );
}
