/* eslint-disable import/no-named-as-default-member */
import { GridValidRowModel } from "@mui/x-data-grid";
import { ListDto, OrderDirection } from "./dto";
import axios from "axios";

export interface GenericListState<T> {
  rows: T[];
  totalCount: number;
  loading: boolean;
  errorMessage: string | null;
  fetchIndex: number;
}

export const initialListState = <T>(): GenericListState<T> => ({
  rows: [],
  totalCount: 0,
  loading: false,
  errorMessage: null,
  fetchIndex: 0,
});

export interface GenericState<T> extends GenericListState<T> {
  findLoading: boolean;
  saveLoading: boolean;
  current: T | null;
  idToDelete: number | null;
  modalOpen: boolean;
}

export const initialState = <T>(): GenericState<T> => ({
  ...initialListState(),
  findLoading: false,
  saveLoading: false,
  current: null,
  idToDelete: null,
  modalOpen: false,
});

export type GenericListActionType =
  | "LIST_FETCH_STARTED"
  | "LIST_FETCH_SUCCESS"
  | "LIST_FETCH_ERROR"
  | "LIST_REFRESH";

export type GenericActionType =
  | GenericListActionType
  | "LIST_DELETE_STARTED"
  | "LIST_DELETE_SUCCESS"
  | "LIST_DELETE_ERROR"
  | "LIST_OPEN_CONFIRM"
  | "LIST_CLOSE_CONFIRM"
  | "FORM_RESET"
  | "FORM_FIND_STARTED"
  | "FORM_FIND_SUCCESS"
  | "FORM_FIND_ERROR"
  | "FORM_CREATE_STARTED"
  | "FORM_CREATE_SUCCESS"
  | "FORM_CREATE_ERROR"
  | "FORM_UPDATE_STARTED"
  | "FORM_UPDATE_SUCCESS"
  | "FORM_UPDATE_ERROR"
  | "REFERENCE_FETCH_STARTED"
  | "REFERENCE_FETCH_SUCCESS"
  | "REFERENCE_FETCH_ERROR"
  ;

export interface GenericAction<ActionType = any> {
  type: ActionType;
  payload?: any;
}

export const genericListReducer = <T, S extends GenericListState<T>, A = string>(state: S, { type, payload }: { type: A, payload: any }): S => {
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
      totalCount: 0,
      errorMessage: payload,
    };
  }

  if (type === "LIST_REFRESH") {
    return {
      ...state,
      fetchIndex: state.fetchIndex + 1,
    };
  }

  return state;
};

export const genericReducer = <T, S extends GenericState<T>, A = string>(state: S, { type, payload }: { type: A, payload: any }): S => {
  if (type === "FORM_RESET") {
    return {
      ...state,
      ...initialState<T>(),
    };
  }

  if (type === "REFERENCE_FETCH_STARTED") {
    return {
      ...state,
      findLoading: true,
    };
  }

  if (type === "REFERENCE_FETCH_SUCCESS") {
    return {
      ...state,
      ...payload,
      findLoading: false,
    };
  }

  if (type === "REFERENCE_FETCH_ERROR") {
    return {
      ...state,
      findLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "FORM_FIND_STARTED") {
    return {
      ...state,
      current: null,
      findLoading: true,
    };
  }

  if (type === "FORM_FIND_SUCCESS") {
    return {
      ...state,
      ...payload,
      findLoading: false,
    };
  }

  if (type === "FORM_FIND_ERROR") {
    return {
      ...state,
      current: null,
      findLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "FORM_CREATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      current: null,
    };
  }

  if (type === "FORM_CREATE_SUCCESS") {
    return {
      ...state,
      saveLoading: false,
      current: payload,
    };
  }

  if (type === "FORM_CREATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
      current: null,
    };
  }

  if (type === "FORM_UPDATE_STARTED") {
    return {
      ...state,
      saveLoading: true,
      errorMessage: null,
    };
  }

  if (type === "FORM_UPDATE_SUCCESS") {
    return {
      ...state,
      current: payload,
      saveLoading: false,
    };
  }

  if (type === "FORM_UPDATE_ERROR") {
    return {
      ...state,
      saveLoading: false,
      errorMessage: payload,
    };
  }

  if (type === "LIST_DELETE_STARTED") {
    return {
      ...state,
      loading: true,
      errorMessage: null,
    };
  }

  if (type === "LIST_DELETE_SUCCESS") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      fetchIndex: state.fetchIndex + 1,
    };
  }

  if (type === "LIST_DELETE_ERROR") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
      errorMessage: payload,
    };
  }

  if (type === "LIST_OPEN_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: true,
      idToDelete: payload.id,
    };
  }

  if (type === "LIST_CLOSE_CONFIRM") {
    return {
      ...state,
      loading: false,
      modalOpen: false,
    };
  }

  return genericListReducer(state, { type, payload });

}

