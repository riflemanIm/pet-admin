import React from "react";
import { Hl7LogDto } from "../helpers/dto";
import {
  doGenericFetch,
  GenericAction,
  GenericListActionType,
  genericListReducer,
  GenericListState,
  initialListState,
} from "../helpers/state";

type Hl7LogState = GenericListState<Hl7LogDto>;

const initialData: Hl7LogState = initialListState();

type Action = GenericAction<GenericListActionType>;

const reducer = (state = initialData, { type, payload }: Action): Hl7LogState =>
  genericListReducer(state, { type, payload });

type Hl7LogDispatch = React.Dispatch<Action>;
const emptyDispatch: Hl7LogDispatch = () => null;

const Hl7LogContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const Hl7LogProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <Hl7LogContext.Provider value={{ state, dispatch }}>
      {children}
    </Hl7LogContext.Provider>
  );
};

const useHl7LogState = (): Hl7LogState => {
  const context = React.useContext(Hl7LogContext);
  if (context === undefined) {
    throw new Error("useHl7LogState must be used within a Hl7LogProvider");
  }
  return context.state;
};

const useHl7LogDispatch = (): Hl7LogDispatch => {
  const context = React.useContext(Hl7LogContext);
  if (context === undefined) {
    throw new Error("useHl7LogDispatch must be used within a Hl7LogProvider");
  }
  return context.dispatch;
};

const actions = {
  doFetch: (hl7NotificationTypeId: number) =>
    doGenericFetch(`/hl7Settings/${hl7NotificationTypeId}/records`),
};

export { Hl7LogProvider, useHl7LogState, useHl7LogDispatch, actions };
