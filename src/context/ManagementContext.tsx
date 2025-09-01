// src/context/ManagementContext.tsx
import React from 'react';
import { genericReducer, GenericState, initialState, GenericActionType, genericActions } from '../helpers/state';
import { UserDto } from '../helpers/dto';

type UserState = GenericState<UserDto>;
type Action = { type: GenericActionType; payload?: any };
type ManagementDispatch = React.Dispatch<Action>;

const initialData: UserState = { ...initialState<UserDto>() };

const managementReducer = (state: UserState = initialData, action: Action): UserState =>
  // главное — задать ВСЕ дженерики явно:
  genericReducer<UserDto, UserState, GenericActionType>(state, action);

const ManagementContext = React.createContext<{
  state: UserState;
  dispatch: ManagementDispatch;
}>({
  state: initialData,
  dispatch: () => null
});

export const ManagementProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(managementReducer, initialData);

  return <ManagementContext.Provider value={{ state, dispatch }}>{children}</ManagementContext.Provider>;
};

export const useManagementState = () => React.useContext(ManagementContext).state;
export const useManagementDispatch = () => React.useContext(ManagementContext).dispatch;

export const actions = {
  // тут тоже дженерики заданы явно
  ...genericActions<UserDto, ManagementDispatch>('/user', 'userId')
};
