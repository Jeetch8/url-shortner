import { useLayoutEffect } from "react";
import LineChart from "@/components/Charts/LineChart";
import { useUserContext } from "@/context/UserContext";
import { useFetch } from "@/hooks/useFetch";
import { base_url } from "@/utils/base_url";
import WorldMap from "@/components/Maps/WorldMap";
import ReferrerTable from "@/components/Tables/ReferrerTable";
import { Tooltip } from "react-tooltip";
import { BsInfoCircle } from "react-icons/bs";
import DevicesStatsTable from "@/components/Tables/DevicesTable";
import { twMerge } from "tailwind-merge";
import TotalClicksCard from "@/components/Home/TotalClicksCard";
import LinksGeneratedCard from "@/components/Home/LinksGeneratedCard";

const Home = () => {
  const { user } = useUserContext();
  const globalUser = user?.user;
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
      <div
        className={twMerge(
          "h-full px-4 py-4",
          user?.subscription_warninig.visible && "pt-[35px]"
        )}
      >
        <h1 className="text-3xl font-semibold">
          Hello, {globalUser?.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-2">
          Track your overall performance of this week here.
        </p>
        <div className="my-5">
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-5 my-5">
            <div>
              <div className="hidden 2xl:block">
                <TotalClicksCard total_clicks={dataRef.current?.total_clicks} />
              </div>
              <div className="2xl:hidden flex flex-wrap justify-between">
                <TotalClicksCard total_clicks={dataRef.current?.total_clicks} />
                <div className="mt-4 sm:mt-0">
                  <LinksGeneratedCard
                    generated_links={dataRef.current?.generated_links}
                  />
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
              <div className="hidden 2xl:block">
                <LinksGeneratedCard
                  generated_links={dataRef.current?.generated_links}
                />
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
                  <WorldMap
                    data={
                      dataRef.current?.location ?? [{ country: "IN", value: 0 }]
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-x-5 pt-5">
            <div className=" bg-black">
              <DevicesStatsTable data={dataRef.current?.devices} />
            </div>
            <div className=" mt-4 2xl:mt-0">
              <ReferrerTable data={dataRef.current?.referrer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
