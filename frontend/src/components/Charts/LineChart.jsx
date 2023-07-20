import React from "react";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  CategoryScale
);

function LineChart({ data }) {
  return (
    <Line
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
          filler: {
            propagate: true,
          },
          legend: {
            display: false,
            position: "top",
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
            data: data?.data,
            borderColor: data?.borderColor,
            tension: 0.4,
            pointStyle: "circle",
            pointRadius: 1,
            pointHoverRadius: 15,
            backgroundColor: "rgba(248, 113, 113, 0.1)",
            fill: true,
          },
        ],
      }}
    />
  );
}

export default LineChart;
