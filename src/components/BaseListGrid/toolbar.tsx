import React from "react";

import { Box } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

interface BaseListToolbarProps {
  startActions?: React.ReactElement;
  endActions?: React.ReactElement;
}

export const createBaseListToolbar =
  (props: BaseListToolbarProps = {}) =>
  // eslint-disable-next-line react/display-name
  () => {
    return (
      <GridToolbarContainer>
        {props.startActions}
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Box sx={{ flexGrow: 1 }} />
        {props.endActions}
      </GridToolbarContainer>
    );
  };
