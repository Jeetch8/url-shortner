import DataTable from "react-data-table-component";
import { TiArrowSortedUp } from "react-icons/ti";

const columns = [
  {
    name: "Browser",
    selector: (row) => row.browser,
  },
  {
    name: "Platform",
    selector: (row) => row.platform,
  },
  {
    name: "Referre",
    selector: (row) => row.referrer,
  },
  {
    name: "Location",
    selector: (row) => row.location?.city + " " + row.location?.country,
  },
  {
    name: "Date",
    selector: (row) => row.date?.date + " " + row.date?.time,
  },
];

function ClicksLogTable({ data }) {
  return (
    <div className="w-[900px]">
      <DataTable
        title="Click Logs"
        sortIcon={<TiArrowSortedUp />}
        columns={columns}
        data={data}
        pagination
      />
    </div>
  );
}
export default ClicksLogTable;
