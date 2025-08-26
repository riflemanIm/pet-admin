import React from "react";
import axios, { AxiosError } from "axios";
import { jwtDecode, JwtPayload } from "jwt-decode";

//config
import {
  LoginResponseDto,
  MedicalNetSettingsInfoDto,
  RefreshTokenDto,
  TokenData,
  UserInfoDto,
} from "../helpers/dto";
import { NavigateFunction } from "react-router-dom";
import { AccountRole } from "../helpers/enums";
import { getBase64 } from "../helpers/base64";
import config from "../config";

type UserAction =
  | "LOGIN_SUCCESS"
  | "REFRESH_TOKEN_SUCCESS"
  | "REGISTER_REQUEST"
  | "RESET_REQUEST"
  | "PASSWORD_RESET_EMAIL_REQUEST"
  | "SIGN_OUT_SUCCESS"
  | "AUTH_INIT_ERROR"
  | "REGISTER_SUCCESS"
  | "RESET_SUCCESS"
  | "PASSWORD_RESET_EMAIL_SUCCESS"
  | "AUTH_FAILURE"
  | "SET_LANGUAGE";

interface Action {
  type: UserAction;
  payload?: any;
}

interface UserState {
  isFetching: boolean;
  errorMessage: string;
  token: string | null;
  refreshToken: string | null;
  currentUser: TokenData;
  userInfo: UserInfoDto | null;
  userPhoto: string;
  features: string[];
  loadingInit: boolean;
  isAuthenticated: boolean;
  language: string;
}

const unknownUser: TokenData = { role: AccountRole.unknown, medicalNetId: 0 };

const initialData: UserState = {
  isFetching: false,
  errorMessage: "",
  token: null,
  refreshToken: null,
  currentUser: unknownUser,
  userInfo: null,
  userPhoto: "",
  features: [],
  loadingInit: false,
  isAuthenticated: false,
  language: config.defLang,
};

const userReducer = (state: UserState, action: Action): UserState => {
  switch (action.type) {
    case "SET_LANGUAGE":
      localStorage.setItem("lang", action.payload);
      return {
        ...state,
        language: action.payload,
      };
    case "LOGIN_SUCCESS":
      localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
      localStorage.setItem("userPhoto", action.payload.userPhoto);
      localStorage.setItem("features", JSON.stringify(action.payload.features));
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    case "REFRESH_TOKEN_SUCCESS":
      return {
        ...state,
        ...action.payload,
      };
    case "REGISTER_REQUEST":
    case "RESET_REQUEST":
    case "PASSWORD_RESET_EMAIL_REQUEST":
      return {
        ...state,
        isFetching: true,
        errorMessage: "",
      };
    case "SIGN_OUT_SUCCESS":
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userPhoto");
      localStorage.removeItem("features");
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        currentUser: unknownUser,
        userInfo: null,
        userPhoto: "",
        features: [],
      };
    case "AUTH_INIT_ERROR":
      return {
        ...state,
        currentUser: unknownUser,
        loadingInit: false,
      };
    case "REGISTER_SUCCESS":
    case "RESET_SUCCESS":
    case "PASSWORD_RESET_EMAIL_SUCCESS":
      return { ...state, isFetching: false, errorMessage: "" };
    case "AUTH_FAILURE":
      return { ...state, isFetching: false, errorMessage: action.payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

type UserDispatch = React.Dispatch<Action>;
const emptyDispatch: UserDispatch = () => null;

const UserContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const storedUser = localStorage.getItem("user");
  const storedInfo = localStorage.getItem("userInfo");
  const storedFeatures = localStorage.getItem("features");
  const currentUser = storedUser != null ? JSON.parse(storedUser) : null;

  const auth = () => {
    const token = localStorage.getItem("refreshToken");
    if (token && currentUser != null && currentUser.role >= 4) {
      const date = new Date().getTime() / 1000;
      const data = jwtDecode(token);

      if (!data) return false;
      return date < ((data as JwtPayload).exp as number);
    }
    return false;
  };
  const isAuthenticated = auth();

  const initialState = {
    ...initialData,
    isAuthenticated,
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    currentUser,
    userInfo: storedInfo ? JSON.parse(storedInfo) : null,
    userPhoto: localStorage.getItem("userPhoto") || "",
    features: storedFeatures ? JSON.parse(storedFeatures) : [],
    language: localStorage.getItem("lang") || config.defLang,
  };
  const [state, dispatch] = React.useReducer(userReducer, initialState);

  setInterceptor(dispatch);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

const useUserState = (): UserState => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context.state;
};

const useUserDispatch = (): UserDispatch => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context.dispatch;
};

// ###########################################################

const langToLangCode = (lang: string): string => {
  switch (lang) {
    case "ru":
      return "rus";
    case "fr":
      return "fra";
    case "en":
      return "eng";
  }
  return "";
};

