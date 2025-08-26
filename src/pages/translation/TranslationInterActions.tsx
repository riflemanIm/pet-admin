import React from 'react';

import { Button, Box, ButtonGroup } from '@mui/material';

import { GetApp as DownloadIcon, LabelImportant as LabelImportantIcon } from '@mui/icons-material';

import config from '../../config';

const TranslationInterActions = ({ pname }: { pname: string }): JSX.Element => {
  return (
    <Box sx={{ pt: 1 }}>
      <ButtonGroup variant="contained">
        <Button href={`${config.baseURLApi}/translations/csv/${pname}`} startIcon={<DownloadIcon />} sx={{ whiteSpace: 'nowrap' }}>
          Export CSV
        </Button>
        <Button href="#translation/import-csv" startIcon={<LabelImportantIcon />} sx={{ whiteSpace: 'nowrap' }}>
          Import CSV
        </Button>
      </ButtonGroup>
    </Box>
  );
};
export default TranslationInterActions;
