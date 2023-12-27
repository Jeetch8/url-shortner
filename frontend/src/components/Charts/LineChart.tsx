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

function LineChart({
  data,
}: {
  data: { label: string[]; data: string[]; borderColor: "green" | "red" };
}) {
  return (
    <Line
      // className="bg-green-400"
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
          },
          title: {
            display: false,
          },
        },
      }}
      data={{
        labels: data?.label,
        datasets: [
          {
            data: data?.data,
            borderColor: data?.borderColor,
            tension: 0.4,
            pointStyle: "circle",
            pointRadius: 4,
            pointHitRadius: 10,
            pointHoverRadius: 15,
            backgroundColor:
              data?.borderColor === "green"
                ? "rgba(74, 222, 128, 0.1)"
                : "rgba(248, 113, 113, 0.1)",
            fill: true,
          },
        ],
      }}
    />
  );
}

export default LineChart;
