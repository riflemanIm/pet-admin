import React from 'react';
import axios from 'axios';
import {
  ChatIdentifiersDto,
  ChatUserDto,
  ConfirmationCodeDto,
  EmrRecordDto,
  ListDto,
  MedicalNetDto,
  MergeInfoDto,
  NotificationDto,
  OrderDirection,
  SpamDto,
  TokenResponseDto,
  UserDto,
  UserNotificationSettingDto,
  UserReportDto,
  VisitRecordDto
} from '../helpers/dto';
import { doGenericReferenceLists, genericActions, GenericActionType, genericReducer, GenericState, initialState } from '../helpers/state';
import { NavigateFunction } from 'react-router-dom';

interface UserState extends GenericState<UserDto> {
  medicalNets: MedicalNetDto[];
  report?: UserReportDto;
}

const initialData: UserState = {
  ...initialState(),
  medicalNets: [],
  report: undefined
};

interface Action {
  type: GenericActionType;
  payload?: any;
}

const managementReducer = (state = initialData, { type, payload }: Action): UserState => genericReducer(state, { type, payload });

type ManagementDispatch = React.Dispatch<Action>;
const emptyDispatch: ManagementDispatch = () => null;

const ManagementContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch
});

const ManagementProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [state, dispatch] = React.useReducer(managementReducer, initialData);

  return <ManagementContext.Provider value={{ state, dispatch }}>{children}</ManagementContext.Provider>;
};

const useManagementState = (): UserState => {
  const context = React.useContext(ManagementContext);
  if (context === undefined) {
    throw new Error('useManagementState must be used within a ManagementProvider');
  }
  return context.state;
};

const useManagementDispatch = (): ManagementDispatch => {
  const context = React.useContext(ManagementContext);
  if (context === undefined) {
    throw new Error('useManagementDispatch must be used within a ManagementProvider');
  }
  return context.dispatch;
};

