import React from "react";
import ReactECharts from "echarts-for-react";
import { useTranslation } from "react-i18next";

export interface DoughnutValueItem {
  value: number;
  name: string;
}

interface DoughnutProps {
  title: string;
  serieName: string;
  data: DoughnutValueItem[];
  style?: React.CSSProperties;
}

export const Doughnut = ({
  title,
  serieName,
  data,
  style,
}: DoughnutProps): JSX.Element => {
  const { t } = useTranslation();
  const total = data.reduce((prev, current) => prev + current.value, 0);
  return (
    <ReactECharts
      option={{
        title: {
          text: title,
          subtext: "",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: serieName,
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: "center",
              fontSize: "20",
              fontWeight: "bold",
              formatter: () => {
                return `${t("REPORT.TOTAL")} ${total}`;
              },
            },
            labelLine: {
              show: false,
            },
            data,
          },
        ],
      }}
      lazyUpdate={true}
      style={style}
    />
  );
};

export default Doughnut;
