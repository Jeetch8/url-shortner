import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { base_url, url_retrival_base_url } from "../utils/base_url";
import DoughnutChart from "../components/Charts/DoughnutChart";
import ClicksLogTable from "../components/ClicksLogTable";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import BarChart from "../components/Charts/BarChart";
import HorizontalBarChart from "../components/Charts/HorizontalBarChart";
import "react-tabs/style/react-tabs.css";
import WorldMap from "../components/WorldMap";
import StatsImage from "../assets/chart-1568462.jpg";
import { FaRegCalendar } from "react-icons/fa6";
import GeneralLinkFunctions from "../components/GeneralLinkFunctions";

const LinkDashboard = () => {
  const params = useParams();
  const { doFetch, dataRef } = useFetch({
    url: base_url + "/dashboard/link/" + params.linkId,
    method: "GET",
    authorized: true,
    onSuccess: (res) => {
      console.log(res);
    },
  });

  useEffect(() => {
    doFetch();
  }, []);

  const data = dataRef.current;

  return (
    <div className="max-w-[1600px] mx-auto rounded-lg bg-white my-6 px-6 py-6">
      <div className="flex justify-between items-start mr-4 mb-16">
        <div>
          <div className="flex items-center gap-x-2 mb-2">
            <img
              src={`https://www.google.com/s2/favicons?domain=${data?.shortend_url?.original_url}&sz=35`}
              alt=""
            />
            <a className="text-2xl">
              {url_retrival_base_url +
                "/" +
                data?.shortend_url?.shortened_url_cuid}
            </a>
          </div>
          <a href={data?.shortend_url?.original_url} target="_blank">
            {data?.shortend_url?.original_url}
          </a>
          <div className="flex items-center gap-x-2 mt-3">
            <FaRegCalendar size={20} />
            <span>
              {new Date(data?.shortend_url?.createdAt).toDateString()}
            </span>
          </div>
          <div>
            <span>{data?.stats?.total_clicks}</span>
          </div>
        </div>
        <GeneralLinkFunctions
          linkObj={data?.shortend_url}
          fetchGeneratedLinks={doFetch}
        />
      </div>
      {data?.logs.length !== 0 ? (
        <div>
          <div className="grid grid-cols-2 gap-6">
            <div className="border-2 rounded-lg px-4 py-2">
              <Tabs>
                <TabList className="flex justify-end gap-x-2 my-6">
                  <Tab className="border-2 rounded-full px-5  cursor-pointer py-1">
                    Hours
                  </Tab>
                  <Tab className="border-2 rounded-full px-5 cursor-pointer py-1">
                    Days
                  </Tab>
                  <Tab className="border-2 rounded-full px-5  cursor-pointer py-1">
                    Months
                  </Tab>
                </TabList>
                <TabPanel>
                  <BarChart
                    data={dataRef.current?.stats?.clicksByHours}
                    title={"Clicks"}
                  />
                </TabPanel>
                <TabPanel>
                  <BarChart
                    data={dataRef.current?.stats?.clicksByDays}
                    title={"Clicks"}
                  />
                </TabPanel>
                <TabPanel>
                  <BarChart
                    data={dataRef.current?.stats?.clicksByMonths}
                    title={"Clicks"}
                  />
                </TabPanel>
              </Tabs>
            </div>
            <div className="border-2 rounded-lg">
              {dataRef.current?.stats?.location && (
                <div className="mx-auto">
                  <WorldMap data={dataRef.current?.stats?.location} />
                </div>
              )}
            </div>
            <div className="border-2 rounded-lg">
              <div className="w-[500px] mx-auto mt-5">
                <h2 className="text-2xl">Click type</h2>
                <HorizontalBarChart
                  title={"Clicks"}
                  data={dataRef.current?.stats?.clicksType}
                />
              </div>
            </div>
            <div className="border-2 rounded-lg px-6 py-2">
              <BarChart data={data?.stats?.topHours} title={"Top Hours"} />
            </div>
            <div className="border-2 rounded-lg px-6">
              <h2 className="text-2xl mt-2">Top Days</h2>
              <HorizontalBarChart
                data={data?.stats?.topDays}
                title={"Top Days"}
              />
            </div>
            <div className="border-2 rounded-lg px-6">
              <h2 className="text-2xl mt-2">Top Browser</h2>
              <HorizontalBarChart
                data={data?.stats?.browser}
                title={"Top Browsers"}
              />
            </div>
            <div className="border-2 rounded-lg px-6">
              <h2 className="text-2xl mt-2">Top Devices</h2>
              <HorizontalBarChart
                data={data?.stats?.devices}
                title={"Top Devices"}
              />
            </div>
            <div className="w-[450px]">
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
          </div>
          <div>
            <ClicksLogTable data={dataRef.current?.logs} />
          </div>
        </div>
      ) : (
        <div className="max-w-[700px] mx-auto mt-[100px] text-center mb-[50px]">
          <div>
            <img src={StatsImage} alt="Stats vector" />
          </div>
          <h3 className="text-2xl my-4">
            Share your link and start tracking clicks
          </h3>
          <a
            href={`${url_retrival_base_url}/${data?.shortend_url?.shortened_url_cuid}`}
            target="_blank"
            className="font-semibold text-blue-700"
          >
            Be the first to Click
          </a>
        </div>
      )}
    </div>
  );
};

export default LinkDashboard;
// device type
