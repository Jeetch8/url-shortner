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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function App({ data, title }: Props) {
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
        labels: data?.label,
        datasets: [
          {
            label: title,
            data: data?.data,
            backgroundColor: "rgb(37, 99, 235)",
            borderRadius: 2,
            hoverBorderWidth: 2,
          },
        ],
      }}
    />
  );
}
