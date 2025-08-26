import React from "react";
import axios from "axios";

export type SettingsActionType =
  | "ITEM_UPDATE_STARTED"
  | "ITEM_UPDATE_SUCCESS"
  | "ITEM_UPDATE_ERROR"
  | "LIST_FETCH_STARTED"
  | "LIST_FETCH_SUCCESS"
  | "LIST_FETCH_ERROR";

interface SettingsAction {
  type: SettingsActionType;
  payload?: any;
}

export interface SettingsState<T> {
  controller: string;
  rows: T[];
  loading: boolean;
  errorMessage: string | null;
}

export const getInitialData = <T,>(controller: string): SettingsState<T> => ({
  controller,
  rows: [],
  loading: false,
  errorMessage: null,
});

export const settingsReducer = <T,>(
  state: SettingsState<T>,
  { type, payload }: SettingsAction
): SettingsState<T> => {
  if (type === "ITEM_UPDATE_STARTED") {
    return {
      ...state,
      loading: true,
    };
  }

  if (type === "ITEM_UPDATE_SUCCESS") {
    return {
      ...state,
      loading: false,
    };
  }

  if (type === "ITEM_UPDATE_ERROR") {
    return {
      ...state,
      loading: false,
      errorMessage: payload,
    };
  }

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
      ...payload,
    };
  }

  if (type === "LIST_FETCH_ERROR") {
    return {
      ...state,
      loading: false,
      rows: [],
    };
  }

  return state;
};

export type SettingsDispatch = React.Dispatch<SettingsAction>;

const SettingsContext = React.createContext({
  state: getInitialData(''),
  dispatch: (() => void 0) as SettingsDispatch,
});

const SettingsProvider = <T,>({
  controller,
  children,
}: {
  controller: string,
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(settingsReducer, getInitialData(controller));

  return (
    <SettingsContext.Provider
      value={{ state: state as SettingsState<T>, dispatch }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

const actions = {
  doFetch:
    (url: string, params?: any) =>
    async (dispatch: SettingsDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_FETCH_STARTED",
        });

        const response = await axios.get(url, {
          params,
        });

        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response.data,
        });
      } catch (error) {
        console.log(error);

        dispatch({
          type: "LIST_FETCH_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  doUpdate:
    <T,>(url: string, id: number, values: T) =>
    async (dispatch: SettingsDispatch): Promise<boolean> => {
      dispatch({
        type: "ITEM_UPDATE_STARTED",
      });
      try {
        await axios.put(`${url}/${id}`, values);
        dispatch({
          type: "ITEM_UPDATE_SUCCESS",
          payload: values,
        });
        return true;
      } catch (err) {
        dispatch({
          type: "ITEM_UPDATE_ERROR",
          payload: (err as any).response.data?.message,
        });
        return false;
      }
    },
};

export { SettingsProvider, SettingsContext, actions };
