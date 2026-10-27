import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConnectionStatus } from "./ConnectionStatus";

afterEach(() => vi.restoreAllMocks());

describe("development connection status", () => {
  it("shows API and database success independently", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) =>
      String(input).endsWith("/health")
        ? new Response(JSON.stringify({ status: "ok", service: "odd-raven-api", version: "v1" }), { status: 200 })
        : new Response(JSON.stringify({ status: "ok", database: "ok" }), {
            status: 200,
          }),
    );
    render(<ConnectionStatus />);
    await waitFor(() =>
      expect(screen.getByText("API: Connected")).toBeInTheDocument(),
    );
    expect(screen.getByText("Database: Connected")).toBeInTheDocument();
  });

  it("keeps API live when readiness reports an unavailable database", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) =>
      String(input).endsWith("/health")
        ? new Response(JSON.stringify({ status: "ok", service: "odd-raven-api", version: "v1" }), { status: 200 })
        : new Response(
            JSON.stringify({ status: "unavailable", database: "unavailable" }),
            { status: 503 },
          ),
    );
    render(<ConnectionStatus />);
    await waitFor(() =>
      expect(screen.getByText("Database: Unavailable")).toBeInTheDocument(),
    );
    expect(screen.getByText("API: Connected")).toBeInTheDocument();
  });

  it("shows an unreachable API and unknown database on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    render(<ConnectionStatus />);
    await waitFor(() =>
      expect(screen.getByText("API: Unavailable")).toBeInTheDocument(),
    );
    expect(screen.getByText("Database: Unknown")).toBeInTheDocument();
  });
});

describe("connection failure and recovery", () => {
  it.each([
    ["malformed JSON", "<html>not an API</html>"],
    ["wrong service", JSON.stringify({ status: "ok", service: "another-service", version: "v1" })],
    ["missing health fields", JSON.stringify({ status: "ok" })],
    ["contradictory readiness", JSON.stringify({ status: "unavailable", database: "ok" })],
  ])("does not report success for %s", async (_name, body) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(body));
    render(<ConnectionStatus />);
    await waitFor(() => expect(screen.getByText("API: Unavailable")).toBeInTheDocument());
    expect(screen.getByText(/Database: (Unavailable|Unknown)/)).toBeInTheDocument();
  });

  it("updates API health while database verification is still pending", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      if (String(input).endsWith("/health")) {
        return new Response(JSON.stringify({ status: "ok", service: "odd-raven-api", version: "v1" }));
      }
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      });
    });
    render(<ConnectionStatus />);
    await waitFor(() => expect(screen.getByText("API: Connected")).toBeInTheDocument());
    expect(screen.getByText("Database: Checking…")).toBeInTheDocument();
  });

  it("bounds requests with a timeout and handles expiry without crashing", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout").mockImplementation((milliseconds) => {
      expect(milliseconds).toBe(4000);
      const controller = new AbortController();
      setTimeout(() => controller.abort(new DOMException("Timed out", "TimeoutError")), 10);
      return controller.signal;
    });
    vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
      }),
    );
    render(<ConnectionStatus />);
    await waitFor(() => expect(screen.getByText("API: Unavailable")).toBeInTheDocument());
    expect(screen.getByText("Database: Unknown")).toBeInTheDocument();
    expect(timeout).toHaveBeenCalledTimes(2);
  });

  it("recovers on the next poll and stops polling after unmount", async () => {
    vi.useFakeTimers();
    try {
      const request = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
      const view = render(<ConnectionStatus />);
      await act(async () => { await vi.advanceTimersByTimeAsync(0); });
      expect(screen.getByText("API: Unavailable")).toBeInTheDocument();
      request.mockImplementation(async (input) => new Response(JSON.stringify(
        String(input).endsWith("/health")
          ? { status: "ok", service: "odd-raven-api", version: "v1" }
          : { status: "ok", database: "ok" },
      )));
      await act(async () => { await vi.advanceTimersByTimeAsync(15000); });
      expect(screen.getByText("API: Connected")).toBeInTheDocument();
      expect(screen.getByText("Database: Connected")).toBeInTheDocument();
      view.unmount();
      await vi.advanceTimersByTimeAsync(15000);
      expect(request).toHaveBeenCalledTimes(4);
    } finally {
      vi.useRealTimers();
    }
  });
});
