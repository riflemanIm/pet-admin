/* eslint-disable import/no-named-as-default-member */
import React from "react";
import axios from "axios";
import {
  ClientDatabaseDto,
  ClientServiceDto,
  ClinicDto,
  ClinicImageDto,
  ListDto,
  MedicalBrandDto,
  MedicalNetDto,
  OrderDirection,
  ServiceTaskItem,
} from "../helpers/dto";
import {
  GenericState,
  GenericActionType,
  GenericAction,
  initialState,
  genericReducer,
  genericActions,
  doGenericReferenceLists,
} from "../helpers/state";

interface ClinicState extends GenericState<ClinicDto> {
  services: ClientServiceDto[];
  medicalBrands: MedicalBrandDto[];
  medicalNets: MedicalNetDto[];
  clientDatabases: ClientDatabaseDto[];
  images: ClinicImageDto[];
  tasks: ServiceTaskItem[];
}

const initialData: ClinicState = {
  ...initialState(),
  services: [],
  medicalBrands: [],
  medicalNets: [],
  clientDatabases: [],
  images: [],
  tasks: [],
};

type Action = GenericAction<GenericActionType | "SET_STATE" | "SET_ERROR">;

const clinicReducer = (
  state = initialData,
  { type, payload }: Action
): ClinicState => {
  if (type === "SET_ERROR") {
    return {
      ...state,
      errorMessage: payload,
    };
  }

  if (type === "SET_STATE") {
    const tasks = [...state.tasks];
    const task = tasks.find((task) => task.name === payload.taskName);
    if (!task) {
      tasks.push({
        title: payload.taskName,
        name: payload.taskName,
        state: payload.state,
      });
    } else {
      task.state = payload.state;
    }
    return {
      ...state,
      tasks,
    };
  }

  return genericReducer(state, { type, payload });
};

type ClinicDispatch = React.Dispatch<Action>;
const emptyDispatch: ClinicDispatch = () => null;

const ClinicContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const ClinicProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(clinicReducer, initialData);

  return (
    <ClinicContext.Provider value={{ state, dispatch }}>
      {children}
    </ClinicContext.Provider>
  );
};

const useClinicState = (): ClinicState => {
  const context = React.useContext(ClinicContext);
  if (context === undefined) {
    throw new Error("useClinicState must be used within a ClinicProvider");
  }
  return context.state;
};

const useClinicDispatch = (): ClinicDispatch => {
  const context = React.useContext(ClinicContext);
  if (context === undefined) {
    throw new Error("useClinicDispatch must be used within a ClinicProvider");
  }
  return context.dispatch;
};

const actions = {
  ...genericActions<ClinicDto, ClinicDispatch>("/clinic", "clinicId"),
  doFind:
    (id: number) =>
    async (dispatch: ClinicDispatch): Promise<void> => {
      try {
        dispatch({
          type: "FORM_FIND_STARTED",
        });
        const req = [
          axios.get(`/clinic/${id}`),
          axios.get(`/clinic/image/${id}`),
        ];

        await axios.all(req).then((res) => {
          const payload: Partial<ClinicState> = {
            current: res[0].data as ClinicDto,
            images: res[1].data as ClinicImageDto[],
          };

          dispatch({
            type: "FORM_FIND_SUCCESS",
            payload,
          });
        });
      } catch (error) {
        dispatch({
          type: "FORM_FIND_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  doReferenceLists: doGenericReferenceLists({
    services: "/clientService",
    medicalBrands: "/medicalBrand",
    medicalNets: "/medicalNet",
    clientDatabases: "/clinic/clientDatabase",
  }),

  doCheck:
    (id: number) =>
    async (dispatch: ClinicDispatch): Promise<void> => {
      try {
        const response = await axios.post(`/clinic/check/${id}`);
        dispatch({
          type: "SET_STATE",
          payload: {
            taskName: `${id}`,
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

  doCheckState:
    (id: number) =>
    async (dispatch: ClinicDispatch): Promise<void> => {
      try {
        const response = await axios.get(`/clinic/check/${id}`);
        dispatch({
          type: "SET_STATE",
          payload: {
            taskName: `${id}`,
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

  doAddImages:
    (values: ClinicImageDto[], notify: (message?: string) => void) =>
    async (dispatch: ClinicDispatch): Promise<void> => {
      try {
        await axios
          .post("/clinic/image", values)
          .then(() => {
            notify("Изображения добавлены");
          })
          .catch((error) => {
            console.log("error", error);

            dispatch({
              type: "FORM_UPDATE_ERROR",
              payload: error.response.data?.message,
            });
          });
      } catch (error) {
        console.log("error", error);

        notify("Error add clinic");
        dispatch({
          type: "FORM_UPDATE_ERROR",
        });
      }
    },
  doUpdateImage:
    (id: number, values: ClinicImageDto, notify: (message?: string) => void) =>
    async (dispatch: ClinicDispatch): Promise<void> => {
      await axios
        .put(`/clinic/image/${id}`, values)
        .then((response) => {
          notify("Изображение обновлено");
          console.log("response", response);
        })
        .catch((error) => {
          console.log("error", error);

          dispatch({
            type: "FORM_UPDATE_ERROR",
            payload: error.response.data?.message,
          });
        });
    },

  doRemoveImage:
    (id: number, notify: (message?: string) => void) =>
    async (dispatch: ClinicDispatch): Promise<void> => {
      try {
        await axios
          .delete(`/clinic/image/${id}`)
          .then(({ data }) => {
            console.log("-------  doRemoveImage --------", data);
            notify("Изображение удалено");
          })
          .catch((error) => {
            console.log("error", error);

            dispatch({
              type: "FORM_UPDATE_ERROR",
              payload: error.response.data?.message,
            });
          });
      } catch (error) {
        console.log("error", error);

        notify("Error add clinic");
        dispatch({
          type: "FORM_UPDATE_ERROR",
        });
      }
    },

  getClientDatabaseList: async (
    startIndex = 0,
    count = 50,
    filter: string | null = null,
    orderBy: string | null = null,
    order: OrderDirection = "asc"
  ) => {
    const res = await axios.get(`/clinic/clientDatabase`, {
      params: {
        startIndex,
        count,
        filter,
        orderBy,
        order,
      },
    });
    return res.data as ListDto<ClientDatabaseDto>;
  },
  doAddClientDatabase: (value: ClientDatabaseDto): Promise<void> => {
    return axios.post("/clinic/clientDatabase", value);
  },
  doUpdateClientDatabase: (
    id: number,
    values: ClientDatabaseDto
  ): Promise<void> => {
    return axios.put(`/clinic/clientDatabase/${id}`, values);
  },
  doDeleteClientDatabase: (id: number): Promise<void> => {
    return axios.delete(`/clinic/clientDatabase/${id}`);
  },
};

export { ClinicProvider, useClinicState, useClinicDispatch, actions };
