import { GridLocaleText } from "@mui/x-data-grid";
import { enUS, frFR, ruRU } from "@mui/x-data-grid/locales"

export const getGridLocaleText = (
  language: string
): Partial<GridLocaleText> | undefined => {
  switch (language) {
    case "ru":
      return ruRU.components.MuiDataGrid.defaultProps.localeText;
    case "en":
      return enUS.components.MuiDataGrid.defaultProps.localeText;
    case "fr":
      return frFR.components.MuiDataGrid.defaultProps.localeText;
  }
};