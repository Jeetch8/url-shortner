import { PiLinkSimpleThin } from "react-icons/pi";

const LinksGeneratedCard = (props: { generated_links: number }) => {
  return (
    <div className="border-2 rounded-lg w-[300px] flex overflow-hidden bg-white">
      <div className="py-4 px-4">
        <div className="flex items-center gap-x-5 w-full">
          <div className="border-2 rounded-lg py-[3px]">
            <PiLinkSimpleThin size={25} color="green" className="mx-1" />
          </div>
          <div className="">
            <h3 className="text-xl font-semibold">Total links generated</h3>
          </div>
        </div>
        <p className=" font-semibold mt-4 ml-2">{props.generated_links ?? 0}</p>
      </div>
    </div>
  );
};

export default LinksGeneratedCard;
