import DataTable from "react-data-table-component";
import { TiArrowSortedUp } from "react-icons/ti";
import { ILogs } from "@shared/types/controllers/dashboard.type";

const columns = [
  {
    name: "Browser",
    selector: (row: ILogs) => row.browser,
  },
  {
    name: "Platform",
    selector: (row: ILogs) => row.platform,
  },
  {
    name: "Referre",
    selector: (row: ILogs) => row.referrer,
  },
  {
    name: "Location",
    selector: (row: ILogs) => row.location?.city + " " + row.location?.country,
  },
  {
    name: "Date",
    selector: (row: ILogs) => row.date?.elDate + " " + row.date?.elTime,
  },
];

function ClicksLogTable({ data }: { data: ILogs[] }) {
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
