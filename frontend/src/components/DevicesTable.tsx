import DataTable from "react-data-table-component";
import { TiArrowSortedUp } from "react-icons/ti";

const columns = [
  {
    name: "Device",
    selector: (row) => row.label,
  },
  {
    name: "Clicks",
    selector: (row) => row.value,
  },
];

function ClicksLogTable({ data }) {
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
export default ClicksLogTable;
