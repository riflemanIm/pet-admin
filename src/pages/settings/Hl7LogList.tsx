import React from 'react';
import DateFnsAdapter from '@date-io/date-fns';

import Widget from '../../components/Widget';

import { actions, useHl7LogDispatch, useHl7LogState } from '../../context/HL7LogContext';
import { Hl7LogDto } from '../../helpers/dto';
import { GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BaseListGrid } from '../../components/BaseListGrid';

const Hl7LogList = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dateFns = new DateFnsAdapter();

  const dispatch = useHl7LogDispatch();
  const value = useHl7LogState();

  const columns: GridColDef[] = [
    {
      field: 'hl7LogId',
      align: 'right',
      headerName: t('HL7LOG.FIELDS.hl7LogId') ?? '',
      width: 80,
      type: 'number'
    },
    {
      field: 'message',
      align: 'left',
      headerName: t('HL7LOG.FIELDS.message') ?? '',
      minWidth: 200,
      flex: 1
    },
    {
      field: 'addressHL7',
      align: 'left',
      headerName: t('HL7LOG.FIELDS.addressHL7') ?? '',
      width: 200
    },
    {
      field: 'addressTelemed',
      align: 'left',
      headerName: t('HL7LOG.FIELDS.addressTelemed') ?? '',
      width: 200
    },
    {
      field: 'cdate',
      align: 'right',
      headerName: t('HL7LOG.FIELDS.cdate') ?? '',
      width: 180,
      type: 'date',
      valueFormatter: (value: string) => (value ? dateFns.formatByString(new Date(value), 'dd.MM.yyyy HH:mm:ss') : '')
    }
  ];

  return (
    <Widget inheritHeight noBodyPadding>
      <BaseListGrid<Hl7LogDto>
        columns={columns}
        idField="hl7LogId"
        exportName="hl7log"
        storagePrefix="hl7log"
        state={value}
        dispatch={dispatch}
        doFetch={actions.doFetch(Number(id))}
        defaultSort={[
          {
            field: 'hl7logId',
            sort: 'asc'
          }
        ]}
      />
    </Widget>
  );
};

export default Hl7LogList;
