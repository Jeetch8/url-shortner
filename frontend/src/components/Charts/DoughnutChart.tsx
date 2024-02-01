interface Props {
  data: { label: string[]; data: string[] };
  title: string;
}

import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart, Tooltip } from "chart.js";
import { generateRandomColor } from "../../utils/color_generator";

Chart.register(ArcElement, Tooltip);

const DoughnutChart = ({ data, title }: Props) => {
  return (
    <Doughnut
      options={{
        plugins: {
          tooltip: {
            enabled: true,
            // external: false,
          },
        },
        elements: {
          arc: { borderWidth: 0 },
        },
      }}
      data={{
        labels: data?.label,
        datasets: [
          {
            label: title,
            data: data?.data,
            backgroundColor: generateRandomColor(data?.label?.length),
            borderWidth: 1,
          },
        ],
      }}
    />
  );
};

export default DoughnutChart;
