// components/BaseListGrid/index.tsx
import * as React from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel, GridValidRowModel } from '@mui/x-data-grid';
import type { GenericState, GenericAction } from 'helpers/state';

type OrderDirection = 'asc' | 'desc';

type DoFetchFn<TRow, TDispatch> = (
  startIndex?: number,
  count?: number,
  filter?: string | null,
  orderBy?: string | null,
  order?: OrderDirection
) => (dispatch: TDispatch) => Promise<void>;

export interface BaseListGridProps<TRow, TDispatch> {
  columns: GridColDef<TRow>[];
  idField: keyof TRow;
  exportName: string;
  storagePrefix: string;

  state: GenericState<TRow>;
  dispatch: TDispatch;
  doFetch: DoFetchFn<TRow, TDispatch>;

  defaultSort?: GridSortModel;
  startActions?: React.ReactNode;

  /** ⬇️ добавили — по желанию */
  onDelete?: () => void;
  onCloseDelete?: () => void;
  confirmTitle?: string;
  confirmText?: string;

  /** опционально, если хочешь контролировать размер страницы извне */
  initialPageSize?: number;
}

export function BaseListGrid<TRow extends GridValidRowModel, TDispatch extends React.Dispatch<GenericAction<any>>>(
  props: BaseListGridProps<TRow, TDispatch>
) {
  const {
    columns,
    idField,
    exportName,
    storagePrefix,

    state,
    dispatch,
    doFetch,

    defaultSort = [{ field: 'id', sort: 'desc' }],
    startActions,

    onDelete,
    onCloseDelete,
    confirmTitle = 'Удалить запись?',
    confirmText = 'Действие необратимо.',
    initialPageSize = 10
  } = props;

  const [filter, setFilter] = React.useState('');
  const [pagination, setPagination] = React.useState<GridPaginationModel>({ page: 0, pageSize: initialPageSize });
  const [sortModel, setSortModel] = React.useState<GridSortModel>(defaultSort);

  React.useEffect(() => {
    const orderBy = sortModel[0]?.field?.toString() ?? 'id';
    const order = (sortModel[0]?.sort ?? 'desc') as OrderDirection;
    const startIndex = pagination.page * pagination.pageSize;
    const count = pagination.pageSize;
    doFetch(startIndex, count, filter || null, orderBy, order)(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, doFetch, filter, pagination.page, pagination.pageSize, sortModel]);

  return (
    <Stack spacing={2}>
      {/* верхняя панель — слева кнопки */}
      {startActions ? <Box>{startActions}</Box> : null}

      <Box sx={{ height: 700, width: '100%' }}>
        <DataGrid
          rows={state.rows as any[]}
          getRowId={(r) => (r as any)[idField]}
          columns={columns as any}
          rowCount={state.totalCount}
          loading={state.loading}
          paginationMode="server"
          sortingMode="server"
          pageSizeOptions={[10, 25, 50, 100]}
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
        />
      </Box>

      {state.errorMessage ? (
        <Typography color="error" variant="body2">
          {state.errorMessage}
        </Typography>
      ) : null}

      {/* ⬇️ Встроенный confirm-диалог.
          Откроется, если где-то ранее вызван actions.doOpenConfirm(id) и state.modalOpen === true */}
      <Dialog open={!!state.modalOpen} onClose={onCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>{confirmTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{confirmText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDelete}>Отмена</Button>
          <Button color="error" variant="contained" onClick={onDelete}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default BaseListGrid;
