import React from "react";
import {
  IconButton,
  ListItem,
  ListItemButton,
  SxProps,
  Theme,
} from "@mui/material";
import { ServiceTaskItem } from "../../helpers/dto";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";

interface TaskStateButtonProps {
  task: ServiceTaskItem;
  selected: boolean;
  sx: SxProps<Theme>;
  onClick: () => void;
  onRunClick: () => void;
}

const TaskStateButton = ({
  task,
  selected,
  sx,
  onClick,
  onRunClick,
}: TaskStateButtonProps): JSX.Element => {
  return (
    <ListItem component="div" disablePadding sx={sx}>
      <ListItemButton onClick={onClick} selected={selected}>
        {task.title || task.name}
      </ListItemButton>
      <IconButton
        onClick={onRunClick}
        disabled={task.state.status === "running"}
      >
        <PlayArrowIcon />
      </IconButton>
    </ListItem>
  );
};

export default TaskStateButton;
