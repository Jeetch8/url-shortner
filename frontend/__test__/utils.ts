import { Response, Server } from "miragejs";
import { AcceptedMethods } from "../src/hooks/useFetch";
import { base_url } from "../src/utils/base_url";

export function mockErrorResponse(props: {
  server: Server;
  route: string;
  msg?: string;
  status?: number;
}) {
  props.server.urlPrefix = "http://localhost:5000";
  props.server.namespace = "/api/v1";
  props.server.get(props.route, () => {
    return new Response(
      props.status ?? 500,
      { "Content-Type": "application/json" },
      JSON.stringify({ message: props.msg ?? "Internal Server Error" })
    );
  });
}

export function mockRequestResponse(props: {
  server: Server;
  route: string;
  msg?: string;
  status?: number;
  data?: any;
  method: AcceptedMethods;
}) {
  props.server.urlPrefix = "http://localhost:5000";
  props.server.namespace = "/api/v1";
  const method = props.method.toLowerCase() as
    | "get"
    | "put"
    | "post"
    | "delete";
  props.server[method](props.route, () => {
    return new Response(
      props.status ?? 200,
      { "Content-Type": "application/json" },
      JSON.stringify(
        props.data ?? { message: props.msg ?? "Internal Server Error" }
      )
    );
  });
}