const actions = {
  ...genericActions<UserDto, ManagementDispatch>('/user', 'userId'),

  doChangePassword:
    (id: number, password: string, notify: (message?: string) => void) =>
    async (dispatch: ManagementDispatch, navigate: NavigateFunction): Promise<void> => {
      try {
        const { data }: { data: number } = await axios.put(`/user/password/${id}`, {
          password
        });
        console.log('password-update', data);
        if (data === 1) notify('Пароль изменен');
        navigate('/user/list');
      } catch (error) {
        dispatch({
          type: 'FORM_CREATE_ERROR'
        });
      }
    },

  doActivate:
    (id: number, notify: (message?: string) => void) =>
    async (dispatch: ManagementDispatch): Promise<void> => {
      try {
        await axios.put(`/user/activate/${id}`, {});
        dispatch({ type: 'LIST_REFRESH' });
        notify('Пользователь активирован');
      } catch (error) {
        dispatch({
          type: 'FORM_CREATE_ERROR'
        });
      }
    },

  doReferenceLists: doGenericReferenceLists({
    medicalNets: '/medicalNet'
  }),

  doReport:
    (dateFrom?: Date, dateTo?: Date, medicalNetId?: number) =>
    async (dispatch: ManagementDispatch): Promise<void> => {
      try {
        dispatch({
          type: 'FORM_FIND_STARTED'
        });
        const { data } = await axios.get(`/statistics`, {
          params: {
            dateFrom,
            dateTo,
            medicalNetId
          }
        });

        const report: UserReportDto = {
          ...data,
          condition: {
            ...data.condition,
            dateFrom: data.condition.dateFrom ? new Date(data.condition.dateFrom) : undefined,
            dateTo: data.condition.dateTo ? new Date(data.condition.dateTo) : undefined,
            medicalNetId: data.condition.medicalNetId
          }
        };

        dispatch({
          type: 'FORM_FIND_SUCCESS',
          payload: {
            report
          }
        });
      } catch (error) {
        dispatch({
          type: 'FORM_FIND_ERROR',
          payload: (error as any).response.data?.message
        });
      }
    },

  doIssueSupportToken: async (userId: number, medicalNetId: number): Promise<string> => {
    try {
      const { data } = await axios.post('/auth/issueSupportToken', {
        userId,
        medicalNetId
      });

      return (data as TokenResponseDto).authToken;
    } catch (error) {
      console.error((error as any).response.data?.message);
      return '';
    }
  },

  getSpam: async (userId: number): Promise<SpamDto[]> => {
    try {
      const { data } = await axios.get(`/user/spam/${userId}`);

      return data as SpamDto[];
    } catch (error) {
      console.error((error as any).response.data?.message);
      return [];
    }
  },

  getEmrRecords: async (userId: number): Promise<EmrRecordDto[]> => {
    try {
      const { data } = await axios.get(`/user/emrHeaders/${userId}`);

      return data as EmrRecordDto[];
    } catch (error) {
      console.error((error as any).response.data?.message);
      return [];
    }
  },

  getConfirmationCodes: async (userId: number): Promise<ConfirmationCodeDto[]> => {
    try {
      const { data } = await axios.get(`/confirmationCode/user/${userId}/records`);

      return (data as ListDto<ConfirmationCodeDto>).rows;
    } catch (error) {
      console.error((error as any).response.data?.message);
      return [];
    }
  },

  getNotificationSettings: async (userId: number): Promise<UserNotificationSettingDto[]> => {
    try {
      const { data } = await axios.get(`/user/notificationSettings/${userId}`);

      return (data as ListDto<UserNotificationSettingDto>).rows;
    } catch (error) {
      console.error((error as any).response.data?.message);
      return [];
    }
  },

  getMergeInfo: async (sourceId: number, targetId: number): Promise<MergeInfoDto> => {
    try {
      const { data } = await axios.get(`/user/mergeInfo/${sourceId}/${targetId}`);

      return data as MergeInfoDto;
    } catch (error) {
      console.error((error as any).response.data?.message);
      return {};
    }
  },

  doMerge: async (sourceId: number, targetId: number, copyFields: string[]): Promise<string> => {
    try {
      await axios.post('/user/merge', {
        sourceId,
        targetId,
        copyFields
      });
      return '';
    } catch (error) {
      return (error as any).response.data?.message;
    }
  },

  deleteEmrRecord: async (userId: number, id: number): Promise<boolean> => {
    try {
      await axios.delete(`/user/emrHeaders/${userId}/${id}`);
      return true;
    } catch (error) {
      console.error((error as any).response.data?.message);
      return false;
    }
  },

  getVisitRecords: async (userId: number): Promise<VisitRecordDto[]> => {
    try {
      const { data } = await axios.get(`/user/visits/${userId}`);

      return data as VisitRecordDto[];
    } catch (error) {
      console.error((error as any).response.data?.message);
      return [];
    }
  },

  setVisitOutsidePlanning: async (visitId: number, isOutsidePlanning: boolean): Promise<boolean> => {
    try {
      await axios.put(`/user/visits/isOutsidePlanning/${visitId}`, {
        isOutsidePlanning
      });
      return true;
    } catch (error) {
      console.error((error as any).response.data?.message);
      return false;
    }
  },

  deleteSpam: async (userId: number): Promise<boolean> => {
    try {
      await axios.delete(`/user/spam/${userId}`);
      return true;
    } catch (error) {
      console.error((error as any).response.data?.message);
      return false;
    }
  },
  getChatUserInfo: async (chatUserId: number) => {
    const res = await axios.get(`/user/chat/${chatUserId}`);
    return res.data as ChatUserDto;
  },

  getChatIdentifiers: async (userId: number) => {
    const res = await axios.get(`/user/chat/identifiers/${userId}`);
    return res.data as ChatIdentifiersDto;
  },

  getNotificationList: async (
    userId: number,
    useLog = true,
    startIndex = 0,
    count = 50,
    filter: string | null = null,
    orderBy: string | null = null,
    order: OrderDirection = 'asc'
  ) => {
    const res = await axios.get(`/user/notifications/${userId}`, {
      params: {
        useLog,
        startIndex,
        count,
        filter,
        orderBy,
        order
      }
    });
    return res.data as ListDto<NotificationDto>;
  }
};

export { ManagementProvider, useManagementState, useManagementDispatch, actions };
