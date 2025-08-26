import React from "react";
import axios from "axios";
import {
  MedicalNetDto,
  MedicalNetFaqDto,
  MedicalNetImageDto,
} from "../helpers/dto";
import {
  doGenericCreate,
  doGenericDelete,
  doGenericFetch,
  doGenericFind,
  doGenericReferenceLists,
  doGenericUpdate,
  GenericAction,
  GenericActionType,
  genericConfirmActions,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

const listImages = async (medicalNetId: number | undefined) => {
  const response = await axios.get(`/medicalNetFaq/image/${medicalNetId}`);
  return {
    images: response.data as MedicalNetImageDto[],
  };
};

interface MedicalNetFaqState extends GenericState<MedicalNetFaqDto> {
  medicalNets: MedicalNetDto[];
  images: MedicalNetImageDto[];
  medicalNetId: number | undefined;
}

const initialData: MedicalNetFaqState = {
  ...initialState(),
  images: [],
  medicalNets: [],
  medicalNetId: undefined,
};

type MedicalNetFaqActionType = GenericActionType | "SET_MEDICAL_NET_ID";

type Action = GenericAction<MedicalNetFaqActionType>;

const reducer = (
  state = initialData,
  { type, payload }: Action
): MedicalNetFaqState => {
  if (type === "SET_MEDICAL_NET_ID") {
    return { ...state, medicalNetId: payload };
  }
  return genericReducer(state, { type, payload });
};

type MedicalNetFaqDispatch = React.Dispatch<Action>;
const emptyDispatch: MedicalNetFaqDispatch = () => null;

const MedicalNetFaqContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const MedicalNetFaqProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <MedicalNetFaqContext.Provider value={{ state, dispatch }}>
      {children}
    </MedicalNetFaqContext.Provider>
  );
};

const useMedicalNetFaqState = (): MedicalNetFaqState => {
  const context = React.useContext(MedicalNetFaqContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalNetFaqState must be used within a MedicalNetFaqProvider"
    );
  }
  return context.state;
};

const useMedicalNetFaqDispatch = (): MedicalNetFaqDispatch => {
  const context = React.useContext(MedicalNetFaqContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalNetFaqDispatch must be used within a MedicalNetFaqProvider"
    );
  }
  return context.dispatch;
};

const actions = {
  doFind: doGenericFind("/medicalNetFaq"),

  doReferenceLists: doGenericReferenceLists({
    medicalNets: "/medicalNet",
  }),

  doCreate: doGenericCreate<MedicalNetFaqDto, MedicalNetFaqDispatch>(
    "/medicalNetFaq",
    "medicalNetFaqId"
  ),

  doUpdate: doGenericUpdate<MedicalNetFaqDto, MedicalNetFaqDispatch>(
    "/medicalNetFaq"
  ),

  doFetch: (medicalNetId?: number) =>
    doGenericFetch<MedicalNetFaqDto, MedicalNetFaqDispatch>("/medicalNetFaq", {
      medicalNetId,
    }),

  doDelete: doGenericDelete("/medicalNetFaq"),
  ...genericConfirmActions<MedicalNetFaqDispatch>(),

  doFetchImages:
    (medicalNetId: number | undefined) =>
    async (dispatch: MedicalNetFaqDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_FETCH_STARTED",
        });

        const response = await listImages(medicalNetId);

        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response,
        });
      } catch (error) {
        dispatch({
          type: "LIST_FETCH_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  doAddImages:
    (
      medicalNetId: number | undefined,
      values: MedicalNetImageDto[],
      notify: (message?: string) => void
    ) =>
    async (dispatch: MedicalNetFaqDispatch): Promise<void> => {
      try {
        await axios.post("/medicalNetFaq/image", values);
        const response = await listImages(medicalNetId);
        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response,
        });
        notify("Изображения добавлены");
      } catch (error) {
        notify((error as any).response.data?.message);
        dispatch({
          type: "FORM_UPDATE_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  doDeleteImage:
    (
      medicalNetId: number | undefined,
      id: number,
      notify: (message?: string) => void
    ) =>
    async (dispatch: MedicalNetFaqDispatch): Promise<void> => {
      try {
        await axios.delete(`/medicalNetFaq/image/${id}`);
        const response = await listImages(medicalNetId);
        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response,
        });
        notify("Изображение удалено");
      } catch (error) {
        notify((error as any).response.data?.message);
        dispatch({
          type: "FORM_UPDATE_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  setMedicalNetId:
    (medicalNetId: number | undefined) => (dispatch: MedicalNetFaqDispatch) => {
      dispatch({
        type: "SET_MEDICAL_NET_ID",
        payload: medicalNetId,
      });
    },
};

export {
  MedicalNetFaqProvider,
  useMedicalNetFaqState,
  useMedicalNetFaqDispatch,
  actions,
};
