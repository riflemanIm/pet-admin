import React from "react";
import { ConfirmationCodeDto } from "../helpers/dto";
import {
  doGenericFetch,
  GenericAction,
  GenericListActionType,
  genericListReducer,
  GenericListState,
  initialListState,
} from "../helpers/state";

type ConfirmationCodeState = GenericListState<ConfirmationCodeDto>;

const initialData: ConfirmationCodeState = initialListState();

type Action = GenericAction<GenericListActionType>;

const reducer = (
  state = initialData,
  { type, payload }: Action
): ConfirmationCodeState => genericListReducer(state, { type, payload });

type ConfirmationCodeDispatch = React.Dispatch<Action>;
const emptyDispatch: ConfirmationCodeDispatch = () => null;

const ConfirmationCodeContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const ConfirmationCodeProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <ConfirmationCodeContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfirmationCodeContext.Provider>
  );
};

const useConfirmationCodeState = (): ConfirmationCodeState => {
  const context = React.useContext(ConfirmationCodeContext);
  if (context === undefined) {
    throw new Error(
      "useConfirmationCodeState must be used within a ConfirmationCodeProvider"
    );
  }
  return context.state;
};

const useConfirmationCodeDispatch = (): ConfirmationCodeDispatch => {
  const context = React.useContext(ConfirmationCodeContext);
  if (context === undefined) {
    throw new Error(
      "useConfirmationCodeDispatch must be used within a ConfirmationCodeProvider"
    );
  }
  return context.dispatch;
};

const actions = {
  doFetch: (confirmationCodeTypesId: number) =>
    doGenericFetch(`/confirmationCode/${confirmationCodeTypesId}/records`),
};

export {
  ConfirmationCodeProvider,
  useConfirmationCodeState,
  useConfirmationCodeDispatch,
  actions,
};
