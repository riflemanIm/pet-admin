import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import {
  useTranslationDispatch,
  useTranslationState,
  actions,
  TranslationFilter,
} from "../../context/TranslationContext";
import config from "../../config";

export default function TranslationFilters(): JSX.Element {
  const { groups, filterVals } = useTranslationState();

  const pNames = config.pNames;

  const translationDispatch = useTranslationDispatch();

  const handleChangeFilter = (
    e: SelectChangeEvent<unknown>,
    curKey: keyof TranslationFilter
  ) => {
    const newFilterVals = { ...filterVals };

    newFilterVals[curKey] = e.target.value as string;
    actions.setFilter(newFilterVals)(translationDispatch);
  };

  return (
    <React.Fragment>
      <FormControl
        variant="outlined"
        margin="dense"
        fullWidth
        style={{ minWidth: 150 }}
      >
        <InputLabel id="id-pname-label">Name of project</InputLabel>
        <Select
          labelId="id-pname-label"
          id="id-pname-select"
          label="Name of project"
          onChange={(e) => handleChangeFilter(e, "pname")}
          value={filterVals.pname || ""}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {pNames.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        margin="dense"
        fullWidth
        style={{ minWidth: 150 }}
      >
        <InputLabel id="id-gkey-select-label">Status</InputLabel>
        <Select
          labelId="id-gkey-select-label"
          id="id-gkey-select"
          label="Status"
          onChange={(e) => handleChangeFilter(e, "checked")}
          value={filterVals.checked || ""}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          <MenuItem value="checked_all">Verified</MenuItem>
          <MenuItem value="not_checked_all">Not verified</MenuItem>
          <MenuItem value="ru">Not Verified RU</MenuItem>
          <MenuItem value="en">Not Verified EN</MenuItem>
          <MenuItem value="fr">Not Verified FR</MenuItem>
        </Select>
      </FormControl>
      <FormControl
        variant="outlined"
        margin="dense"
        fullWidth
        style={{ minWidth: 150 }}
      >
        <InputLabel id="id-gkey-select-label">Group</InputLabel>
        <Select
          labelId="id-gkey-select-label"
          id="id-gkey-select"
          label="Group"
          onChange={(e) => handleChangeFilter(e, "gkey")}
          value={filterVals.gkey || ""}
        >
          <MenuItem value="">
            <em>All</em>
          </MenuItem>
          {groups.map((item) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
}
