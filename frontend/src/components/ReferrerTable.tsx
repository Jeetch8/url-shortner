import DataTable from "react-data-table-component";
import { TiArrowSortedUp } from "react-icons/ti";

const columns = [
  {
    name: "Referrer",
    selector: (row) => row.label,
  },
  {
    name: "Clicks",
    selector: (row) => row.value,
  },
];

function ClicksLogTable({ data }) {
  return (
    <div>
      <DataTable
        title="Refferrers"
        sortIcon={<TiArrowSortedUp />}
        columns={columns}
        data={data}
        pagination
        customStyles={{
          rows: {
            style: {
              border: "none",
            },
          },
          cells: {
            style: {
              border: "none",
            },
          },
        }}
      />
    </div>
  );
}
export default ClicksLogTable;