export const doGenericFetch = <Dto extends GridValidRowModel, DispatchType extends React.Dispatch<GenericAction<GenericListActionType>>>(url: string,
  extraParams?: Record<string, any>) => (
    startIndex = 0,
    count = 50,
    filter: string | null = null,
    orderBy: string | null = null,
    order: OrderDirection = "asc"
  ) =>
    async (dispatch: DispatchType): Promise<void> => {
      try {
        dispatch({
          type: "LIST_FETCH_STARTED",
        });

        const response = await axios.get(url, {
          params: {
            startIndex,
            count,
            filter,
            orderBy,
            order,
            ...extraParams
          },
        });

        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response.data as ListDto<Dto>,
        });
      } catch (error) {
        dispatch({
          type: "LIST_FETCH_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    };

export const doGenericReferenceLists = <DispatchType extends React.Dispatch<GenericAction<GenericActionType>>>(urls: Record<string, string>) => () =>
  async (dispatch: DispatchType): Promise<void> => {
    try {
      dispatch({
        type: "REFERENCE_FETCH_STARTED",
      });
      const req = Object.values(urls).map(url => axios.get(url));
      await axios.all(req).then((res) => {
        const payload: Record<string, GridValidRowModel> = {};
        const keys = Object.keys(urls);
        for (let i = 0; i < keys.length; i++) {
          payload[keys[i]] = (res[i].data as ListDto<GridValidRowModel>).rows;
        }
        dispatch({
          type: "REFERENCE_FETCH_SUCCESS",
          payload,
        });
      });
    } catch (error) {
      dispatch({
        type: "REFERENCE_FETCH_ERROR",
        payload: (error as any).response.data?.message,
      });
    }
  };

export const doGenericFind = <DispatchType extends React.Dispatch<GenericAction<GenericActionType>>>(url: string) => (id: number) =>
  async (dispatch: DispatchType): Promise<void> => {
    try {
      dispatch({
        type: "FORM_FIND_STARTED",
      });

      const res = await axios.get(`${url}/${id}`);
      dispatch({
        type: "FORM_FIND_SUCCESS",
        payload: { current: res.data },
      });
    } catch (error) {
      dispatch({
        type: "FORM_FIND_ERROR",
        payload: (error as any).response.data?.message,
      });
    }
  };


export const doGenericDelete = <DispatchType extends React.Dispatch<GenericAction<GenericActionType>>>(url: string) => (id: number) =>
  async (dispatch: DispatchType): Promise<void> => {
    try {
      dispatch({
        type: "LIST_DELETE_STARTED",
      });

      await axios.delete(`${url}/${id}`);

      dispatch({
        type: "LIST_DELETE_SUCCESS",
      });
    } catch (error) {
      dispatch({
        type: "LIST_DELETE_ERROR",
        payload: (error as any).response.data?.message,
      });
    }
  };

export const doGenericCreate = <Dto extends GridValidRowModel, DispatchType extends React.Dispatch<GenericAction<GenericActionType>>>(url: string, idField: keyof Dto) =>
  (values: Dto, onSuccess: () => void, onError: (message: string) => void) => async (dispatch: DispatchType): Promise<void> => {
    try {
      dispatch({
        type: "FORM_CREATE_STARTED",
      });
      await axios
        .post(url, values)
        .then((res) => {
          dispatch({
            type: "FORM_CREATE_SUCCESS",
            payload: { [idField]: res.data },
          });
          onSuccess();
        })
        .catch((error) => {
          onError(error.response.data?.message);
          dispatch({
            type: "FORM_CREATE_ERROR",
            payload: error.response.data?.message,
          });
        });
    } catch (error) {
      onError("Error during add");
      dispatch({
        type: "FORM_CREATE_ERROR",
      });
    }
  };

export const doGenericUpdate = <Dto extends GridValidRowModel, DispatchType extends React.Dispatch<GenericAction<GenericActionType>>>(url: string) =>
  (id: number, values: Dto, onSuccess: () => void, onError: (message: string) => void) => async (dispatch: DispatchType): Promise<void> => {
    try {
      dispatch({
        type: "FORM_UPDATE_STARTED",
      });
      await axios
        .put(`${url}/${id}`, values)
        .then(() => {
          dispatch({
            type: "FORM_UPDATE_SUCCESS",
            payload: values,
          });
          onSuccess();
        })
        .catch((error) => {
          onError(error?.response?.data?.err);
          dispatch({
            type: "FORM_UPDATE_ERROR",
            payload: error.response.data?.message,
          });
        });
    } catch (error) {
      onError("Error during update");
      dispatch({
        type: "FORM_UPDATE_ERROR",
      });
    }
  };

export const genericConfirmActions = <DispatchType extends React.Dispatch<GenericAction<GenericActionType>>>() => ({
  doOpenConfirm: (id: number) => (dispatch: DispatchType): void => {
    dispatch({
      type: "LIST_OPEN_CONFIRM",
      payload: {
        id: id,
      },
    });
  },
  doCloseConfirm: () => (dispatch: DispatchType): void => {
    dispatch({
      type: "LIST_CLOSE_CONFIRM",
    });
  },
})

export const genericActions = <Dto extends GridValidRowModel, DispatchType extends React.Dispatch<GenericAction<GenericActionType>>>(url: string, idField: keyof Dto) => ({
  doFetch: doGenericFetch<Dto, DispatchType>(url),
  doFind: doGenericFind<DispatchType>(url),
  doDelete: doGenericDelete<DispatchType>(url),
  doCreate: doGenericCreate<Dto, DispatchType>(url, idField),
  doUpdate: doGenericUpdate<Dto, DispatchType>(url),
  ...genericConfirmActions<DispatchType>(),
})