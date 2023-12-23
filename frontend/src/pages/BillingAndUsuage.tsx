import Subscribe from "./Subscribe";
import { twMerge } from "tailwind-merge";
import { useUserContext } from "../context/UserContext";

const BillingAndUsuage = () => {
  const { user } = useUserContext();

  return (
    <div
      className={twMerge(
        "px-4 py-4",
        user?.subscription_warninig.visible && "pt-[35px"
      )}
    >
      <div className="bg-white">
        <div>
          <h2 className="font-bold text-2xl">Plan details</h2>
          <div className="w-fit">
            <div className="bg-blue-50 flex justify-between px-4 py-4">
              <p className="font-semibold text-xl">Free plan</p>
              <button className="bg-blue-600 text-white px-4 rounded-md text-sm">
                Upgrade
              </button>
              <Subscribe />
            </div>
            <div>
              <p>Included in your plan:</p>
              <ul>
                <li></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-[500px] w-full">
          <h2>Monthl usuage</h2>
          <div>
            <div>
              <h3>Usuage details</h3>
            </div>
            <div>
              <div>
                <p>Short Links</p>
                <p>
                  <span>0</span> of <span>50</span>
                </p>
              </div>
              <div className="h-[5px] relative bg-stone-200 w-full py-[1px] px-[1px] rounded-md">
                <span
                  style={{ width: `${String((30 / 50) * 100)}%` }}
                  className="w-[20%] h-full absolute rounded-md bg-blue-600"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{JSON.stringify(user?.user.subscription_id)}</div>
      <p>Plan Name: {user?.user.subscription_id.plan_name}</p>
      <p>Product Name: {user?.user.subscription_id.product_name}</p>
    </div>
  );
};

export default BillingAndUsuage;
