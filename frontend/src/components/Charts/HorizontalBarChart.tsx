interface Props {
  data: { label: string[]; data: string[] };
  title: string;
}

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function HorizontalBarChart({ data, title }: Props) {
  return (
    <Bar
      aria-label="Horizontal Bar Chart"
      options={{
        scales: {
          x: { reverse: true, display: false },
          y: {
            display: true,
            ticks: {
              mirror: true,
              font: {
                size: 18,
              },
            },
          },
        },
        responsive: true,
        indexAxis: "y",
        plugins: {
          datalabels: {
            display: true,
            color: "white",
            align: "start",
            anchor: "end",
            font: {
              size: 20,
              weight: "bolder",
            },
            formatter: function (value, context) {
              return `${value} %`;
            },
          },
          tooltip: {
            enabled: true,
          },
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: title,
            font: {
              weight: "bold",
              size: 20,
            },
          },
        },
      }}
      data={{
        labels: data?.label,
        datasets: [
          {
            categoryPercentage: 1,
            label: "title",
            data: data?.data,
            backgroundColor: "rgba(50, 99, 235, 0.2)",
            borderRadius: 2,
            hoverBorderWidth: 2,
          },
        ],
      }}
    />
  );
}
