import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { base_url, url_retrival_base_url } from '../utils/base_url';
import ClicksLogTable from '../components/Tables/ClicksLogTable';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import BarChart from '../components/Charts/BarChart';
import HorizontalBarChart from '../components/Charts/HorizontalBarChart';
import 'react-tabs/style/react-tabs.css';
import WorldMap from '../components/Maps/WorldMap';
import StatsImage from '../assets/chart-1568462.jpg';
import { FaRegCalendar } from 'react-icons/fa6';
import GeneralLinkHelpers from '../components/GeneralLinkHelpers';
import AvatarImage from '@/components/Global/AvatarImage';
import { HashLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { useUserContext } from '@/context/UserContext';

const LinkStatDashboard = () => {
  const params = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { doFetch, dataRef, fetchState } = useFetch({
    url: base_url + '/dashboard/link/' + params.linkId,
    method: 'GET',
    authorized: true,
    onError(error) {
      if (error.statusCode === 404) {
        navigate('/404');
      }
    },
  });

  useEffect(() => {
    doFetch();
  }, []);

  if (fetchState === 'loading')
    return (
      <div className="flex items-center justify-center h-[93vh]">
        <HashLoader color="rgb(29 78 216)" size={60} />
      </div>
    );

  const data = dataRef.current;

  return (
    <div
      className={twMerge(
        'max-w-[1600px] mx-auto pt-4',
        user?.subscription_warninig.visible && 'pt-[35px]'
      )}
    >
      <div className="bg-white rounded-lg px-5 py-6">
        <div className="flex justify-between items-start mr-4 mb-16 flex-wrap">
          <div>
            <div className="flex items-center gap-x-2 mb-2">
              <AvatarImage
                url={`https://www.google.com/s2/favicons?domain=${data?.shortend_url?.original_url}&sz=40`}
                diameter="30px"
              />
              <a
                className="text-2xl"
                href={
                  url_retrival_base_url +
                  '/' +
                  data?.shortend_url?.shortend_url_cuid
                }
              >
                {url_retrival_base_url +
                  '/' +
                  data?.shortend_url?.shortend_url_cuid}
              </a>
            </div>
            <a
              href={data?.shortend_url?.original_url}
              target="_blank"
              className="hover:underline text-black"
            >
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
          <div className="mt-4 sm:mt-0">
            <GeneralLinkHelpers
              linkObj={data?.shortend_url}
              fetchGeneratedLinks={doFetch}
            />
          </div>
        </div>
        {data?.logs.length !== 0 ? (
          <div>
            <div className="border-2 rounded-lg px-4 py-2 max-w-[1400px] mx-auto">
              <Tabs selectedTabClassName="outline-none bg-gray-200 border-gray-400">
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
                <TabPanel className="px-4">
                  <BarChart
                    data={dataRef.current?.stats?.clicksByHours}
                    title={'Clicks'}
                  />
                </TabPanel>
                <TabPanel className="px-4">
                  <BarChart
                    data={dataRef.current?.stats?.clicksByDays}
                    title={'Clicks'}
                  />
                </TabPanel>
                <TabPanel className="px-4">
                  <BarChart
                    data={dataRef.current?.stats?.clicksByMonths}
                    title={'Clicks'}
                  />
                </TabPanel>
              </Tabs>
            </div>
            <div className="border-2 rounded-lg my-6 max-w-[1000px] mx-auto">
              {dataRef.current?.stats?.location && (
                <div className="px-5 py-2">
                  <h3 className="text-2xl">Location</h3>
                  <div className="mx-auto">
                    <WorldMap data={dataRef.current?.stats?.location} />
                  </div>
                </div>
              )}
            </div>
            <div className="border-2 rounded-lg px-6 py-2 max-w-[1000px] mx-auto">
              <h2 className="text-2xl mb-2">Top Hours</h2>
              <BarChart data={data?.stats?.topHours} title={'Top Hours'} />
            </div>
            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              <div className="border-2 rounded-lg">
                <div className="mx-auto mt-5 px-6">
                  <h2 className="text-2xl">Click type</h2>
                  <HorizontalBarChart
                    title={'Clicks'}
                    data={dataRef.current?.stats?.clicksType}
                  />
                </div>
              </div>
              <div className="border-2 rounded-lg px-6">
                <HorizontalBarChart
                  data={data?.stats?.topDays}
                  title={'Top Days'}
                />
              </div>
              <div className="border-2 rounded-lg px-6">
                <HorizontalBarChart
                  data={data?.stats?.browser}
                  title={'Top Browsers'}
                />
              </div>
              <div className="border-2 rounded-lg px-6">
                <HorizontalBarChart
                  data={data?.stats?.devices}
                  title={'Top Devices'}
                />
              </div>
            </div>
            {/* <div className="w-[450px]">
              <div className=" py-6 bg-red-400">
                <h2 className="text-2xl font-semibold text-center">Referrer</h2>
              </div>
              <div className="bg-stone-100 px-7 py-6">
                <DoughnutChart
                  data={dataRef.current?.stats?.referrer}
                  title={"Referrer"}
                />
              </div>
            </div> */}
            <div className="w-full mt-6">
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
    </div>
  );
};

export default LinkStatDashboard;
