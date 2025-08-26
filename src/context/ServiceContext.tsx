import React from "react";
import axios from "axios";
import {
  ClientServiceDto,
  ServiceCommandDto,
  ServiceInfoDto,
  ServiceMetric,
} from "../helpers/dto";
import {
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

interface ClientServiceState extends GenericState<ClientServiceDto> {
  checkResult: string;
  metrics: ServiceMetric[] | null;
  dbDataResponse: string;
  brokerResponse: string;
}

const initialData: ClientServiceState = {
  ...initialState(),
  checkResult: "",
  metrics: null,
  dbDataResponse: "",
  brokerResponse: "",
};

type ClientServiceActionType =
  | GenericActionType
  | "FORM_CHECK_STARTED"
  | "FORM_DBDATA_STARTED"
  | "FORM_BROKER_STARTED";

type Action = GenericAction<ClientServiceActionType>;

function serviceReducer(
  state = initialData,
  { type, payload }: Action
): ClientServiceState {
  if (type === "FORM_CHECK_STARTED") {
    return {
      ...state,
      checkResult: "",
    };
  }

  if (type === "FORM_DBDATA_STARTED") {
    return {
      ...state,
      dbDataResponse: "",
    };
  }

  if (type === "FORM_BROKER_STARTED") {
    return {
      ...state,
      brokerResponse: "",
    };
  }

  if (type === "FORM_FIND_ERROR") {
    return {
      ...state,
      current: null,
      checkResult: "",
      metrics: null,
      dbDataResponse: "",
      brokerResponse: "",
      findLoading: false,
      errorMessage: payload,
    };
  }

  return genericReducer(state, { type, payload });
}

type ClientServiceDispatch = React.Dispatch<Action>;
const emptyDispatch: ClientServiceDispatch = () => null;

const ClientServiceContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

function ServiceProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = React.useReducer(serviceReducer, initialData);

  return (
    <ClientServiceContext.Provider value={{ state, dispatch }}>
      {children}
    </ClientServiceContext.Provider>
  );
}

const useServiceState = (): ClientServiceState => {
  const context = React.useContext(ClientServiceContext);
  if (context === undefined) {
    throw new Error("useServiceState must be used within a ServiceProvider");
  }
  return context.state;
};

const useServiceDispatch = (): ClientServiceDispatch => {
  const context = React.useContext(ClientServiceContext);
  if (context === undefined) {
    throw new Error("useServiceDispatch must be used within a ServiceProvider");
  }
  return context.dispatch;
};

const actions = {
  doCheck:
    (id: number) =>
    async (dispatch: ClientServiceDispatch): Promise<void> => {
      try {
        dispatch({
          type: "FORM_CHECK_STARTED",
        });
        const { data } = await axios.get(`/clientService/check/${id}`);

        dispatch({
          type: "FORM_FIND_SUCCESS",
          payload: {
            checkResult: data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FORM_FIND_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  doDBDataCall:
    (id: number, request: string) =>
    async (dispatch: ClientServiceDispatch): Promise<void> => {
      try {
        dispatch({
          type: "FORM_DBDATA_STARTED",
        });
        const { data } = await axios.post(`/clientService/dbDataCall/${id}`, {
          request,
        });

        dispatch({
          type: "FORM_FIND_SUCCESS",
          payload: {
            dbDataResponse: data.response,
          },
        });
      } catch (error) {
        dispatch({
          type: "FORM_FIND_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  doBrokerCall:
    (id: number, type: string, request: string) =>
    async (dispatch: ClientServiceDispatch): Promise<void> => {
      try {
        dispatch({
          type: "FORM_BROKER_STARTED",
        });
        const { data } = await axios.post(`/clientService/brokerCall/${id}`, {
          type,
          request,
        });

        dispatch({
          type: "FORM_FIND_SUCCESS",
          payload: {
            brokerResponse: data.response,
          },
        });
      } catch (error) {
        dispatch({
          type: "FORM_FIND_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  doMetrics:
    (id: number) =>
    async (dispatch: ClientServiceDispatch): Promise<void> => {
      try {
        dispatch({
          type: "FORM_FIND_STARTED",
        });
        const { data } = await axios.get(`/clientService/metrics/${id}`);

        dispatch({
          type: "FORM_FIND_SUCCESS",
          payload: {
            metrics: data,
          },
        });
      } catch (error) {
        dispatch({
          type: "FORM_FIND_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  ...genericActions<ClientServiceDto, ClientServiceDispatch>(
    "/clientService",
    "id"
  ),

  requestInfo: async (address: string): Promise<ServiceInfoDto> => {
    try {
      const { data } = await axios.post(`/clientService/info`, { address });
      return data;
    } catch (error) {
      throw new Error((error as any).response.data?.message);
    }
  },

  executeCommand: async (
    address: string,
    command: string,
    args?: string
  ): Promise<ServiceCommandDto> => {
    try {
      const { data } = await axios.post(`/clientService/executeCommand`, {
        address,
        command,
        args,
      });
      return data;
    } catch (error) {
      throw new Error((error as any).response.data?.message);
    }
  },
};

export { ServiceProvider, useServiceState, useServiceDispatch, actions };
