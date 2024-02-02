import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { renderHook, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";

describe("Testing UseCopyToClipboard hook", () => {
  afterAll(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const result = renderHook(() => useCopyToClipboard());
    const writeTextMockFn = vi.fn((value: string) => Promise.resolve(value));
    return {
      result,
      writeTextMockFn,
    };
  };

  it("Should copy text with navigator.clipboard", async () => {
    const { result, writeTextMockFn } = renderComponent();

    Object.assign(global.navigator, {
      clipboard: {
        writeText: writeTextMockFn,
      },
    });

    const refText = "copying test";

    act(() => {
      result.result.current.copyToClipboard(refText);
    });

    await waitFor(() => {
      expect(writeTextMockFn).toHaveBeenCalledOnce();
      expect(writeTextMockFn).toHaveBeenCalledWith(refText);
      expect(result.result.current.value).toEqual(refText);
    });
  });

  it("Should copy text with DOM manipulation", async () => {
    const refText = "copying test";
    const { result, writeTextMockFn } = renderComponent();
    const execCopyMock = vi.fn();
    document.execCommand = execCopyMock;
    writeTextMockFn.mockRejectedValueOnce(
      new Error("Write text not supported")
    );
    Object.assign(navigator, { clipboard: undefined });

    act(() => {
      result.result.current.copyToClipboard(refText);
    });

    await waitFor(() => {
      expect(result.result.current.value).toEqual(refText);
      expect(execCopyMock).toHaveBeenCalledWith("copy");
    });
  });
});
