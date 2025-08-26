import React from "react";
import { ClinicPlExGrWebDto, SpecializationDto } from "../helpers/dto";
import {
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

interface ClinicPlExGrWebState extends GenericState<ClinicPlExGrWebDto> {
  specializations: SpecializationDto[];
}

const initialData: ClinicPlExGrWebState = {
  ...initialState(),
  specializations: [],
};

type Action = GenericAction<GenericActionType>;

const clinicPlExGrWebReducer = (
  state = initialData,
  { type, payload }: Action
): ClinicPlExGrWebState => genericReducer(state, { type, payload });

type ClinicPlExGrWebDispatch = React.Dispatch<Action>;
const emptyDispatch: ClinicPlExGrWebDispatch = () => null;

const ClinicPlExGrWebContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const ClinicPlExGrWebProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(
    clinicPlExGrWebReducer,
    initialData
  );

  return (
    <ClinicPlExGrWebContext.Provider value={{ state, dispatch }}>
      {children}
    </ClinicPlExGrWebContext.Provider>
  );
};

const useClinicPlExGrWebState = (): ClinicPlExGrWebState => {
  const context = React.useContext(ClinicPlExGrWebContext);
  if (context === undefined) {
    throw new Error(
      "useClinicPlExGrWebState must be used within a ClinicPlExGrWebState"
    );
  }
  return context.state;
};

const useClinicPlExGrWebDispatch = (): ClinicPlExGrWebDispatch => {
  const context = React.useContext(ClinicPlExGrWebContext);
  if (context === undefined) {
    throw new Error(
      "useClinicPlExGrWebDispatch must be used within a ClinicPlExGrWebState"
    );
  }
  return context.dispatch;
};

const actions = {
  doFind: (clinicId: number) => doGenericFind(`/clinic/plExGrWeb/${clinicId}`),

  doReferenceLists: doGenericReferenceLists({
    specializations: "/specialization",
  }),

  doUpdate: (clinicId: number) =>
    doGenericUpdate<ClinicPlExGrWebDto, ClinicPlExGrWebDispatch>(
      `/clinic/plExGrWeb/${clinicId}`
    ),

  doFetch: (clinicId: number) =>
    doGenericFetch(`/clinic/plExGrWeb/${clinicId}`),
  doDelete: (clinicId: number) =>
    doGenericDelete(`/clinic/plExGrWeb/${clinicId}`),

  ...genericConfirmActions(),
};

export {
  ClinicPlExGrWebProvider,
  useClinicPlExGrWebState,
  useClinicPlExGrWebDispatch,
  actions,
};
