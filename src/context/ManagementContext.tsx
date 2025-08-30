// src/context/ManagementContext.tsx
import React from 'react';
import { genericReducer, GenericState, initialState, GenericActionType, genericActions } from '../helpers/state';
import { UserDto } from '../helpers/dto';

type UserState = GenericState<UserDto>;

const initialData: UserState = { ...initialState<UserDto>() };

type Action = { type: GenericActionType; payload?: any };

const managementReducer = (state = initialData, action: Action): UserState => genericReducer<UserDto>(state, action);

type ManagementDispatch = React.Dispatch<Action>;
const ManagementContext = React.createContext<{ state: UserState; dispatch: ManagementDispatch }>({
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
  ...genericActions<UserDto, ManagementDispatch>('/user', 'userId') // doFetch, doFind, doCreate, doUpdate, doDelete, doOpenConfirm, doCloseConfirm
};
