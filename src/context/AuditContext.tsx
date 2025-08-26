import React from "react";
import axios from "axios";
import {
  ListDto,
  AuditItemDto,
  OrderDirection,
  MedicalNetDto,
} from "../helpers/dto";
import {
  doGenericReferenceLists,
  GenericAction,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

interface AuditState extends GenericState<AuditItemDto> {
  medicalNets: MedicalNetDto[];
}

const initialData: AuditState = {
  ...initialState(),
  medicalNets: [],
};

type Action = GenericAction<GenericActionType>;

const reducer = (state = initialData, { type, payload }: Action): AuditState =>
  genericReducer(state, { type, payload });

type AuditDispatch = React.Dispatch<Action>;
const emptyDispatch: AuditDispatch = () => null;

const AuditContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const AuditProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <AuditContext.Provider value={{ state, dispatch }}>
      {children}
    </AuditContext.Provider>
  );
};

const useAuditState = (): AuditState => {
  const context = React.useContext(AuditContext);
  if (context === undefined) {
    throw new Error("useAuditState must be used within a AuditProvider");
  }
  return context.state;
};

const useAuditDispatch = (): AuditDispatch => {
  const context = React.useContext(AuditContext);
  if (context === undefined) {
    throw new Error("useAuditDispatch must be used within a AuditProvider");
  }
  return context.dispatch;
};

const actions = {
  doFetch:
    (
      dateFrom: Date,
      dateTo: Date,
      medicalNetId?: number,
      eventType?: string,
      serviceName?: string,
      success?: boolean,
      startIndex = 0,
      count = 50,
      orderBy: string | null = null,
      order: OrderDirection = "asc"
    ) =>
    async (dispatch: AuditDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_FETCH_STARTED",
        });

        const response = await axios.get(`/audit`, {
          params: {
            dateFrom,
            dateTo,
            medicalNetId,
            eventType,
            serviceName,
            success,
            startIndex,
            count,
            orderBy,
            order,
          },
        });

        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response.data as ListDto<AuditItemDto>,
        });
      } catch (error) {
        dispatch({
          type: "LIST_FETCH_ERROR",
          payload: (error as any).response.data?.message,
        });
      }
    },

  doReferenceLists: doGenericReferenceLists({
    medicalNets: "/medicalNet",
  }),
};

export { AuditProvider, useAuditState, useAuditDispatch, actions };
