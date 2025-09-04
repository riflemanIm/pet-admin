import React from 'react';
import { genericReducer, GenericState, initialState, GenericActionType, genericActions } from '../helpers/state';
import { DictDto } from '../helpers/dto';

export type EntityName = 'ages' | 'taste' | 'designedFor' | 'ingredient' | 'hardness' | 'packages' | 'petSizes' | 'specialNeeds';

type DictState = GenericState<DictDto>;
type Action = { type: GenericActionType; payload?: any };
type DictDispatch = React.Dispatch<Action>;

type CtxValue = {
  state: DictState;
  dispatch: DictDispatch;
  // actions уже «завязаны» на базовый url и id-поле
  actions: ReturnType<typeof genericActions<DictDto, DictDispatch>>;
  entity: EntityName;
  baseUrl: string;
};

const initialData: DictState = { ...initialState<DictDto>() };

const DictContext = React.createContext<CtxValue>({
  state: initialData,
  dispatch: () => null,
  // заглушка — не будет использована вне провайдера
  actions: genericActions<DictDto, DictDispatch>('/dicts/ages', 'id'),
  entity: 'ages',
  baseUrl: '/dicts/ages'
});

export const DictProvider = ({ entity, children }: { entity: EntityName; children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(
    (s: DictState, a: Action) => genericReducer<DictDto, DictState, GenericActionType>(s, a as { type: GenericActionType; payload: any }),
    initialData
  );

  const baseUrl = React.useMemo(() => `dicts?dict=${entity}`, [entity]);
  const actions = React.useMemo(() => genericActions<DictDto, DictDispatch>(baseUrl, 'id'), [baseUrl]);

  const value = React.useMemo<CtxValue>(() => ({ state, dispatch, actions, entity, baseUrl }), [state, dispatch, actions, entity, baseUrl]);

  return <DictContext.Provider value={value}>{children}</DictContext.Provider>;
};

export const useDictState = () => React.useContext(DictContext).state;
export const useDictDispatch = () => React.useContext(DictContext).dispatch;
export const useDictActions = () => React.useContext(DictContext).actions;
export const useDictMeta = () => {
  const { entity, baseUrl } = React.useContext(DictContext);
  return { entity, baseUrl };
};
