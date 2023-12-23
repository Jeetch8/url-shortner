import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";

const Subscribe = () => {
  const { doFetch } = useFetch<{ url: string }>({
    method: "POST",
    authorized: true,
    url: base_url + "/subscription/create-checkout-session",
    onSuccess(data) {
      console.log(data);
      window.open(data.url, "_self");
    },
  });

  const creaeSubscription = async () => {
    await doFetch({ priceId: "price_1PRQIKSGLuU49Vk9Q5fEkAXo" });
  };
  return (
    <div>
      <button
        onClick={creaeSubscription}
        className="bg-blue-600 px-4 py-2 rounded-md"
      >
        Subscribe
      </button>
    </div>
  );
};

export default Subscribe;
