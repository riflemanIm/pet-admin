// pages/food/_formParts.tsx (необязательно; можно встроить прямо в Add/Edit)
import React from 'react';
import { Autocomplete, Chip, TextField } from '@mui/material';

export function MultiDict({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options?: { id: number; name: string }[];
  value: number[];
  onChange: (ids: number[]) => void;
}) {
  const val = (options ?? []).filter((o) => value.includes(o.id));
  return (
    <Autocomplete
      multiple
      options={options ?? []}
      getOptionLabel={(o) => o.name}
      value={val}
      onChange={(_, newVal) => onChange(newVal.map((v) => v.id))}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => <Chip variant="outlined" label={option.name} {...getTagProps({ index })} key={option.id} />)
      }
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}

export function SingleDict({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options?: { id: number; name: string }[];
  value: number | null;
  onChange: (id: number | null) => void;
}) {
  const val = (options ?? []).find((o) => o.id === value) ?? null;
  return (
    <Autocomplete
      options={options ?? []}
      getOptionLabel={(o) => o.name}
      value={val}
      onChange={(_, newVal) => onChange(newVal ? newVal.id : null)}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
