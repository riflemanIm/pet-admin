import React from "react";
import {
  Collapse,
  Grid2,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import {
  actions,
  useTasksDispatch,
  useTasksState,
} from "../../context/TasksContext";

import {
  ExpandLess,
  ExpandMore,
  Storage,
  DataObject,
} from "@mui/icons-material";

import { ServiceTaskItem } from "../../helpers/dto";
import TaskStateButton from "./TaskStateButton";
import useInterval from "../../hooks/useInterval";
import { useTranslation } from "react-i18next";
import { useUserState } from "../../context/UserContext";
import { isNetRole } from "../../helpers/enums";

const Tasks = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    currentUser: { role },
  } = useUserState();

  const [dbCleanerTasks, setDbCleanerTasks] = React.useState<ServiceTaskItem[]>(
    []
  );
  const [cacheCleanerTasks, setCacheCleanerTasks] = React.useState<
    ServiceTaskItem[]
  >([]);
  const [cacheWarmUpTasks, setCacheWarmUpTasks] = React.useState<
    ServiceTaskItem[]
  >([]);
  const [openDbCleaner, setOpenDbCleaner] = React.useState(false);
  const [openCacheCleaner, setOpenCacheCleaner] = React.useState(false);
  const [openCacheWarmUp, setOpenCacheWarmUp] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const tasksState = useTasksState();
  const tasksDispatch = useTasksDispatch();

  React.useEffect(() => {
    async function fetchAPI() {
      try {
        await actions.doFetch(false)(tasksDispatch);
      } catch (e) {
        console.log(e);
      }
    }
    fetchAPI();
  }, []);

  React.useEffect(() => {
    setDbCleanerTasks(tasksState.tasks.dbCleaner);
    setCacheCleanerTasks(tasksState.tasks.cacheCleaner);
    setCacheWarmUpTasks(tasksState.tasks.cacheWarmUp);
  }, [tasksState.tasks]);

  useInterval(
    () => {
      if (dbCleanerTasks) {
        for (const task of dbCleanerTasks) {
          if (task.state.status === "running") {
            actions.requestState("dbCleaner", task.name)(tasksDispatch);
          }
        }
      }
      if (cacheCleanerTasks) {
        for (const task of cacheCleanerTasks) {
          if (task.state.status === "running") {
            actions.requestState("cacheCleaner", task.name)(tasksDispatch);
          }
        }
      }
      if (cacheWarmUpTasks) {
        for (const task of cacheWarmUpTasks) {
          if (task.state.status === "running") {
            actions.requestState("cacheWarmUp", task.name)(tasksDispatch);
          }
        }
      }
      if (inputRef.current) {
        inputRef.current.scrollTop = inputRef.current.scrollHeight;
      }
    },
    true,
    1000
  );

  return (
    <Grid2 container spacing={2}>
      <Grid2
        size={4}
        sx={{
          height: 600,
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#6b6b6b #fff",

          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#fff",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#d5d9ef",
            border: "5px solid #fff",
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#fff",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#73d7f5",
              border: "3px solid #fff",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#73d7f5",
              border: "3px solid #fff",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#fff",
          },
        }}
      >
        <List>
          {!isNetRole(role) && (
            <React.Fragment>
              <ListItemButton onClick={() => setOpenDbCleaner(!openDbCleaner)}>
                <ListItemIcon>
                  <Storage />
                </ListItemIcon>
                <ListItemText primary={t("TASKS.CLEARDB")} />
                {openDbCleaner ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openDbCleaner} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {dbCleanerTasks.map((task) => (
                    <TaskStateButton
                      key={task.name}
                      task={task}
                      selected={task.name === tasksState.current?.name}
                      sx={{ pl: 4 }}
                      onClick={() => {
                        tasksDispatch({ type: "SET_CURRENT", payload: task });
                      }}
                      onRunClick={() => {
                        actions.run("dbCleaner", task.name)(tasksDispatch);
                      }}
                    />
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          )}

          <ListItemButton
            onClick={() => setOpenCacheCleaner(!openCacheCleaner)}
          >
            <ListItemIcon>
              <DataObject />
            </ListItemIcon>
            <ListItemText primary={t("TASKS.CLEARCACHE")} />
            {openCacheCleaner ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCacheCleaner} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {cacheCleanerTasks.map((task) => (
                <TaskStateButton
                  key={task.name}
                  task={task}
                  selected={task.name === tasksState.current?.name}
                  sx={{ pl: 4 }}
                  onClick={() => {
                    tasksDispatch({ type: "SET_CURRENT", payload: task });
                  }}
                  onRunClick={() => {
                    actions.run("cacheCleaner", task.name)(tasksDispatch);
                  }}
                />
              ))}
            </List>
          </Collapse>

          <ListItemButton onClick={() => setOpenCacheWarmUp(!openCacheWarmUp)}>
            <ListItemIcon>
              <DataObject />
            </ListItemIcon>
            <ListItemText primary={t("TASKS.WARMUPCACHE")} />
            {openCacheWarmUp ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCacheWarmUp} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {cacheWarmUpTasks.map((task) => (
                <TaskStateButton
                  key={task.name}
                  task={task}
                  selected={task.name === tasksState.current?.name}
                  sx={{ pl: 4 }}
                  onClick={() => {
                    tasksDispatch({ type: "SET_CURRENT", payload: task });
                  }}
                  onRunClick={() => {
                    tasksDispatch({ type: "SET_CURRENT", payload: task });
                    actions.run("cacheWarmUp", task.name)(tasksDispatch);
                  }}
                />
              ))}
            </List>
          </Collapse>
        </List>
      </Grid2>
      <Grid2 size={8}>
        <TextField
          variant="outlined"
          multiline
          contentEditable={false}
          style={{ padding: 8 }}
          value={tasksState.current?.state?.messages?.join("\r\n") || ""}
          minRows={14}
          maxRows={14}
          fullWidth
          inputRef={inputRef}
        />
      </Grid2>
    </Grid2>
  );
};

export default Tasks;
