import React from "react";
import axios from "axios";
import { MedicalNetDto, MedicalNetLicenseData } from "../helpers/dto";
import {
  GenericAction,
  genericActions,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

export type MedicalNetState = GenericState<MedicalNetDto>;

const initialData: MedicalNetState = initialState();

type Action = GenericAction<GenericActionType>;

const MedicalNetReducer = (
  state = initialData,
  { type, payload }: Action
): MedicalNetState => genericReducer(state, { type, payload });

type MedicalNetDispatch = React.Dispatch<Action>;
const emptyDispatch: MedicalNetDispatch = () => null;

const MedicalNetContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const MedicalNetProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(MedicalNetReducer, initialData);

  return (
    <MedicalNetContext.Provider value={{ state, dispatch }}>
      {children}
    </MedicalNetContext.Provider>
  );
};

const useMedicalNetState = (): MedicalNetState => {
  const context = React.useContext(MedicalNetContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalNetState must be used within a MedicalNetProvider"
    );
  }
  return context.state;
};

const useMedicalNetDispatch = (): MedicalNetDispatch => {
  const context = React.useContext(MedicalNetContext);
  if (context === undefined) {
    throw new Error(
      "useMedicalNetDispatch must be used within a MedicalNetProvider"
    );
  }
  return context.dispatch;
};

const actions = {
  ...genericActions<MedicalNetDto, MedicalNetDispatch>(
    "/medicalNet",
    "medicalNetId"
  ),

  getLicenseData: async (
    medicalNetId: number
  ): Promise<MedicalNetLicenseData> => {
    try {
      const { data } = await axios.get(
        `/medicalNet/${medicalNetId}/licenseData`
      );

      return data as MedicalNetLicenseData;
    } catch (error) {
      console.error((error as any).response.data?.message);
      return {
        limits: [],
        features: [],
      };
    }
  },
};

export {
  MedicalNetProvider,
  useMedicalNetState,
  useMedicalNetDispatch,
  actions,
};
