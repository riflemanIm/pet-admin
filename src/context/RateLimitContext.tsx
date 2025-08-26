import React from "react";
import { RateLimitDto } from "../helpers/dto";
import {
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

type RateLimiState = GenericState<RateLimitDto>;

const initialData: RateLimiState = initialState();

type Action = GenericAction<GenericActionType>;

const reducer = (
  state = initialData,
  { type, payload }: Action
): RateLimiState => genericReducer(state, { type, payload });

type RateLimitDispatch = React.Dispatch<Action>;
const emptyDispatch: RateLimitDispatch = () => null;

const RateLimitContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const RateLimitProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <RateLimitContext.Provider value={{ state, dispatch }}>
      {children}
    </RateLimitContext.Provider>
  );
};

const useRateLimitState = (): RateLimiState => {
  const context = React.useContext(RateLimitContext);
  if (context === undefined) {
    throw new Error(
      "useRateLimitState must be used within a RateLimitProvider"
    );
  }
  return context.state;
};

const useRateLimitDispatch = (): RateLimitDispatch => {
  const context = React.useContext(RateLimitContext);
  if (context === undefined) {
    throw new Error(
      "useRateLimitDispatch must be used within a RateLimitProvider"
    );
  }
  return context.dispatch;
};

const actions = genericActions<RateLimitDto, RateLimitDispatch>(
  "/rateLimit",
  "rateLimitSettingsId"
);

export { RateLimitProvider, useRateLimitState, useRateLimitDispatch, actions };
