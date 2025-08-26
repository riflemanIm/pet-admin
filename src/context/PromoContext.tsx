import React from "react";
import { MedicalNetActionDto, MedicalNetDto } from "../helpers/dto";
import {
  doGenericReferenceLists,
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

interface PromoActionState extends GenericState<MedicalNetActionDto> {
  medicalNets: MedicalNetDto[];
}

const initialData: PromoActionState = {
  ...initialState(),
  medicalNets: [],
};

type Action = GenericAction<GenericActionType>;

const promoReducer = (
  state = initialData,
  { type, payload }: Action
): PromoActionState => genericReducer(state, { type, payload });

type PromoDispatch = React.Dispatch<Action>;
const emptyDispatch: PromoDispatch = () => null;

const PromoContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const PromoProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(promoReducer, initialData);

  return (
    <PromoContext.Provider value={{ state, dispatch }}>
      {children}
    </PromoContext.Provider>
  );
};

const usePromoState = (): PromoActionState => {
  const context = React.useContext(PromoContext);
  if (context === undefined) {
    throw new Error("usePromoState must be used within a PromoProvider");
  }
  return context.state;
};

const usePromoDispatch = (): PromoDispatch => {
  const context = React.useContext(PromoContext);
  if (context === undefined) {
    throw new Error("usePromoDispatch must be used within a PromoProvider");
  }
  return context.dispatch;
};

// ###########################################################

const actions = {
  doReferenceLists: doGenericReferenceLists({
    medicalNets: "/medicalNet",
  }),

  ...genericActions<MedicalNetActionDto, PromoDispatch>(
    "/medicalNetAction",
    "medicalnetActionsId"
  ),
};

export { PromoProvider, usePromoState, usePromoDispatch, actions };
