import { http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import { AcceptedMethods } from "../src/hooks/useFetch";

export const mockErrorResponse = (props: {
  url: string;
  msg?: string;
  status?: number;
  method?: AcceptedMethods;
}) => {
  server.use(
    http.get(props.url, () => {
      return new HttpResponse("Testing error", {
        status: props.status ?? 500,
        statusText: props.msg,
      });
    })
  );
  server.use(
    http.post(props.url, () => {
      return new HttpResponse("Testing error", {
        status: props.status ?? 500,
        statusText: props.msg,
      });
    })
  );

  server.use(
    http.put(props.url, () => {
      return new HttpResponse("Testing error", {
        status: props.status ?? 500,
        statusText: props.msg,
      });
    })
  );

  server.use(
    http.delete(props.url, () => {
      return new HttpResponse("Testing error", {
        status: props.status ?? 500,
        statusText: props.msg,
      });
    })
  );

  server.use(
    http.patch(props.url, () => {
      return new HttpResponse("Testing error", {
        status: props.status ?? 500,
        statusText: props.msg,
      });
    })
  );
};

export const mockRequestResponse = (props: { url: string; data?: any }) => {
  server.use(http.get(props.url, () => HttpResponse.json(props.data ?? {})));
  server.use(http.post(props.url, () => HttpResponse.json(props.data ?? {})));
  server.use(http.put(props.url, () => HttpResponse.json(props.data ?? {})));
  server.use(http.delete(props.url, () => HttpResponse.json(props.data ?? {})));
  server.use(http.patch(props.url, () => HttpResponse.json(props.data ?? {})));
};
