// src/context/DictContext.tsx
import React from 'react';
import { genericReducer, GenericState, initialState, GenericActionType, genericActions } from '../helpers/state';
import { DictDto } from '../helpers/dto';

export type EntityName =
  | 'ages'
  | 'taste'
  | 'designedFor'
  | 'ingredient'
  | 'hardness'
  | 'packages'
  | 'petSizes'
  | 'specialNeeds'
  | 'typeTreat';

type DictState = GenericState<DictDto>;
type Action = { type: GenericActionType; payload?: any };
type DictDispatch = React.Dispatch<Action>;

const initialData: DictState = { ...initialState<DictDto>() };

const Ctx = React.createContext<{
  state: DictState;
  dispatch: DictDispatch;
  actions: ReturnType<typeof genericActions<DictDto, DictDispatch>>;
  entity: EntityName;
  baseUrl: string;
} | null>(null);

export const DictProvider = ({
  entity, // <-- ТЕПЕРЬ ОБЯЗАТЕЛЕН
  children
}: {
  entity: EntityName;
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(
    (s: DictState, a: Action) => genericReducer<DictDto, DictState, GenericActionType>(s, a as { type: GenericActionType; payload: any }),
    initialData
  );

  const baseUrl = `/admin/dicts/${entity}`;
  const actions = React.useMemo(() => genericActions<DictDto, DictDispatch>(baseUrl, 'id'), [baseUrl]);

  return <Ctx.Provider value={{ state, dispatch, actions, entity, baseUrl }}>{children}</Ctx.Provider>;
};

function useCtx() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error('DictContext used outside of DictProvider');
  return v;
}

export const useDictState = () => useCtx().state;
export const useDictDispatch = () => useCtx().dispatch;
export const useDictActions = () => useCtx().actions;
export const useDictMeta = () => {
  const { entity, baseUrl } = useCtx();
  return { entity, baseUrl };
};
