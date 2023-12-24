import { IoIosStats } from "react-icons/io";

const TotalClicksCard = (props: { total_clicks: number }) => {
  return (
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
        <p className=" font-semibold mt-4 ml-2">{props.total_clicks}</p>
      </div>
    </div>
  );
};

export default TotalClicksCard;
