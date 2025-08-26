import React from "react";
import { useParams } from "react-router";

import { Grid2 } from "@mui/material";

import {
  useServiceDispatch,
  useServiceState,
  actions,
} from "../../context/ServiceContext";
import MetricsChart, {
  avgValueProcessor,
  countValueProcessor,
} from "./MetricsChart";
import useInterval from "../../hooks/useInterval";

const MetricsService = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useServiceDispatch();
  const { metrics } = useServiceState();

  useInterval(
    () => {
      if (id) {
        actions.doMetrics(Number(id))(dispatch);
      }
    },
    true,
    5000
  );

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={6}>
        <MetricsChart
          title="Количество запросов DBData"
          metric={(metrics || []).find(
            (it) => it.name === "dbdata_request_duration"
          )}
          valueProcessor={countValueProcessor}
        />
      </Grid2>
      <Grid2 size={6}>
        <MetricsChart
          title="Среднее время запроса DBData"
          metric={(metrics || []).find(
            (it) => it.name === "dbdata_request_duration"
          )}
          valueProcessor={avgValueProcessor}
        />
      </Grid2>
      <Grid2 size={6}>
        <MetricsChart
          title="Количество запросов HL7"
          metric={(metrics || []).find(
            (it) => it.name === "hl7_request_duration"
          )}
          valueProcessor={countValueProcessor}
        />
      </Grid2>
      <Grid2 size={6}>
        <MetricsChart
          title="Среднее время запроса HL7"
          metric={(metrics || []).find(
            (it) => it.name === "hl7_request_duration"
          )}
          valueProcessor={avgValueProcessor}
        />
      </Grid2>
      <Grid2 size={6}>
        <MetricsChart
          metric={(metrics || []).find(
            (it) => it.name === "dbdata_active_requests_count"
          )}
          valueProcessor={countValueProcessor}
        />
      </Grid2>
    </Grid2>
  );
};
export default MetricsService;
