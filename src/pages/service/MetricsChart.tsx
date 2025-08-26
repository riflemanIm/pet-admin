import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { ServiceMetric, ServiceMetricValue } from "../../helpers/dto";

type ValueProcessor = (value: ServiceMetricValue) => number;

interface MetricsChartProps {
  title?: string;
  metric?: ServiceMetric;
  valueProcessor: ValueProcessor;
}

interface ChartData {
  labels: string[];
  series: {
    name: string;
    type: "bar";
    data: number[];
  }[];
}

const getData = (
  metric: ServiceMetric,
  valueProcessor: ValueProcessor
): ChartData => {
  return {
    labels: metric.labels || [],
    series: metric.datasets.map((it) => ({
      name: it.name,
      type: "bar",
      data: it.values.map(valueProcessor),
    })),
  };
};

const emptyData = {
  labels: [],
  series: [],
};

const MetricsChart = ({ title, metric, valueProcessor }: MetricsChartProps) => {
  const [data, setData] = useState<ChartData>(emptyData);

  useEffect(() => {
    setData(metric ? getData(metric, valueProcessor) : emptyData);
  }, [metric, valueProcessor]);

  return (
    <div>
      <ReactECharts
        lazyUpdate={true}
        option={{
          title: {
            left: "center",
            text: title,
          },
          legend: {
            top: "5%",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "5%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: data.labels,
          },
          yAxis: {
            type: "value",
          },
          series: data.series,
        }}
      />
    </div>
  );
};

export const countValueProcessor = (value: ServiceMetricValue): number =>
  value.count;
export const avgValueProcessor = (value: ServiceMetricValue): number =>
  value.count ? (value.sum || 0) / value.count : 0;

export default MetricsChart;
