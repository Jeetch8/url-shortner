import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function App({ data }) {
  return (
    <Bar
      options={{
        responsive: true,
        scales: {
          x: {
            display: true,
          },
          y: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      }}
      data={{
        labels: data?.labels,
        datasets: [
          {
            label: "Clicks",
            data: data?.data,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderRadius: 15,
            hoverBorderWidth: 4,
            maxBarThickness: 60,
          },
        ],
      }}
    />
  );
}
