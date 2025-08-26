import React from "react";
import { MedicalBrandDto } from "../helpers/dto";
import {
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

type MedicalBrandState = GenericState<MedicalBrandDto>;

const initialData: MedicalBrandState = initialState();

type Action = GenericAction<GenericActionType>;

const medicalBrandReducer = (
  state = initialData,
  { type, payload }: Action
): MedicalBrandState => genericReducer(state, { type, payload });

type MedicalBrandDispatch = React.Dispatch<Action>;
const emptyDispatch: MedicalBrandDispatch = () => null;

const MedicalBrandContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const MedicalBrandProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(medicalBrandReducer, initialData);

  return (
    <MedicalBrandContext.Provider value={{ state, dispatch }}>
      {children}
    </MedicalBrandContext.Provider>
  );
};

const useMedicalBrandState = (): MedicalBrandState => {
  const context = React.useContext(MedicalBrandContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalBrandState must be used within a MedicalBrandProvider"
    );
  }
  return context.state;
};

const useMedicalBrandDispatch = (): MedicalBrandDispatch => {
  const context = React.useContext(MedicalBrandContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalBrandDispatch must be used within a MedicalBrandProvider"
    );
  }
  return context.dispatch;
};

const actions = genericActions<MedicalBrandDto, MedicalBrandDispatch>(
  "/medicalBrand",
  "medicalBrandId"
);

export {
  MedicalBrandProvider,
  useMedicalBrandState,
  useMedicalBrandDispatch,
  actions,
};
