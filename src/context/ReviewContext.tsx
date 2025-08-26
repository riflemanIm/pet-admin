import React from "react";
import axios from "axios";
import {
  DoctorReviewDto,
  EmrReviewDto,
  GenericReviewDto,
  ListDto,
} from "../helpers/dto";
import {
  GenericAction,
  GenericActionType,
  genericReducer,
  GenericState,
  initialState,
} from "../helpers/state";

const listDoctorReviews = async (
  startIndex: number | null,
  count: number | null
) => {
  const response = await axios.get(`/review/doctor`, {
    params: {
      startIndex,
      count,
    },
  });
  return response.data as ListDto<DoctorReviewDto>;
};

const listEmrReviews = async (
  startIndex: number | null,
  count: number | null
) => {
  const response = await axios.get(`/review/emr`, {
    params: {
      startIndex,
      count,
    },
  });
  return response.data as ListDto<EmrReviewDto>;
};

type ReviewState = GenericState<GenericReviewDto>;

const initialData: ReviewState = initialState();

type Action = GenericAction<GenericActionType>;

const reducer = (state = initialData, { type, payload }: Action): ReviewState =>
  genericReducer(state, { type, payload });

type ReviewDispatch = React.Dispatch<Action>;
const emptyDispatch: ReviewDispatch = () => null;

const ReviewContext = React.createContext({
  state: initialData,
  dispatch: emptyDispatch,
});

const ReviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = React.useReducer(reducer, initialData);

  return (
    <ReviewContext.Provider value={{ state, dispatch }}>
      {children}
    </ReviewContext.Provider>
  );
};

const useReviewState = (): ReviewState => {
  const context = React.useContext(ReviewContext);
  if (context === undefined) {
    throw new Error("useReviewState must be used within a ReviewProvider");
  }
  return context.state;
};

const useReviewDispatch = (): ReviewDispatch => {
  const context = React.useContext(ReviewContext);
  if (context === undefined) {
    throw new Error("useReviewDispatch must be used within a ReviewProvider");
  }
  return context.dispatch;
};

const actions = {
  doFetchDoctorReviews:
    (startIndex = 0, count = 50) =>
    async (dispatch: ReviewDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_FETCH_STARTED",
        });

        const response = await listDoctorReviews(startIndex, count);

        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response,
        });
      } catch (error) {
        console.log(error);

        dispatch({
          type: "LIST_FETCH_ERROR",
        });
      }
    },

  doFetchEmrReviews:
    (startIndex = 0, count = 50) =>
    async (dispatch: ReviewDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_FETCH_STARTED",
        });

        const response = await listEmrReviews(startIndex, count);

        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response,
        });
      } catch (error) {
        console.log(error);

        dispatch({
          type: "LIST_FETCH_ERROR",
        });
      }
    },

  doApprove:
    (id: number, startIndex = 0, count = 50) =>
    async (dispatch: ReviewDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_DELETE_STARTED",
        });

        await axios.put(`/review/doctor/${id}`);

        dispatch({
          type: "LIST_DELETE_SUCCESS",
        });
        const response = await listDoctorReviews(startIndex, count);
        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response,
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "LIST_DELETE_ERROR",
        });
      }
    },

  doDelete:
    (id: number, startIndex = 0, count = 50) =>
    async (dispatch: ReviewDispatch): Promise<void> => {
      try {
        dispatch({
          type: "LIST_DELETE_STARTED",
        });

        await axios.delete(`/review/doctor/${id}`);

        dispatch({
          type: "LIST_DELETE_SUCCESS",
        });
        const response = await listDoctorReviews(startIndex, count);
        dispatch({
          type: "LIST_FETCH_SUCCESS",
          payload: response,
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "LIST_DELETE_ERROR",
        });
      }
    },
};

export { ReviewProvider, useReviewState, useReviewDispatch, actions };
