import React, { useLayoutEffect } from "react";
import LineChart from "../components/Charts/LineChart";
import { useUserContext } from "../context/UserContext";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import WorldMap from "../components/WorldMap";
import ReferrerTable from "../components/ReferrerTable";
import { PiLinkSimpleThin } from "react-icons/pi";
import { Tooltip } from "react-tooltip";
import { BsInfoCircle } from "react-icons/bs";
import DevicesTable from "../components/DevicesTable";
import { IoIosStats } from "react-icons/io";

const Home = () => {
  const { user } = useUserContext();
  const { dataRef, doFetch } = useFetch({
    url: base_url + "/user/stats",
    method: "GET",
    authorized: true,
  });

  useLayoutEffect(() => {
    doFetch();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="h-full px-4 py-4">
        <h1 className="text-3xl font-semibold">
          Hello, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-2">
          Track your overall performance of this week here.
        </p>
        <div className="my-5">
          <div className="grid grid-cols-2 gap-x-5 my-5">
            <div>
              <div className="border-2 rounded-lg w-[300px] flex overflow-hidden bg-white">
                <div className="py-4 px-4">
                  <div className="flex items-center gap-x-5 w-full">
                    <div className="border-2 rounded-lg">
                      <IoIosStats size={30} color="blue" className="mx-1" />
                    </div>
                    <div className="">
                      <p className="text-xl font-semibold">Total Clicks</p>
                    </div>
                  </div>
                  <p className=" font-semibold mt-4 ml-2">
                    {dataRef.current?.total_clicks}
                  </p>
                </div>
              </div>
              <div className="w-full rounded-lg mt-5 bg-white">
                <div className="border-b-2">
                  <div className="flex justify-between px-4 py-4  items-center max-w-[350px] border-r-2">
                    <div>
                      <p className="font-semibold text-xl">
                        All Clicks
                        <a
                          href=""
                          className="inline-block ml-2 w-fit"
                          data-tooltip-id="last7daysClicks"
                          data-tooltip-content={
                            "Total clicks in the last 7 days including today."
                          }
                          data-tooltip-place="top"
                        >
                          <BsInfoCircle size={15} color="grey" />
                        </a>
                      </p>
                      <Tooltip id="last7daysClicks" />
                      <p>Last 7 days</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">
                        {dataRef.current?.clicks_last7days}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-10">
                  <LineChart data={dataRef.current?.clicks} />
                </div>
              </div>
            </div>
            <div>
              <div className="border-2 rounded-lg w-[300px] flex overflow-hidden bg-white">
                <div className="py-4 px-4">
                  <div className="flex items-center gap-x-5 w-full">
                    <div className="border-2 rounded-lg py-[3px]">
                      <PiLinkSimpleThin
                        size={25}
                        color="green"
                        className="mx-1"
                      />
                    </div>
                    <div className="">
                      <p className="text-xl font-semibold">
                        Total links generated
                      </p>
                    </div>
                  </div>
                  <p className=" font-semibold mt-4 ml-2">
                    {dataRef.current?.generated_links}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg mt-5">
                <div className="pl-4 pt-4">
                  <p className="font-semibold text-xl">
                    Traffic Source
                    <a
                      href=""
                      className="inline-block ml-2 w-fit"
                      data-tooltip-id="last7daysClicks"
                      data-tooltip-content={
                        "Source of traffic segregated by its origin place."
                      }
                      data-tooltip-place="top"
                    >
                      <BsInfoCircle size={15} color="grey" />
                    </a>
                  </p>
                  <Tooltip id="my-tooltip" />
                  <Tooltip id="last7daysClicks" />
                  <p>Last 7 days</p>
                </div>
                <div className="mx-8">
                  {dataRef.current?.location && (
                    <WorldMap data={dataRef.current?.location} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-5 pt-5">
            <div className=" bg-black">
              <DevicesTable data={dataRef.current?.devices} />
            </div>
            <div className="">
              <ReferrerTable data={dataRef.current?.referrer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
