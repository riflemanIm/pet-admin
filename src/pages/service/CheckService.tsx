import React, { useEffect } from "react";
import { useParams } from "react-router";

import {
  Button,
  Grid2,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  useServiceDispatch,
  useServiceState,
  actions,
} from "../../context/ServiceContext";
import { useTranslation } from "react-i18next";

import { dbDataTemplates } from "./dbDataTemplates";

const CheckService = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useServiceDispatch();
  const [dbDataRequest, setDBDataRequest] = React.useState<string>("");
  const [brokerType, setBrokerType] = React.useState<string>("");
  const [brokerRequest, setBrokerRequest] = React.useState<string>("");
  const { checkResult, dbDataResponse, brokerResponse, errorMessage } =
    useServiceState();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleTemplateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleTemplateClose = () => {
    setAnchorEl(null);
  };

  const handleTemplate = (value: string) => {
    setDBDataRequest(value);
    setAnchorEl(null);
  };

  useEffect(() => {
    if (id) {
      actions.doCheck(Number(id))(dispatch);
    }
  }, [id]);

  return (
    <Grid2 container justifyContent="center" spacing={2}>
      <Grid2 size={12}>
        <TextField
          variant="outlined"
          value={checkResult || errorMessage || ""}
          name="checkResult"
          label={t("SERVICE.CHECK")}
          multiline
          minRows={6}
          type="text"
          fullWidth
          disabled
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          variant="outlined"
          value={dbDataRequest || ""}
          onChange={(event) => setDBDataRequest(event.target.value)}
          name="dbDataRequest"
          label={t("SERVICE.DBDATA.REQUEST")}
          multiline
          minRows={14}
          maxRows={14}
          type="text"
          fullWidth
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          variant="outlined"
          value={dbDataResponse || ""}
          name="dbDataResponse"
          label={t("SERVICE.DBDATA.RESPONSE")}
          multiline
          minRows={14}
          maxRows={14}
          type="text"
          fullWidth
          disabled
        />
      </Grid2>
      <Grid2 size={6}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleTemplateClick}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {t("SERVICE.DBDATA.TEMPLATE")}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleTemplateClose}>
          {Object.keys(dbDataTemplates).map((key) => (
            <MenuItem
              value={key}
              key={key}
              onClick={() =>
                handleTemplate(
                  dbDataTemplates[key as keyof typeof dbDataTemplates]
                )
              }
            >
              {key}
            </MenuItem>
          ))}
        </Menu>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            actions.doDBDataCall(Number(id), dbDataRequest)(dispatch);
          }}
          sx={{ marginLeft: 1 }}
        >
          {t("SERVICE.DBDATA.EXECUTE")}
        </Button>
      </Grid2>
      <Grid2 size={6}></Grid2>
      <Grid2 size={6}>
        <TextField
          variant="outlined"
          value={brokerRequest || ""}
          onChange={(event) => setBrokerRequest(event.target.value)}
          name="brokerRequest"
          label={t("SERVICE.BROKER.REQUEST")}
          multiline
          minRows={14}
          maxRows={14}
          type="text"
          fullWidth
        />
      </Grid2>
      <Grid2 size={6}>
        <TextField
          variant="outlined"
          value={brokerResponse || ""}
          name="brokerResponse"
          label={t("SERVICE.BROKER.RESPONSE")}
          multiline
          minRows={14}
          maxRows={14}
          type="text"
          fullWidth
          disabled
        />
      </Grid2>
      <Grid2 size={6} whiteSpace={"nowrap"} sx={{ display: "flex" }}>
        <TextField
          variant="outlined"
          value={brokerType || ""}
          onChange={(event) => setBrokerType(event.target.value)}
          name="brokerType"
          label={t("SERVICE.BROKER.TYPE")}
          type="text"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            actions.doBrokerCall(
              Number(id),
              brokerType,
              brokerRequest
            )(dispatch);
          }}
          sx={{ m: 1 }}
        >
          {t("SERVICE.BROKER.EXECUTE")}
        </Button>
      </Grid2>
      <Grid2 size={6}></Grid2>
    </Grid2>
  );
};
export default CheckService;
