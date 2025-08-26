import React from 'react';
import axios from 'axios';
import isEmpty from '../helpers/isEmpty';
import { TranslationsBackupsDto, TranslationsCheckedDto, TranslationsDto } from '../helpers/dto';
import { genericActions, GenericActionType, genericReducer, GenericState, initialState } from '../helpers/state';
import { NavigateFunction } from 'react-router-dom';

export interface TranslationFilter {
  pname: string;
  gkey?: string;
  checked?: string;
}

interface TranslationState extends GenericState<TranslationsDto> {
  backupsTranslation: TranslationsBackupsDto[];
  modalOpenCheched: boolean;
  checked: {
    checkedRu: boolean;
    checkedEn: boolean;
    checkedFr: boolean;
  };
  filterVals: TranslationFilter;
  groups: string[];
}

const filterVals = JSON.parse(localStorage.getItem('translationFilterVals') || '{}') as TranslationFilter;

const initialData: TranslationState = {
  ...initialState<TranslationsDto>(),
  backupsTranslation: [],
  modalOpenCheched: false,
  checked: { checkedRu: true, checkedEn: true, checkedFr: true },
  filterVals: isEmpty(filterVals)
    ? {
        pname: 'mobimed_site',
        gkey: '',
        checked: 'not_checked_all'
      }
    : filterVals,
  groups: []
};

type TranslationType =
  | GenericActionType
  | 'TRANSLATIONS_FIND_BACKUPS_STARTED'
  | 'TRANSLATIONS_FIND_BACKUPS_SUCCESS'
  | 'TRANSLATIONS_FIND_BACKUPS_ERROR'
  | 'TRANSLATIONS_CHECKED_OPEN'
  | 'TRANSLATIONS_CHECKED_CLOSE'
  | 'TRANSLATIONS_SELECTED_CHECKED'
  | 'TRANSLATIONS_SET_FILTERS';

interface Action {
  type: TranslationType;
  payload?: any;
}

const translationReducer = (state = initialData, { type, payload }: Action): TranslationState => {
  if (type === 'TRANSLATIONS_FIND_BACKUPS_STARTED') {
    return {
      ...state,
      backupsTranslation: [],
      findLoading: true
    };
  }
  if (type === 'TRANSLATIONS_FIND_BACKUPS_SUCCESS') {
    return {
      ...state,
      backupsTranslation: payload,
      findLoading: false
    };
  }
  if (type === 'TRANSLATIONS_FIND_BACKUPS_ERROR') {
    return {
      ...state,
      backupsTranslation: [],
      findLoading: false
    };
  }

  if (type === 'TRANSLATIONS_CHECKED_OPEN') {
    return {
      ...state,
      modalOpenCheched: true
    };
  }
  if (type === 'TRANSLATIONS_CHECKED_CLOSE') {
    return {
      ...state,
      modalOpenCheched: false
    };
  }

  if (type === 'TRANSLATIONS_SELECTED_CHECKED') {
    return {
      ...state,
      checked: payload
    };
  }

  if (type === 'TRANSLATIONS_SET_FILTERS') {
    return {
      ...state,
      filterVals: { ...state.filterVals, ...payload }
    };
  }

  return genericReducer(state, { type, payload });
};

type TranslationDispatch = React.Dispatch<Action>;
const emptyDispatch: TranslationDispatch = () => null;

const TranslationContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch
});

function TranslationProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, dispatch] = React.useReducer(translationReducer, initialData);

  return <TranslationContext.Provider value={{ state, dispatch }}>{children}</TranslationContext.Provider>;
}

const useTranslationState = (): TranslationState => {
  const context = React.useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationState must be used within a TranslationProvider');
  }
  return context.state;
};

const useTranslationDispatch = (): TranslationDispatch => {
  const context = React.useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslationDispatch must be used within a TranslationProvider');
  }
  return context.dispatch;
};

const actions = {
  setFilter:
    (params: TranslationFilter) =>
    async (dispatch: TranslationDispatch): Promise<void> => {
      localStorage.setItem('translationFilterVals', JSON.stringify(params));

      await dispatch({
        type: 'TRANSLATIONS_SET_FILTERS',
        payload: { ...params }
      });
    },

  ...genericActions<TranslationsDto, TranslationDispatch>('/translations', 'id'),
  doUpdateChecked:
    (ids: number[], values: Omit<Omit<TranslationsCheckedDto, 'ids'>, 'accountId'>) =>
    async (dispatch: TranslationDispatch, notify: (message: string) => void, fetchAll?: () => void): Promise<void> => {
      await dispatch({
        type: 'FORM_UPDATE_STARTED'
      });

      await axios
        .put(`/translations/checked`, {
          ids,
          ...values
        })
        .then((response) => {
          dispatch({
            type: 'FORM_UPDATE_SUCCESS',
            payload: values
          });
          notify('Saved');
          if (fetchAll) fetchAll();
        })
        .catch((error) => {
          console.log('error', error);
          notify(error.response.data?.message);
          dispatch({
            type: 'FORM_UPDATE_ERROR',
            payload: error.response.data?.message
          });
        });
    },
  doFetchBackups:
    () =>
    async (dispatch: TranslationDispatch): Promise<void> => {
      try {
        await dispatch({
          type: 'TRANSLATIONS_FIND_BACKUPS_STARTED'
        });

        await axios.get(`/translations/backups`).then((res) => {
          const payload = res.data;
          dispatch({
            type: 'TRANSLATIONS_FIND_BACKUPS_SUCCESS',
            payload
          });
        });
      } catch (error) {
        // toast("Error");
        console.log(error);
        await dispatch({
          type: 'TRANSLATIONS_FIND_BACKUPS_SUCCESS'
        });
      }
    },
  doRestoreBackup:
    (value: string, navigate: NavigateFunction) =>
    async (notify: (message?: string) => void): Promise<void> => {
      await axios
        .put(`/translations/restorebackup`, value)
        .then((response) => {
          if (response.data === 'ok') {
            notify();
            navigate('/translation/list');
          } else {
            console.log('not ok ', response.data);
          }
        })
        .catch((error) => {
          console.log('error', error);
          notify(error.response.data?.message);
        });
    }
};

export { TranslationProvider, useTranslationState, useTranslationDispatch, actions };
