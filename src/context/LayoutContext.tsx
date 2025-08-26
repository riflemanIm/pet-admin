import React from "react";
import axios from "axios";
import { HealthDto } from "../helpers/dto";

type LayoutType = "TOGGLE_SIDEBAR" | "SET_VERSION";

interface Action {
  type: LayoutType;
  version?: string;
}

interface LayoutState {
  isSidebarOpened: boolean;
  version: string;
}

const initialData: LayoutState = {
  isSidebarOpened: true,
  version: "",
};

function layoutReducer(state: LayoutState, payload: Action): LayoutState {
  // console.log("dispatch", type);
  switch (payload.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpened: !state.isSidebarOpened };
    case "SET_VERSION":
      return { ...state, version: payload.version || "" };
    default: {
      return { ...state };
    }
  }
}

type LayoutDispatch = React.Dispatch<Action>;
const emptyDispatch: LayoutDispatch = () => null;

const LayoutContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const LayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(layoutReducer, initialData);

  return (
    <LayoutContext.Provider value={{ state, dispatch }}>
      {children}
    </LayoutContext.Provider>
  );
};

const useLayoutState = (): LayoutState => {
  const context = React.useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayoutState must be used within a LayoutProvider");
  }
  return context.state;
};

const useLayoutDispatch = (): LayoutDispatch => {
  const context = React.useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayoutDispatch must be used within a LayoutProvider");
  }
  return context.dispatch;
};

const toggleSidebar = (dispatch: LayoutDispatch): void => {
  dispatch({
    type: "TOGGLE_SIDEBAR",
  });
};

const requestVerion = async (dispatch: LayoutDispatch): Promise<void> => {
  try {
    const result = await axios.get<HealthDto>("/health");
    dispatch({
      type: "SET_VERSION",
      version: result.data.version
    });
  } catch {
    dispatch({
      type: "SET_VERSION",
      version: "not available",
    });
  }
};

export {
  LayoutProvider,
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
  requestVerion,
  LayoutContext,
};
