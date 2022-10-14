import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import DoughnutChart from "../components/DoughnutChart";
import ClicksLogTable from "../components/ClicksLogTable";

const LinkDashboard = () => {
  const params = useParams();
  const { doFetch, dataRef } = useFetch({
    url: base_url + "/dashboard/link/" + params.link_id,
    method: "GET",
    authorized: true,
  });

  useEffect(() => {
    doFetch();
  }, []);

  console.log(dataRef.current);

  return (
    <div>
      <h1>asdasd</h1>
      <div className="w-[450px] my-10">
        <div className=" py-6 bg-red-400">
          <h2 className="text-2xl font-semibold text-center">Platform</h2>
        </div>
        <div className="bg-stone-100 px-7 py-6">
          <DoughnutChart
            data={dataRef.current?.stats?.platform}
            title={"Platform"}
          />
        </div>
      </div>
      <div className="w-[450px] my-10">
        <div className=" py-6 bg-red-400">
          <h2 className="text-2xl font-semibold text-center">Referrer</h2>
        </div>
        <div className="bg-stone-100 px-7 py-6">
          <DoughnutChart
            data={dataRef.current?.stats?.referrer}
            title={"Referrer"}
          />
        </div>
      </div>
      <div className="w-[450px] my-10">
        <div className=" py-6 bg-red-400">
          <h2 className="text-2xl font-semibold text-center">Browser</h2>
        </div>
        <div className="bg-stone-100 px-7 py-6">
          <DoughnutChart
            data={dataRef.current?.stats?.browser}
            title={"Browser"}
          />
        </div>
      </div>
      <ClicksLogTable data={dataRef.current?.logs} />
    </div>
  );
};

export default LinkDashboard;
