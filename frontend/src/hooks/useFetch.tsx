import { useCallback, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "../utils/localstorage";

export enum AcceptedMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum FetchStates {
  LOADING = "loading",
  ERROR = "error",
  IDLE = "idle",
  SUCCESS = "success",
}

type HTTPMethods = keyof typeof AcceptedMethods;

interface UseFetchProps<TData, TError> {
  url: string;
  method: HTTPMethods;
  headers?: HeadersInit;
  authorized?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

interface ApiResponse<TData> {
  status: "success" | "error";
  data: TData;
  message: string;
}

export interface ApiError {
  message: string;
  status: "error";
}

export const useFetch = <TData = any, TError = ApiError>({
  url,
  method,
  headers = {},
  authorized = false,
  onSuccess,
  onError,
}: UseFetchProps<TData, TError>) => {
  const navigate = useNavigate();
  const dataRef = useRef<TData | null>(null);
  const [fetchState, setFetchState] = useState<FetchStates>(FetchStates.IDLE);
  const errorRef = useRef<TError | null>(null);

  const handleUnAuthorisedAccessError = useCallback(() => {
    toast.error("Please login again");
    navigate("/login");
    localStorage.clear();
    setFetchState(FetchStates.ERROR);
  }, []);

  const doFetch = useCallback(
    async (dataToSend?: Record<string, any> | FormData) => {
      setFetchState(FetchStates.LOADING);
      try {
        const fetchHeaders: HeadersInit = new Headers(headers);

        if (method !== AcceptedMethods.GET && dataToSend) {
          if (dataToSend instanceof FormData) {
            // FormData handles its own Content-Type
          } else {
            fetchHeaders.set("Content-Type", "application/json");
          }
        }

        if (authorized) {
          const token = getTokenFromLocalStorage();
          if (!token) {
            handleUnAuthorisedAccessError();
            return;
          }
          fetchHeaders.set("Authorization", `Bearer ${token}`);
        }

        const fetchOptions: RequestInit = {
          method,
          headers: fetchHeaders,
          body:
            dataToSend instanceof FormData
              ? dataToSend
              : JSON.stringify(dataToSend),
        };

        const req = await fetch(url, fetchOptions);
        console.log(req.status, "usefetch1");
        if (!req.ok) {
          if (req.status === 401) {
            handleUnAuthorisedAccessError();
            return;
          }
          const err = await req.json();
          if (req.statusText) throw new Error(err.message);
          else throw new Error("An error occurred");
        }
        const res: ApiResponse<TData> = await req.json();
        console.log(res.status, res.data, "usefetch2");
        if (onSuccess) {
          onSuccess(res.data);
        }
        setFetchState(FetchStates.SUCCESS);
        dataRef.current = res.data;
      } catch (error) {
        console.error(error, "error from useFetch");
        setFetchState(FetchStates.ERROR);
        errorRef.current = error as TError;
        if (onError) {
          onError(error as TError);
        } else {
          toast.error("Something went wrong");
        }
      }
    },
    [url, method, headers, authorized, onSuccess, onError, navigate]
  );

  return { fetchState, dataRef, errorRef, doFetch };
};
