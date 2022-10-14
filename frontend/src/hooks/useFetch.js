import { useRef, useState } from "react";
import { getUserFromLocalStorage } from "../utils/localstorage";

export const useFetch = ({
  url,
  method,
  headers,
  authorized,
  onSuccess,
  onError,
}) => {
  const dataRef = useRef(null);
  const [fetchState, setFetchState] = useState(
    "idle" //loading,error,idle,
  );
  const errorRef = useRef(null);

  const doFetch = async (dataToSend) => {
    setFetchState("loading");
    try {
      let fetchOptions = {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      };
      if (method === "POST" || method === "PATCH" || method === "PUT") {
        fetchOptions = {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify(dataToSend),
        };
      }
      if (authorized === true) {
        fetchOptions.headers["authorization"] = `Bearer ${
          getUserFromLocalStorage().token
        }`;
      }
      const req = await fetch(url, {
        method,
        ...fetchOptions,
      });
      const res = await req.json();
      if (onSuccess !== undefined && typeof onSuccess === "function") {
        onSuccess(res);
      }
      setFetchState("idle");
      dataRef.current = res;
    } catch (error) {
      console.log(error);
      setFetchState("error");
      errorRef.current = error;
      if (onError !== undefined && typeof onError === "function") {
        onError(res);
      }
    }
  };

  return { fetchState, dataRef, errorRef, doFetch };
};
