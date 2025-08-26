import React from "react";
import axios from "axios";
import {
  getInitialData,
  settingsReducer,
  SettingsDispatch,
  SettingsState,
} from "./SettingsContext";
import { CacheSettingDto, CacheValueDto } from "../helpers/dto";

const CacheSettingsContext = React.createContext({
  state: getInitialData("cacheSetting"),
  dispatch: (() => void 0) as SettingsDispatch,
});

const CacheSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(
    settingsReducer,
    getInitialData("cacheSetting")
  );

  return (
    <CacheSettingsContext.Provider
      value={{ state: state as SettingsState<CacheSettingDto>, dispatch }}
    >
      {children}
    </CacheSettingsContext.Provider>
  );
};

const actions = {
  doFetch:
    (params?: any) =>
    async (dispatch: SettingsDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_FETCH_STARTED",
        });

        const response = await axios.get("/cacheSetting", {
          params,
        });

        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response.data,
        });
      } catch (error) {
        dispatch({
          type: "LIST_FETCH_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  getKeys: async (code: string, search?: string) => {
    const response = await axios.get(`/cacheSetting/${code}/keys`, {
      params: {
        search,
      },
    });
    return response.data as string[];
  },

  getValue: async (code: string, key: string): Promise<CacheValueDto> => {
    const response = await axios.get(`/cacheSetting/${code}/value/${key}`);
    return response.data as CacheValueDto;
  },

  del: async (code: string) => {
    const response = await axios.delete(`/cacheSetting/${code}`);
    return response.data as number;
  },

  delKey: async (code: string, key: string) => {
    await axios.delete(`/cacheSetting/${code}/${key}`);
  },

  doUpdate:
    (id: number, values: CacheSettingDto) =>
    async (dispatch: SettingsDispatch): Promise<boolean> => {
      dispatch({
        type: "ITEM_UPDATE_STARTED",
      });
      try {
        await axios.put(`/cacheSetting/${id}`, values);
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

export { CacheSettingsProvider, CacheSettingsContext, actions };
