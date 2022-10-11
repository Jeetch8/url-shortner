import React, { useEffect } from "react";
import { useFetcher, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import { getUserFromLocalStorage } from "../utils/localstorage";
import DoughnutChart from "../components/DoughnutChart";

const LinkDashboard = () => {
  const params = useParams();
  const { doFetch, dataRef } = useFetch(
    base_url + "/dashboard/link/" + params.link_id,
    "GET",
    {
      authorization: `Bearer ${getUserFromLocalStorage().token}`,
    }
  );

  useEffect(() => {
    doFetch();
  }, []);

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
    </div>
  );
};

export default LinkDashboard;
