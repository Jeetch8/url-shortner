import { useFetch, FetchStates, AcceptedMethods } from "@/hooks/useFetch";
import { act, renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { mockErrorResponse, mockRequestResponse } from "../utils";
import toast, { Toaster } from "react-hot-toast";
import { makeServer } from "../mocks/server";
import { Server } from "miragejs";
import { MockInstance } from "vitest";
import { base_url } from "@/utils/base_url";

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

vi.spyOn(Storage.prototype, "getItem").mockResolvedValue("token");

describe("Testing useFetch hook", () => {
  let toasterSpy: MockInstance;
  let localStorageClearMock: MockInstance;
  let localStorageSetMock: MockInstance;
  beforeAll(() => {
    toasterSpy = vi.spyOn(toast, "error");
    localStorageClearMock = vi.spyOn(Storage.prototype, "clear");
    localStorageSetMock = vi.spyOn(Storage.prototype, "getItem");
  });
  let server: Server;

  beforeEach(() => {
    vi.clearAllMocks();
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
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
          url: base_url + "/hooktesturl",
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

  it("'GET' Should return error when fetch fail", async () => {
    const errMsg = "Testing error";
    mockErrorResponse({
      server,
      route: "/hooktesturl",
      msg: errMsg,
      method: AcceptedMethods.GET,
      status: 500,
    });
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
  ])(
    "$method Should redirect if response status is 401",
    async ({ method }) => {
      const errMsg = "Testing err";
      mockErrorResponse({
        status: 401,
        msg: errMsg,
        route: "/hooktesturl",
        server,
        method,
      });
      const { result } = renderComponent({ method });

      act(() => {
        result.current.doFetch();
      });

      await waitFor(() => {
        expect(result.current.fetchState).toEqual(FetchStates.ERROR);
        expect(toasterSpy).toHaveBeenCalledWith("Please login again");
        expect(localStorageClearMock).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    }
  );

  it.each([
    { method: AcceptedMethods.GET },
    { method: AcceptedMethods.DELETE },
    { method: AcceptedMethods.POST },
    { method: AcceptedMethods.PUT },
    { method: AcceptedMethods.PATCH },
  ])("$method Should send authorized token if true", async ({ method }) => {
    localStorageSetMock.mockReturnValueOnce("mock-token");
    mockRequestResponse({
      route: "/hooktesturl",
      data: { data: { msg: "test" } },
      server,
      method,
    });
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
  ])("$method Should return the json data", async ({ method }) => {
    const testData = { msg: "test message" };
    localStorageSetMock.mockReturnValueOnce("mock-token");
    mockRequestResponse({
      route: "/hooktesturl",
      data: { data: testData },
      server,
      status: 200,
      method,
    });
    const { result } = renderComponent({
      authorized: true,
      method,
    });

    act(() => {
      if (method === "GET") {
        result.current.doFetch();
      } else {
        result.current.doFetch(testData);
      }
    });

    await waitFor(() => {
      expect(result.current.fetchState).toEqual(FetchStates.SUCCESS);
      expect(localStorageSetMock).toHaveBeenCalledWith("token");
      expect(result.current.dataRef.current).toEqual(testData);
    });
  });

  it.each([
    { method: AcceptedMethods.DELETE },
    { method: AcceptedMethods.POST },
    { method: AcceptedMethods.PUT },
    { method: AcceptedMethods.DELETE, isAuthorized: true },
    { method: AcceptedMethods.POST, isAuthorized: true },
    { method: AcceptedMethods.PUT, isAuthorized: true },
  ])("$method Should handle file upload", async ({ method, isAuthorized }) => {
    const testData = { msg: "test message" };
    localStorageSetMock.mockReturnValueOnce("mock-token");
    const fetchSpy = vi.spyOn(window, "fetch");
    const file = new File(["(⌐□_□)"], "chucknorris.png", {
      type: "image/png",
    });
    const formData = new FormData();
    formData.append("file", file);
    mockRequestResponse({
      route: "/hooktesturl",
      data: { data: testData },
      method,
      server,
      status: 200,
    });
    const { result } = renderComponent({
      method,
      authorized: isAuthorized === undefined ? false : isAuthorized,
    });

    act(() => {
      result.current.doFetch(formData);
    });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledOnce();
      expect(fetchSpy).toBeCalledWith(
        base_url + "/hooktesturl",
        expect.objectContaining({
          body: formData,
          headers: expect.any(Headers),
          method,
        })
      );
      expect(result.current.fetchState).toEqual(FetchStates.SUCCESS);
      expect(result.current.dataRef.current).toEqual(testData);
    });
  });
});
