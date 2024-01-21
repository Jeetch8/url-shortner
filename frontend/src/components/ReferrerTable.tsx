interface Referrer {
  label: string;
  value: string;
}

import DataTable from "react-data-table-component";
import { TiArrowSortedUp } from "react-icons/ti";

const columns = [
  {
    name: "Referrer",
    selector: (row: Referrer) => row.label,
  },
  {
    name: "Clicks",
    selector: (row: Referrer) => row.value,
  },
];

function ClicksLogTable({ data }: { data: Referrer[] }) {
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
