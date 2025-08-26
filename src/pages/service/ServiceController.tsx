import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { ServiceCommandDto, ServiceInfoDto } from "../../helpers/dto";
import { useTranslation } from "react-i18next";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";

interface ICommandTemplate {
  key: string;
  command: string;
  args?: string;
}

const commandTemplates: ICommandTemplate[] = [
  {
    key: "Reload config",
    command: "reloadConfig",
  },
  {
    key: "Info log level",
    command: "setLogLevel",
    args: "info",
  },
];

interface ServiceControllerParams {
  isOpen: boolean;
  address: string;
  requestInfo: (address: string) => Promise<ServiceInfoDto>;
  executeCommand: (
    address: string,
    command: string,
    args?: string
  ) => Promise<ServiceCommandDto>;
  onClose: () => void;
}

const ServiceController = (params: ServiceControllerParams): JSX.Element => {
  const { t } = useTranslation();
  const [address, setAddress] = React.useState<string>("");
  const [info, setInfo] = React.useState<ServiceInfoDto | undefined>();
  const [command, setCommand] = React.useState<string>("");
  const [args, setArgs] = React.useState<string>("");
  const [commandOutput, setCommandOutput] = React.useState<string>("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleTemplateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleTemplateClose = () => {
    setAnchorEl(null);
  };

  const requestInfo = React.useCallback((address: string) => {
    params
      .requestInfo(address)
      .then((info: ServiceInfoDto) => {
        setInfo(info);
      })
      .catch((resp) => console.warn(resp));
  }, []);

  const executeCommand = React.useCallback(
    (command: string, args?: string) => {
      if (!address || !command) return;

      params
        .executeCommand(address, command, args)
        .then((info: ServiceCommandDto) => {
          setCommandOutput(info.result);
        })
        .catch((resp) => console.warn(resp));
    },
    [address]
  );

  const handleTemplate = React.useCallback((template: ICommandTemplate) => {
    setCommand(template.command);
    setArgs(template.args || "");
    setAnchorEl(null);
  }, []);

  React.useEffect(() => {
    if (!params.isOpen) return;
    setAddress(params.address);
  }, [params.isOpen, params.address]);

  return (
    <Dialog
      open={params.isOpen}
      onClose={() => params.onClose()}
      scroll={"body"}
      maxWidth="lg"
      fullWidth
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        <span style={{ paddingRight: 32 }}>
          {t("SERVICE.CONTROLLER.TITLE")}
        </span>
        <IconButton
          aria-label="close"
          onClick={() => params.onClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2} sx={{ marginTop: "8px" }}>
          <Grid2 size={10}>
            <TextField
              variant="outlined"
              value={address}
              label={t("SERVICE.CONTROLLER.Address")}
              type="text"
              fullWidth
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid2>
          <Grid2 size={2}>
            <Button
              variant="contained"
              disabled={!address}
              onClick={async () => requestInfo(address)}
              fullWidth
            >
              {t("SERVICE.CONTROLLER.Request")}
            </Button>
          </Grid2>
          <Grid2 size={12}>
            <TextField
              variant="outlined"
              value={info?.connection || ""}
              label={t("SERVICE.CONTROLLER.Connection")}
              type="text"
              multiline
              minRows={2}
              maxRows={2}
              fullWidth
              disabled
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              variant="outlined"
              value={info?.version || ""}
              label={t("SERVICE.CONTROLLER.Version")}
              type="text"
              fullWidth
              disabled
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              variant="outlined"
              value={info?.mode || ""}
              label={t("SERVICE.CONTROLLER.Mode")}
              type="text"
              fullWidth
              disabled
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              variant="outlined"
              value={info?.logLevel || ""}
              label={t("SERVICE.CONTROLLER.Logging")}
              type="text"
              fullWidth
              disabled
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              variant="outlined"
              value={info?.eventList?.join("\r\n") || ""}
              label={t("SERVICE.CONTROLLER.Events")}
              multiline
              minRows={4}
              maxRows={4}
              type="text"
              fullWidth
              disabled
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              variant="outlined"
              value={command}
              label={t("SERVICE.CONTROLLER.Command")}
              type="text"
              fullWidth
              onChange={(e) => setCommand(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="control service"
                      onClick={handleTemplateClick}
                    >
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Menu anchorEl={anchorEl} open={open} onClose={handleTemplateClose}>
              {commandTemplates.map((template) => (
                <MenuItem
                  value={template.command}
                  key={template.key}
                  onClick={() => handleTemplate(template)}
                >
                  {template.key}
                </MenuItem>
              ))}
            </Menu>
          </Grid2>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              value={args}
              label={t("SERVICE.CONTROLLER.Arguments")}
              type="text"
              fullWidth
              onChange={(e) => setArgs(e.target.value)}
            />
          </Grid2>
          <Grid2 size={2}>
            <Button
              variant="contained"
              disabled={!address || !command}
              onClick={async () => executeCommand(command, args)}
              fullWidth
            >
              {t("SERVICE.CONTROLLER.Execute")}
            </Button>
          </Grid2>
          <Grid2 size={12}>
            <TextField
              variant="outlined"
              value={commandOutput}
              label={t("SERVICE.CONTROLLER.CommandOutput")}
              type="text"
              fullWidth
              disabled
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => params.onClose()}>{t("COMMON.CLOSE")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceController;
