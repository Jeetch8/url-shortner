import { useRef, useState } from "react";
import { getUserFromLocalStorage } from "../utils/localstorage";

export const useFetch = (url, method, headers) => {
  const dataRef = useRef(null);
  const [fetchState, setFetchState] = useState(
    "idle" //loading,error,idle,
  );
  const errorRef = useRef(null);

  const doFetch = async (dataToSend) => {
    if (dataToSend !== "" || dataToSend !== undefined) {
      setFetchState("loading");
      try {
        let fetchOptions = {
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        };
        if (method === "POST") {
          fetchOptions = {
            method,
            headers: {
              "Content-Type": "application/json",
              ...headers,
            },
            body: JSON.stringify(dataToSend),
          };
        }
        const req = await fetch(url, {
          method,
          ...fetchOptions,
        });
        const res = await req.json();
        setFetchState("idle");
        dataRef.current = res;
      } catch (error) {
        console.log(error);
        setFetchState("error");
        errorRef.current = error;
      }
    }
  };

  return { fetchState, dataRef, errorRef, doFetch };
};
