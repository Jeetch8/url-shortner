import {
  useFetch,
  FetchStates,
  AcceptedMethods,
} from "../../src/hooks/useFetch";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mockErrorResponse, mockRequestResponse } from "../utils";
import toast, { Toaster } from "react-hot-toast";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
    <Toaster />
  </BrowserRouter>
);

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Testing useFetch hook", () => {
  let toasterSpy: any;
  let localStorageClearMock: any;
  let localStorageSetMock: any;
  let fetchSpy: any;
  beforeAll(() => {
    fetchSpy = vi.spyOn(window, "fetch");
    toasterSpy = vi.spyOn(toast, "error");
    localStorageClearMock = vi.spyOn(Storage.prototype, "clear");
    localStorageSetMock = vi.spyOn(Storage.prototype, "getItem");
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (props: {
    method: AcceptedMethods;
    authorized?: boolean;
  }) => {
    const { result } = renderHook(
      () =>
        useFetch({
          url: "/testurl",
          method: props.method,
          authorized: props.authorized ?? false,
        }),
      { wrapper }
    );
    return {
      result,
    };
  };

  it("Should render intial state", () => {
    const { result } = renderComponent({ method: AcceptedMethods.GET });
    const current = result.current;
    expect(current.fetchState).toEqual(FetchStates.IDLE);
    expect(current.dataRef.current).toBeNull();
    expect(current.errorRef.current).toBeNull();
  });

  it("GET Should return error when fetch fail", async () => {
    const errMsg = "Testing error";
    mockErrorResponse({ url: "/testurl", msg: errMsg });
    const { result } = renderComponent({ method: AcceptedMethods.GET });

    act(() => {
      result.current.doFetch();
    });

    await waitFor(() => {
      expect(result.current.fetchState).toEqual(FetchStates.ERROR);
      expect(result.current.errorRef.current).not.toBeNull();
      expect(result.current.errorRef.current?.message).toEqual(errMsg);
    });
  });

  // 401 redirect
  it.each([
    { method: AcceptedMethods.GET },
    { method: AcceptedMethods.DELETE },
    { method: AcceptedMethods.POST },
    { method: AcceptedMethods.PUT },
  ])("$method Should redirect if response status is 401", async () => {
    const errMsg = "Testing err";
    mockErrorResponse({ status: 401, msg: errMsg, url: "/testurl" });
    const { result } = renderComponent({ method: AcceptedMethods.GET });

    act(() => {
      result.current.doFetch();
    });

    await waitFor(() => {
      expect(result.current.fetchState).toEqual(FetchStates.ERROR);
      expect(toasterSpy).toHaveBeenCalledWith("Please login again");
      expect(localStorageClearMock).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it.each([
    { method: AcceptedMethods.GET },
    { method: AcceptedMethods.DELETE },
    { method: AcceptedMethods.POST },
    { method: AcceptedMethods.PUT },
  ])("$method Should send authorized token if true", async ({ method }) => {
    localStorageSetMock.mockReturnValueOnce("mock-token");
    mockRequestResponse({ url: "/testurl", data: { msg: "test" } });
    const { result } = renderComponent({
      authorized: true,
      method,
    });

    act(() => {
      result.current.doFetch();
    });

    await waitFor(() => {
      expect(result.current.fetchState).toEqual(FetchStates.SUCCESS);
      expect(localStorageSetMock).toHaveBeenCalledWith("token");
    });
  });

  it.each([
    { method: AcceptedMethods.GET },
    { method: AcceptedMethods.DELETE },
    { method: AcceptedMethods.POST },
    { method: AcceptedMethods.PUT },
  ])("GET Should return the json data", async ({ method }) => {
    localStorageSetMock.mockReturnValueOnce("mock-token");
    mockRequestResponse({
      url: "/testurl",
      data: { data: { msg: "test message" } },
    });
    const { result } = renderComponent({
      authorized: true,
      method,
    });

    act(() => {
      if (method === "GET") {
        result.current.doFetch();
      } else {
        result.current.doFetch({ msg: "test" });
      }
    });

    await waitFor(() => {
      expect(result.current.fetchState).toEqual(FetchStates.SUCCESS);
      expect(localStorageSetMock).toHaveBeenCalledWith("token");
      expect(result.current.dataRef.current).toEqual({ msg: "test message" });
    });
  });

  it.each([
    { method: AcceptedMethods.DELETE },
    { method: AcceptedMethods.POST },
    { method: AcceptedMethods.PUT },
  ])("POST Should handle file upload", async ({ method }) => {
    const file = new File(["(⌐□_□)"], "chucknorris.png", {
      type: "image/png",
    });
    const formData = new FormData();
    formData.append("file", file);
    mockRequestResponse({ url: "/testurl", data: { data: { msg: "test" } } });
    const { result } = renderComponent({
      method,
      // authorized: true,
    });

    act(() => {
      result.current.doFetch(formData);
    });

    await waitFor(() => {
      fetchSpy;
      expect(fetchSpy).toBeCalledWith(
        "/testurl",
        expect.objectContaining({
          body: formData,
          headers: expect.any(Headers),
          method,
        })
      );
      expect(fetchSpy).toHaveBeenCalledOnce();
      expect(result.current.fetchState).toEqual(FetchStates.SUCCESS);
      expect(result.current.dataRef.current).toEqual({ msg: "test" });
    });
  });
});
