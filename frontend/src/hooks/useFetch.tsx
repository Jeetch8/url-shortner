import { useCallback, useRef, useState } from "react";
import { getTokenFromLocalStorage } from "../utils/localstorage";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useFetch = ({
  url,
  method,
  headers,
  authorized,
  onSuccess,
  onError,
}) => {
  const navigate = useNavigate();
  const dataRef = useRef(null);
  const [fetchState, setFetchState] = useState(
    "idle" //loading,error,idle,success,
  );
  const errorRef = useRef(null);

  const doFetch = useCallback(
    async (dataToSend) => {
      setFetchState("loading");
      try {
        let fetchOptions = {
          headers: {
            ...headers,
          },
        };
        if (
          method === "POST" ||
          method === "PATCH" ||
          method === "PUT" ||
          method === "DELETE"
        ) {
          fetchOptions.body = dataToSend;
          if (!(dataToSend instanceof FormData)) {
            fetchOptions.headers["Content-Type"] = "application/json";
            fetchOptions.body = JSON.stringify(dataToSend);
          }
        } else {
          fetchOptions.headers["Content-Type"] = "application/json";
        }
        if (authorized === true) {
          const token = getTokenFromLocalStorage();
          if (!token) {
            localStorage.clear();
            navigate("/login");
          }
          fetchOptions.headers["authorization"] = `Bearer ${token}`;
        }
        const req = await fetch(url, {
          method,
          ...fetchOptions,
        });
        const res = await req.json();
        if (!req.ok) {
          if (req.status === 401) {
            toast.error("Please login again");
            navigate("/login");
            localStorage.clear();
          }
          throw new Error(res.msg);
        }
        if (onSuccess !== undefined && typeof onSuccess === "function") {
          onSuccess(res);
        }
        setFetchState("success");
        dataRef.current = res;
      } catch (error) {
        console.log(error);
        setFetchState("error");
        errorRef.current = error;
        if (onError !== undefined && typeof onError === "function") {
          onError(error);
        } else toast.error("Something went wrong");
      }
    },
    [url, method, headers, authorized, onSuccess, onError, navigate]
  );

  return { fetchState, dataRef, errorRef, doFetch };
};