const setLicense =
  (license: string, notify: (message?: string) => void) =>
  async (dispatch: UserDispatch, navigate: NavigateFunction): Promise<void> => {
    /** todo */
    await axios
      .put(`/auth/license`, { license })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        notify(error.response.data?.message);
      });
  };

async function loginUser(
  dispatch: UserDispatch,
  login: string,
  password: string,
  setIsLoading: (isLoading: boolean) => void,
  setError: (errorMessage: string) => void,
  navigate: NavigateFunction
): Promise<void> {
  setError("");
  setIsLoading(true);

  if (login.length > 0 && password.length > 0) {
    try {
      const { data: loginData } = await axios.post("/auth/login", {
        login,
        password,
      });
      const loginResponse = loginData as never as LoginResponseDto;
      const { token, refreshToken, user } = receiveToken(loginResponse);
      const { data: features }: { data: string[] } = await axios.get(
        "/auth/features"
      );
      const { data: info }: { data: UserInfoDto } = await axios.get(
        "/user/info"
      );
      let photo = "";
      if (info.photoUrl) {
        try {
          const data = await axios.get("/user/photo", { responseType: "blob" });
          photo = await getBase64(data.data);
        } catch {
          // nothing here
        }
      }
      setIsLoading(false);

      if (user.role >= 4) {
        setError("");
        doInit(token, refreshToken, user, info, photo, features)(dispatch);
      } else {
        setError("Некорректная роль пользователя");
      }
    } catch (err) {
      setIsLoading(false);
      if (err instanceof AxiosError) {
        if (
          err.response?.status === 422 &&
          err.response?.data?.code === "INVALID_LICENSE"
        ) {
          navigate("/license");
        }
      }
      setError((err as any).response?.data?.message || "Ошибка сервера");
    }
  } else {
    dispatch({ type: "AUTH_FAILURE", payload: "Не заполнены имя или пароль" });
  }
}

async function signOut(
  dispatch: UserDispatch,
  navigate: NavigateFunction
): Promise<void> {
  try {
    await axios.post("/auth/logout");
  } catch (err) {
    console.error(err);
  }
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  dispatch({
    type: "SIGN_OUT_SUCCESS",
  });
  navigate("/login");
}

async function refreshToken(dispatch: UserDispatch, rToken: string) {
  try {
    const { data: loginData } = await axios.post("/auth/refreshToken", {
      refreshToken: rToken,
    });
    const loginResponse = loginData as never as RefreshTokenDto;
    const { token, refreshToken, user } = receiveToken(loginResponse);
    dispatch({
      type: "REFRESH_TOKEN_SUCCESS",
      payload: {
        token,
        refreshToken,
        currentUser: user,
      },
    });
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.reload();
  }
}

function setInterceptor(dispatch: UserDispatch) {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      const language = localStorage.getItem("lang");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      if (language) {
        config.headers["lang-code"] = langToLangCode(language);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalConfig = error.config;
      const rToken = localStorage.getItem("refreshToken");
      if (
        error.response?.status === 401 &&
        !originalConfig._retry &&
        rToken &&
        !(originalConfig.url || "").endsWith("/auth/refreshToken")
      ) {
        originalConfig._retry = true;
        try {
          await refreshToken(dispatch, rToken);
          return axios(originalConfig);
        } catch (err: any) {
          if (err.response && err.response.data) {
            return Promise.reject(err.response.data);
          }

          return Promise.reject(err);
        }
      } else {
        return Promise.reject(error);
      }
    }
  );
}

function receiveToken(data: LoginResponseDto | RefreshTokenDto): {
  token: string;
  refreshToken: string;
  user: TokenData;
} {
  const { authToken, refreshToken } = data;
  const user = jwtDecode(authToken) as TokenData;
  localStorage.setItem("theme", "default");
  localStorage.setItem("token", authToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));

  return { token: authToken, refreshToken, user };
}

function doInit(
  token: string,
  refreshToken: string,
  currentUser: TokenData,
  userInfo: UserInfoDto,
  userPhoto: string,
  features: string[]
) {
  return async (dispatch: UserDispatch): Promise<void> => {
    try {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token,
          refreshToken,
          currentUser,
          userInfo,
          userPhoto,
          features,
        },
      });
    } catch (error) {
      dispatch({
        type: "AUTH_INIT_ERROR",
        payload: error,
      });
    }
  };
}

function setLanguage(dispatch: UserDispatch, language: string) {
  dispatch({
    type: "SET_LANGUAGE",
    payload: language,
  });
}

const getMedicalNetSettingsInfo = async (medicalNetId: number) => {
  const res = await axios.get("/medicalNetSetting/info", {
    params: { medicalNetId },
  });
  return res.data as MedicalNetSettingsInfoDto;
};

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  loginUser,
  signOut,
  setLanguage,
  setLicense,
  getMedicalNetSettingsInfo,
};
