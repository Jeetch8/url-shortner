interface Device {
  label: string;
  value: number;
}

import DataTable from "react-data-table-component";
import { TiArrowSortedUp } from "react-icons/ti";

const columns = [
  {
    name: "Device",
    selector: (row: Device) => row.label,
  },
  {
    name: "Clicks",
    selector: (row: Device) => row.value,
  },
];

function DeviceStatsTable({ data }: { data: Device[] }) {
  return (
    <DataTable
      title="Devices"
      sortIcon={<TiArrowSortedUp />}
      columns={columns}
      data={data}
      pagination
    />
  );
}
export default DeviceStatsTable;
