import React from "react";
import axios from "axios";
import { ServiceTaskItem, ServiceTaskItemsDto } from "../helpers/dto";

type TasksState = {
  current: ServiceTaskItem | null;
  tasks: ServiceTaskItemsDto;
  loading: boolean;
  errorMessage: string | null;
};

const initialData: TasksState = {
  current: null,
  tasks: {
    dbCleaner: [],
    cacheCleaner: [],
    cacheWarmUp: [],
  },
  loading: false,
  errorMessage: null,
};

type TasksActionType =
  | "LIST_FETCH_STARTED"
  | "LIST_FETCH_SUCCESS"
  | "LIST_FETCH_ERROR"
  | "SET_CURRENT"
  | "SET_ERROR"
  | "SET_STATE";

interface Action {
  type: TasksActionType;
  payload?: any;
}

const tasksReducer = (
  state = initialData,
  { type, payload }: Action
): TasksState => {
  if (type === "LIST_FETCH_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "LIST_FETCH_SUCCESS") {
    return {
      ...state,
      loading: false,
      tasks: payload.tasks,
    };
  }

  if (type === "LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      tasks: {
        dbCleaner: [],
        cacheCleaner: [],
        cacheWarmUp: [],
      },
    };
  }

  if (type === "SET_CURRENT") {
    return {
      ...state,
      current: payload,
    };
  }

  if (type === "SET_ERROR") {
    return {
      ...state,
      errorMessage: payload,
    };
  }

  if (type === "SET_STATE") {
    const taskGroup = payload.taskGroup as
      | "dbCleaner"
      | "cacheCleaner"
      | "cacheWarmUp";
    const tasks = state.tasks[taskGroup].map((task) =>
      task.name === payload.taskName ? { ...task, state: payload.state } : task
    );
    return {
      ...state,
      tasks: {
        ...state.tasks,
        [taskGroup]: tasks,
      },
      current: tasks.find((it) => it.name === state.current?.name) || null,
    };
  }

  return state;
};

type TasksDispatch = React.Dispatch<Action>;
const emptyDispatch: TasksDispatch = () => null;

const TasksContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

function TasksProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = React.useReducer(tasksReducer, initialData);

  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}

const useTasksState = (): TasksState => {
  const context = React.useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasksState must be used within a TasksProvider");
  }
  return context.state;
};

const useTasksDispatch = (): TasksDispatch => {
  const context = React.useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasksDispatch must be used within a TasksProvider");
  }
  return context.dispatch;
};

// ###########################################################

const actions = {
  doFetch:
    (keepPagination = false) =>
    async (dispatch: TasksDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_FETCH_STARTED",
          payload: { keepPagination },
        });

        const response = await axios.get(`/serviceTasks`);

        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: {
            tasks: response.data as ServiceTaskItemsDto,
          },
        });
      } catch (error) {
        dispatch({
          type: "LIST_FETCH_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },
  requestState:
    (taskGroup: string, taskName: string) =>
    async (dispatch: TasksDispatch): Promise<void> => {
      try {
        const response = await axios.get(
          `/serviceTasks/${taskGroup}/${taskName}`
        );
        dispatch({
          type: "SET_STATE",
          payload: {
            taskGroup,
            taskName,
            state: response.data,
          },
        });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },
  run:
    (taskGroup: string, taskName: string) =>
    async (dispatch: TasksDispatch): Promise<void> => {
      try {
        const response = await axios.post(
          `/serviceTasks/${taskGroup}/${taskName}`
        );
        dispatch({
          type: "SET_STATE",
          payload: {
            taskGroup,
            taskName,
            state: response.data,
          },
        });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },
};

export { TasksProvider, useTasksState, useTasksDispatch, actions };
