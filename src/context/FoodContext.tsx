import React from 'react';
import { genericReducer, GenericState, initialState, GenericActionType, genericActions, doGenericReferenceLists } from '../helpers/state';
import { GridValidRowModel } from '@mui/x-data-grid';

export type FoodState = GenericState<FoodDto>;
type Action = { type: GenericActionType; payload?: any };
type Dispatch = React.Dispatch<Action>;
export const imgApiUrl = import.meta.env.VITE_IMG_URL;
// DTO для админки
export interface FoodDto extends GridValidRowModel {
  id?: number;
  artikul?: string | null;
  title?: string | null;
  price?: number;
  priceDiscount?: number;
  vat?: boolean;
  isPromo?: boolean;
  ozonId?: string | null;
  img?: string | null;
  imgUrl?: string | null;
  feature?: string | null;
  weight?: number | null;
  quantity?: number | null;
  quantityPackages?: number | null;
  type?: 'Treat' | 'Souvenirs' | 'DryFood';
  expiration?: number | null;
  annotation?: string | null;
  packageSize?: string | null;
  tasteId?: number | null;
  ingredientId?: number | null;
  hardnessId?: number | null;
  stock?: number;

  // M:N как массивы id
  designedForIds?: number[];
  ageIds?: number[];
  typeTreatIds?: number[];
  petSizeIds?: number[];
  packageIds?: number[];
  specialNeedsIds?: number[];

  // доп. изображения
  imgsAdd?: string[];
  createdAt?: string;
  publishedAt?: string;
}

const initialData: FoodState = { ...initialState<FoodDto>() };

const Ctx = React.createContext<{
  state: FoodState;
  dispatch: Dispatch;
  actions: ReturnType<typeof genericActions<FoodDto, Dispatch>>;
  refs: Partial<
    Record<
      'ages' | 'taste' | 'designedFor' | 'ingredient' | 'hardness' | 'packages' | 'petSizes' | 'specialNeeds' | 'typeTreats',
      { id: number; name: string }[]
    >
  >;
  reloadRefs: () => Promise<void>;
} | null>(null);

export const FoodProvider = ({ children }: { children: React.ReactNode }) => {
  // список / форма — через общий genericReducer
  const [state, dispatch] = React.useReducer(
    (s: FoodState, a: Action) => genericReducer<FoodDto, FoodState, GenericActionType>(s, a),
    initialData
  );

  // CRUD экшены для еды
  const actions = React.useMemo(() => genericActions<FoodDto, Dispatch>('/admin/foods', 'id'), []);

  // справочники — держим отдельно, не трогаем общий редьюсер
  const [refs, setRefs] = React.useState<
    Partial<
      Record<
        'ages' | 'taste' | 'designedFor' | 'ingredient' | 'hardness' | 'packages' | 'petSizes' | 'specialNeeds' | 'typeTreats',
        { id: number; name: string }[]
      >
    >
  >({});

  // создаём thunk-загрузчик справочников один раз
  const refThunk = React.useMemo(
    () =>
      doGenericReferenceLists<Dispatch>({
        ages: '/admin/dicts/ages',
        taste: '/admin/dicts/taste',
        designedFor: '/admin/dicts/designedFor',
        ingredient: '/admin/dicts/ingredient',
        hardness: '/admin/dicts/hardness',
        packages: '/admin/dicts/packages',
        petSizes: '/admin/dicts/petSizes',
        specialNeeds: '/admin/dicts/specialNeeds',
        typeTreats: '/admin/dicts/typeTreats' // если добавишь на бэке
      }),
    []
  );

  // обёртка, которая реально вызывает thunk с диспатчером
  const reloadRefs = React.useCallback(async () => {
    try {
      // используем настоящий dispatch — thunk сам сделает axios.all(...)
      const payload = await new Promise<Record<string, { id: number; name: string }[]>>((resolve, reject) => {
        // перехватываем один раз результат REFERENCE_FETCH_SUCCESS,
        // чтобы забрать данные в локальный setRefs и не трогать список.
        const interceptor: Dispatch = (action: any) => {
          if (action?.type === 'REFERENCE_FETCH_SUCCESS') {
            resolve(action.payload);
          } else if (action?.type === 'REFERENCE_FETCH_ERROR') {
            reject(action.payload);
          } else {
            // прокидываем остальные экшены в основной редьюсер,
            // они не должны затирать rows
            dispatch(action);
          }
        };
        refThunk()(interceptor as any);
      });
      setRefs(payload);
    } catch (e) {
      // опционально: показать уведомление
      // console.error('Ref load error', e);
    }
  }, [refThunk, dispatch]);

  // первая загрузка справочников
  React.useEffect(() => {
    void reloadRefs();
  }, [reloadRefs]);

  return <Ctx.Provider value={{ state, dispatch, actions, refs, reloadRefs }}>{children}</Ctx.Provider>;
};

function useCtx() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error('FoodContext used outside of FoodProvider');
  return v;
}

export const useFoodState = () => useCtx().state;
export const useFoodDispatch = () => useCtx().dispatch;
export const useFoodActions = () => useCtx().actions;
export const useFoodRefs = () => {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('FoodContext used outside of FoodProvider');
  return { refs: ctx.refs, reloadRefs: ctx.reloadRefs };
};
