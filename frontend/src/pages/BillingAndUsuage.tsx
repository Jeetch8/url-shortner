import { twMerge } from "tailwind-merge";
import { useUserContext } from "../context/UserContext";
import { FaCheck } from "react-icons/fa6";
import { RiVisaFill } from "react-icons/ri";
import { SiMastercard } from "react-icons/si";
import { LiaCcDiscover } from "react-icons/lia";
import { FaApplePay } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";
import { RiPaypalLine } from "react-icons/ri";
import { HiCreditCard } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const GetCardIcon = (props: { brand: string }) => {
  switch (props.brand) {
    case "visa":
      return <RiVisaFill size={20} />;
    case "mastercard":
      return <SiMastercard size={20} />;
    case "discover":
      return <LiaCcDiscover size={20} />;
    case "apple pay":
      return <FaApplePay size={20} />;
    case "american express":
      return <SiAmericanexpress size={20} />;
    case "paypal":
      return <RiPaypalLine size={20} />;
    default:
      return <HiCreditCard size={20} />;
  }
};

const CheckList = (props: { text: string; el: any }) => {
  if (props.el === undefined)
    return (
      <div className="mt-3">
        <Skeleton width={200} borderRadius={10} />
      </div>
    );
  const enabeld = Boolean(props.el);
  return (
    <li className="flex gap-x-6 items-center text-[15px] mt-3">
      {enabeld ? (
        <FaCheck role="check_icon" className="text-green-600" />
      ) : (
        <RxCross2 role="cross_icon" className="text-red-600" />
      )}
      <span>{props.text}</span>
    </li>
  );
};

const UsuageIndicator = (props: {
  title: string;
  available_amount: number;
  used_amount: number;
  fetchState: string;
}) => {
  return (
    <div className="border-b-2 w-full">
      <div className="max-w-[450px] w-full py-4 px-6">
        <div className="flex justify-between">
          <p>{props.title}</p>
          <p className="font-bold">
            {props.fetchState === "loading" ? (
              <Skeleton width={50} borderRadius={10} />
            ) : (
              <span>
                {props.used_amount} of {props.available_amount} used
              </span>
            )}
          </p>
        </div>
        {props.fetchState === "loading" ? (
          <Skeleton width={"400px"} height={"5px"} borderRadius={10} />
        ) : (
          <div className="h-[5px] relative bg-stone-200 w-full py-[1px] px-[1px] rounded-md mt-2">
            <span
              style={{
                width: `${String(
                  (props.used_amount / props.available_amount) * 100
                )}%`,
              }}
              className="w-[20%] h-full absolute rounded-md bg-blue-600"
            ></span>
          </div>
        )}
      </div>
    </div>
  );
};

const BillingAndUsuage = () => {
  const { user, userFetchState } = useUserContext();

  return (
    <div
      className={twMerge(
        "px-4 py-4",
        user?.subscription_warninig.visible && "pt-[35px]"
      )}
    >
      <div className="bg-white px-6 py-4 rounded-md">
        <h1 className="text-3xl font-extrabold mt-3">Billing and usuage</h1>
        <div aria-label="plan details comp">
          <h2 className="font-bold text-2xl mt-5">Plan details</h2>
          <div className="w-full max-w-[550px] border-2 rounded-md overflow-hidden mt-2">
            <div className="bg-stone-100 flex justify-between px-4 py-3 border-b-2">
              <h3 className="font-semibold text-xl">
                {user?.product.product_name ?? (
                  <Skeleton
                    containerTestId="loader"
                    width={150}
                    borderRadius={10}
                  />
                )}
              </h3>
              {user?.product.db_product_title !== "enterprise" && (
                <button className="bg-blue-600 text-white px-6 py-1 rounded-md text-sm">
                  Upgrade
                </button>
              )}
            </div>
            <div className="px-5 py-4">
              <p className="font-semibold">Included in your plan:</p>
              <ul className="">
                <CheckList
                  el={user?.product.features.link_generation}
                  text={`${user?.product.features.link_generation} Link generations`}
                />
                <CheckList
                  el={user?.product.features.custom_domains}
                  text={`${user?.product.features.landing_page} Landing pages`}
                />
                <CheckList
                  el={user?.product.features.link_cloaking}
                  text={`Link Cloaking`}
                />
                <CheckList
                  el={user?.product.features.link_stats}
                  text={`link Stats`}
                />
                <CheckList
                  el={user?.product.features.link_expiration}
                  text={`Link expiration`}
                />
                <CheckList
                  el={user?.product.features.link_password_protection}
                  text="Link password protection"
                />
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Monthly usuage</h2>
          <div className="max-w-[550px] w-full rounded-md border-2 mt-3">
            <div className="bg-stone-100 py-4 px-4 border-b-2">
              <h3 className="text-xl font-bold">Usuage details</h3>
            </div>
            <UsuageIndicator
              fetchState={userFetchState}
              title="Links generated"
              available_amount={
                user?.product.features.link_generation as number
              }
              used_amount={user?.user.generated_links.length as number}
            />
            <UsuageIndicator
              fetchState={userFetchState}
              title="Custom domains"
              available_amount={user?.product.features.custom_domains as number}
              used_amount={0}
            />
            <UsuageIndicator
              fetchState={userFetchState}
              title="Workspaces"
              available_amount={user?.product.features.workspaces as number}
              used_amount={1}
            />
            <UsuageIndicator
              fetchState={userFetchState}
              title="Team members"
              available_amount={user?.product.features.team_members as number}
              used_amount={1}
            />
          </div>
        </div>
        <div className="mt-7">
          <h2 className="text-2xl font-bold">Billing history</h2>
          <div className=" w-full border-2 rounded-md px-2 py-2">
            <table className="table-auto w-full">
              <thead className="">
                <tr className="bg-stone-200 border-b-2 text-left">
                  <th className="py-2 w-[120px]">Product name</th>
                  <th className="w-[100px]">Card Number</th>
                  <th className="w-[80px]">Price</th>
                  <th className="w-[120px]">Purchase date</th>
                  <th className="w-[120px]">Expiry date</th>
                </tr>
              </thead>
              <tbody className="[&_:where(td)]:py-2">
                {user?.user?.subscription_id?.purchase_log.map((purchase) => {
                  return (
                    <tr key={purchase?._id.toString()}>
                      <td className="font-semibold">
                        {purchase.product_name.toLocaleUpperCase()}
                      </td>
                      <td className="flex items-center gap-x-2">
                        <GetCardIcon brand={purchase.payment_method_brand} />{" "}
                        {purchase.card_last4}
                      </td>
                      <td>$ {purchase.amount}</td>
                      <td>
                        {new Date(purchase.date_of_purchase).toDateString()}
                      </td>
                      <td>{new Date(purchase.expired_on).toDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div>
              {userFetchState === "loading" &&
                [1, 2, 3].map((ind) => {
                  return (
                    <Skeleton
                      key={ind}
                      aria-label="loader"
                      height={20}
                      borderRadius={5}
                      className="mt-2"
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingAndUsuage;
