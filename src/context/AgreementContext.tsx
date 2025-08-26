import React from "react";
import { MedicalNetDto, AgreementDto, AgreementTypeDto } from "../helpers/dto";
import {
  doGenericReferenceLists,
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

interface AgreementState extends GenericState<AgreementDto> {
  medicalNets: MedicalNetDto[];
  agreementTypes: AgreementTypeDto[];
}

const initialData: AgreementState = {
  ...initialState(),
  medicalNets: [],
  agreementTypes: [],
};

type Action = GenericAction<GenericActionType>;

const reducer = (
  state = initialData,
  { type, payload }: Action
): AgreementState => genericReducer(state, { type, payload });

type AgreementDispatch = React.Dispatch<Action>;
const emptyDispatch: AgreementDispatch = () => null;

const AgreementContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const AgreementProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <AgreementContext.Provider value={{ state, dispatch }}>
      {children}
    </AgreementContext.Provider>
  );
};

const useAgreementState = (): AgreementState => {
  const context = React.useContext(AgreementContext);
  if (context === undefined) {
    throw new Error(
      "useAgreementState must be used within a AgreementProvider"
    );
  }
  return context.state;
};

const useAgreementDispatch = (): AgreementDispatch => {
  const context = React.useContext(AgreementContext);
  if (context === undefined) {
    throw new Error(
      "useAgreementDispatch must be used within a AgreementProvider"
    );
  }
  return context.dispatch;
};

const actions = {
  doReferenceLists: doGenericReferenceLists({
    medicalNets: "/medicalNet",
    agreementTypes: "/agreement/types",
  }),

  ...genericActions<AgreementDto, AgreementDispatch>(
    "/agreement",
    "agreementId"
  ),
};

export { AgreementProvider, useAgreementState, useAgreementDispatch, actions };
