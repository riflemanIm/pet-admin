import React from "react";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export const QuickSearchToolbar = () => {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
    </Box>
  );
};
