import React from "react";
import DateFnsAdapter from "@date-io/date-fns";

import {
  GridRenderCellParams,
  renderEditBooleanCell,
  renderEditDateCell,
  renderEditInputCell,
  renderEditSingleSelectCell,
} from "@mui/x-data-grid";
import { SettingValidator } from "../../helpers/enums";
import { GenericSettingDto } from "../../helpers/dto";

const dateFns = new DateFnsAdapter();
const enumRe = /[^(]+ \(([\w,]+)\)/;

export const renderInputCell = (
  params: GridRenderCellParams<any, GenericSettingDto>
): JSX.Element => {
  if (params.row.validation === SettingValidator.bool)
    return renderEditBooleanCell(params);
  if (
    params.row.validation === SettingValidator.int ||
    params.row.validation === SettingValidator.float
  )
    return renderEditInputCell({
      ...params,
      colDef: { ...params.colDef, type: "number" },
    });
  if (params.row.validation === SettingValidator.date)
    return renderEditDateCell(params);
  const match = params.row.name.match(enumRe);
  if (match) {
    const enumText = match[1];
    const enumItems = enumText.split(",");
    if (enumItems.length > 1) {
      return renderEditSingleSelectCell({
        ...params,
        colDef: {
          ...params.colDef,
          type: "singleSelect",
          valueOptions: enumItems,
          getOptionLabel: (value: any) => value,
          getOptionValue: (value: any) => value,
        },
      });
    }
  }
  return renderEditInputCell({
    ...params,
    multiline: true,
  });
};

export const getValue = (row: GenericSettingDto): any => {
  if (typeof row.value !== "string") return row.value;
  switch (row.validation) {
    case "bool":
      return ["1", "true"].includes(row.value?.toLowerCase());
    case "integer":
    case "float":
      return Number(row.value);
    case "date":
      return dateFns.parse(row.value, "yyyyMMdd");
    default:
      return row.value;
  }
};

export const getStrValue = (row: GenericSettingDto): string => {
  if (typeof row.value === "string") return row.value;
  switch (row.validation) {
    case "bool":
      return row.value === true ? "true" : "false";
    case "integer":
    case "float":
      return String(row.value);
    case "date":
      return dateFns.formatByString(row.value, "yyyyMMdd");
    default:
      return row.value;
  }
};
