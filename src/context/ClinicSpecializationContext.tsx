import React from "react";
import { ClinicSpecializationDto, SpecializationDto } from "../helpers/dto";
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

interface ClinicSpecializationState
  extends GenericState<ClinicSpecializationDto> {
  specializations: SpecializationDto[];
}

const initialData: ClinicSpecializationState = {
  ...initialState(),
  specializations: [],
};

type Action = GenericAction<GenericActionType>;

const clinicSpecializationReducer = (
  state = initialData,
  { type, payload }: Action
): ClinicSpecializationState => genericReducer(state, { type, payload });

type ClinicSpecializationDispatch = React.Dispatch<Action>;
const emptyDispatch: ClinicSpecializationDispatch = () => null;

const ClinicSpecializationContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const ClinicSpecializationProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(
    clinicSpecializationReducer,
    initialData
  );

  return (
    <ClinicSpecializationContext.Provider value={{ state, dispatch }}>
      {children}
    </ClinicSpecializationContext.Provider>
  );
};

const useClinicSpecializationState = (): ClinicSpecializationState => {
  const context = React.useContext(ClinicSpecializationContext);
  if (context === undefined) {
    throw new Error(
      "useClinicSpecializationState must be used within a ClinicSpecializationState"
    );
  }
  return context.state;
};

const useClinicSpecializationDispatch = (): ClinicSpecializationDispatch => {
  const context = React.useContext(ClinicSpecializationContext);
  if (context === undefined) {
    throw new Error(
      "useClinicSpecializationDispatch must be used within a ClinicSpecializationState"
    );
  }
  return context.dispatch;
};

const actions = {
  doFind: (clinicId: number) =>
    doGenericFind(`/clinic/specialization/${clinicId}`),

  doReferenceLists: doGenericReferenceLists({
    specializations: "/specialization",
  }),

  doUpdate: (clinicId: number) =>
    doGenericUpdate<ClinicSpecializationDto, ClinicSpecializationDispatch>(
      `/clinic/specialization/${clinicId}`
    ),

  doFetch: (clinicId: number) =>
    doGenericFetch(`/clinic/specialization/${clinicId}`),
  doDelete: (clinicId: number) =>
    doGenericDelete(`/clinic/specialization/${clinicId}`),

  ...genericConfirmActions(),
};

export {
  ClinicSpecializationProvider,
  useClinicSpecializationState,
  useClinicSpecializationDispatch,
  actions,
};
