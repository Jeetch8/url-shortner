export interface APIResponseObj<T> {
  status: "success" | "error";
  data: T;
}
