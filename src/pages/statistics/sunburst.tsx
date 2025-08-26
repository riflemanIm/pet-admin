import React from "react";
import ReactECharts from "echarts-for-react";

export interface SunburstValueItem {
  value?: number;
  name: string;
  children?: SunburstValueItem[];
}

interface SunburstProps {
  title: string;
  serieName?: string;
  data: SunburstValueItem[];
  style?: React.CSSProperties;
}

export const Sunburst = ({
  title,
  serieName,
  data,
  style,
}: SunburstProps): JSX.Element => {
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
        emphasis: {
          focus: "ancestor",
        },
        series: [
          {
            name: serieName,
            type: "sunburst",
            radius: ["0%", "95%"],
            label: {
              rotate: "radial",
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

export default Sunburst;
