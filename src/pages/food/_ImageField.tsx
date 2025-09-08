// pages/food/_ImageField.tsx
import * as React from 'react';
import { Box, Button, Stack } from '@mui/material';

export default function ImageField({
  value, // string | null (имя файла)
  onFileSelect, // (file: File) => void
  onClear // () => void
}: {
  value: string | null | undefined;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <Stack spacing={1}>
      <Box>
        <Button variant="outlined" onClick={() => inputRef.current?.click()}>
          {value ? 'Заменить изображение' : 'Загрузить изображение'}
        </Button>
        {value ? (
          <Button sx={{ ml: 1 }} color="error" onClick={onClear}>
            Удалить
          </Button>
        ) : null}
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.currentTarget.value = '';
        }}
      />

      {value ? (
        <Box sx={{ width: 200, height: 200, borderRadius: 2, overflow: 'hidden', border: '1px solid #eee' }}>
          <img src={`/uploads/${value}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
      ) : null}
    </Stack>
  );
}
