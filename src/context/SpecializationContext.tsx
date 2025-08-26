import React from "react";
import axios from "axios";
import { MedicalNetDto, SpecializationDto } from "../helpers/dto";
import {
  doGenericReferenceLists,
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

interface SpecializationState extends GenericState<SpecializationDto> {
  medicalNets: MedicalNetDto[];
}

const initialData: SpecializationState = {
  ...initialState(),
  medicalNets: [],
};

type Action = GenericAction<GenericActionType>;

const specializationReducer = (
  state = initialData,
  { type, payload }: Action
): SpecializationState => genericReducer(state, { type, payload });

type SpecializationDispatch = React.Dispatch<Action>;
const emptyDispatch: SpecializationDispatch = () => null;

const SpecializationContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

function SpecializationProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [state, dispatch] = React.useReducer(
    specializationReducer,
    initialData
  );

  return (
    <SpecializationContext.Provider value={{ state, dispatch }}>
      {children}
    </SpecializationContext.Provider>
  );
}

const useSpecializationState = (): SpecializationState => {
  const context = React.useContext(SpecializationContext);
  if (context === undefined) {
    throw new Error(
      "useSpecializationState must be used within a SpecializationProvider"
    );
  }
  return context.state;
};

const useSpecializationDispatch = (): SpecializationDispatch => {
  const context = React.useContext(SpecializationContext);
  if (context === undefined) {
    throw new Error(
      "useSpecializationDispatch must be used within a SpecializationProvider"
    );
  }
  return context.dispatch;
};

const actions = {
  ...genericActions<SpecializationDto, SpecializationDispatch>(
    "/specialization",
    "specializationId"
  ),

  doReferenceLists: doGenericReferenceLists({
    medicalNets: "/medicalNet",
  }),

  doSetSortOrder:
    (
      id: number,
      sortOrder: number | undefined,
      medicalNetId: number | undefined
    ) =>
    async (dispatch: SpecializationDispatch): Promise<void> => {
      dispatch({
        type: "FORM_UPDATE_STARTED",
      });
      await axios
        .put(`/specialization/order/${id}`, { sortOrder, medicalNetId })
        .then(() => {
          dispatch({
            type: "FORM_UPDATE_SUCCESS",
          });
        })
        .catch((error) => {
          dispatch({
            type: "FORM_UPDATE_ERROR",
            payload: error.errorMessage,
          });
        });
    },
};

export {
  SpecializationProvider,
  useSpecializationState,
  useSpecializationDispatch,
  actions,
};
