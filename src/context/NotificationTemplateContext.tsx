import React from "react";
import {
  HelpDto,
  MedicalNetDto,
  NotificationTemplateDto,
} from "../helpers/dto";
import {
  doGenericReferenceLists,
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

interface NotificationTemplateState
  extends GenericState<NotificationTemplateDto> {
  medicalNets: MedicalNetDto[];
  help: HelpDto[];
}

const initialData: NotificationTemplateState = {
  ...initialState(),
  medicalNets: [],
  help: [],
};

type Action = GenericAction<GenericActionType>;

const reducer = (
  state = initialData,
  { type, payload }: Action
): NotificationTemplateState => genericReducer(state, { type, payload });

type NotificationTemplateDispatch = React.Dispatch<Action>;
const emptyDispatch: NotificationTemplateDispatch = () => null;

const NotificationTemplateContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const NotificationTemplateProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <NotificationTemplateContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationTemplateContext.Provider>
  );
};

const useNotificationTemplateState = (): NotificationTemplateState => {
  const context = React.useContext(NotificationTemplateContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationTemplate must be used within a NotificationTemplateProvider"
    );
  }
  return context.state;
};

const useNotificationTemplateDispatch = (): NotificationTemplateDispatch => {
  const context = React.useContext(NotificationTemplateContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationTemplateDispatch must be used within a NotificationTemplateProvider"
    );
  }
  return context.dispatch;
};

const actions = {
  doReferenceLists: doGenericReferenceLists({
    medicalNets: "/medicalNet",
    help: "/notificationTemplate/help",
  }),

  ...genericActions<NotificationTemplateDto, NotificationTemplateDispatch>(
    "/notificationTemplate",
    "ntfTemplateClinicId"
  ),
};

export {
  NotificationTemplateProvider,
  useNotificationTemplateState,
  useNotificationTemplateDispatch,
  actions,
};
