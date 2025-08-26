import React from "react";
import axios from "axios";
import {
  WebFormAuthResultDto,
  WebFormDto,
  MedicalNetDto,
} from "../helpers/dto";
import {
  doGenericReferenceLists,
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

interface WebFormState extends GenericState<WebFormDto> {
  medicalNets: MedicalNetDto[];
}

const initialData: WebFormState = {
  ...initialState(),
  medicalNets: [],
};

type Action = GenericAction<GenericActionType>;

const reducer = (
  state = initialData,
  { type, payload }: Action
): WebFormState => genericReducer(state, { type, payload });

type WebFormDispatch = React.Dispatch<Action>;
const emptyDispatch: WebFormDispatch = () => null;

const WebFormContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const WebFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <WebFormContext.Provider value={{ state, dispatch }}>
      {children}
    </WebFormContext.Provider>
  );
};

const useWebFormState = (): WebFormState => {
  const context = React.useContext(WebFormContext);
  if (context === undefined) {
    throw new Error("useWebFormState must be used within a WebFormProvider");
  }
  return context.state;
};

const useWebFormDispatch = (): WebFormDispatch => {
  const context = React.useContext(WebFormContext);
  if (context === undefined) {
    throw new Error("useWebFormDispatch must be used within a WebFormProvider");
  }
  return context.dispatch;
};

const actions = {
  doReferenceLists: doGenericReferenceLists({
    medicalNets: "/medicalNet",
  }),

  ...genericActions<WebFormDto, WebFormDispatch>("/webform", "calypsoFormId"),

  doAuth: async (id: number): Promise<WebFormAuthResultDto | undefined> => {
    try {
      const { data } = await axios.get(`/webform/auth/${id}`);

      return data as WebFormAuthResultDto;
    } catch (error) {
      console.error((error as any).response.data?.message);
    }
  },
};

export { WebFormProvider, useWebFormState, useWebFormDispatch, actions };
