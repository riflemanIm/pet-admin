import React from "react";
import {
  ClientComponentStatus,
  ClientComponentCheckStatus,
} from "../../helpers/dto";
import { Box, Chip, Tooltip } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

interface ComponentItemProps {
  status: ClientComponentStatus;
}

const useStyles = makeStyles(() => ({
  success: {
    color: "rgba(0, 0, 0, 0.87)",
    backgroundColor: "rgb(102, 187, 106)",
  },
  warning: {
    color: "rgba(0, 0, 0, 0.87)",
    backgroundColor: "rgb(255, 167, 38)",
  },
  error: {
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(244, 67, 54);",
  },
}));

const ComponentItem = ({ status }: ComponentItemProps): JSX.Element => {
  const classes = useStyles();

  const className = (status: ClientComponentCheckStatus) => {
    switch (status) {
      case ClientComponentCheckStatus.Success:
        return classes.success;
      case ClientComponentCheckStatus.Warning:
        return classes.warning;
      case ClientComponentCheckStatus.Error:
        return classes.error;
    }
  };

  return (
    <Tooltip
      title={status.message || `Версия: ${status.version} (${status.protocol})`}
    >
      <Chip
        label={status.title}
        className={className(status.checkStatus)}
        size="small"
      />
    </Tooltip>
  );
};

interface ComponentStatusProps {
  status: ClientComponentStatus[];
}

const ComponentStatus = ({ status }: ComponentStatusProps): JSX.Element => {
  const theme = createTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {status.map((data: ClientComponentStatus) => {
        return (
          <Box sx={{ width: "auto", m: 0.5 }} key={data.code}>
            <ComponentItem status={data} />
          </Box>
        );
      })}
    </Box>
  );
};

export default ComponentStatus;
