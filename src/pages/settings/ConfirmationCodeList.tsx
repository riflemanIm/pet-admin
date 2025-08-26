import React from 'react';
import DateFnsAdapter from '@date-io/date-fns';

import Widget from '../../components/Widget';

import { actions, useConfirmationCodeDispatch, useConfirmationCodeState } from '../../context/ConfirmationCodeContext';
import { ConfirmationCodeDto } from '../../helpers/dto';
import { GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BaseListGrid } from '../../components/BaseListGrid';

const ConfirmationCodeList = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dateFns = new DateFnsAdapter();

  const dispatch = useConfirmationCodeDispatch();
  const value = useConfirmationCodeState();

  const columns: GridColDef[] = [
    {
      field: 'confirmationCodesId',
      align: 'right',
      headerName: t('CONFIRMATIONCODE.FIELDS.confirmationCodesId') ?? '',
      width: 80,
      type: 'number'
    },
    {
      field: 'userId',
      align: 'right',
      headerName: t('CONFIRMATIONCODE.FIELDS.userId') ?? '',
      width: 120,
      type: 'number'
    },
    {
      field: 'code',
      align: 'left',
      headerName: t('CONFIRMATIONCODE.FIELDS.code') ?? '',
      width: 120
    },
    {
      field: 'customData',
      align: 'left',
      headerName: t('CONFIRMATIONCODE.FIELDS.customData') ?? '',
      width: 120
    },
    {
      field: 'creationDate',
      align: 'right',
      headerName: t('CONFIRMATIONCODE.FIELDS.creationDate') ?? '',
      width: 180,
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy HH:mm:ss') : '')
    },
    {
      field: 'lifeTime',
      align: 'right',
      headerName: t('CONFIRMATIONCODE.FIELDS.lifeTime') ?? '',
      width: 120,
      type: 'number'
    },
    {
      field: 'maxTryCnt',
      align: 'right',
      headerName: t('CONFIRMATIONCODE.FIELDS.maxTryCnt') ?? '',
      width: 120,
      type: 'number'
    },
    {
      field: 'tryCnt',
      align: 'right',
      headerName: t('CONFIRMATIONCODE.FIELDS.tryCnt') ?? '',
      width: 120,
      type: 'number'
    },
    {
      field: 'nextCodeDelay',
      align: 'right',
      headerName: t('CONFIRMATIONCODE.FIELDS.nextCodeDelay') ?? '',
      width: 120,
      type: 'number'
    }
  ];

  return (
    <Widget inheritHeight noBodyPadding>
      <BaseListGrid<ConfirmationCodeDto>
        columns={columns}
        idField="confirmationCodesId"
        storagePrefix="confirmationCode"
        state={value}
        dispatch={dispatch}
        doFetch={actions.doFetch(Number(id))}
        defaultSort={[
          {
            field: 'confirmationCodesId',
            sort: 'desc'
          }
        ]}
      />
    </Widget>
  );
};

export default ConfirmationCodeList;
