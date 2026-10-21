import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConnectionStatus } from "./ConnectionStatus";

afterEach(() => vi.restoreAllMocks());

describe("development connection status", () => {
  it("shows API and database success independently", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) =>
      String(input).endsWith("/health")
        ? new Response(JSON.stringify({ status: "ok" }), { status: 200 })
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
        ? new Response(JSON.stringify({ status: "ok" }), { status: 200 })
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
