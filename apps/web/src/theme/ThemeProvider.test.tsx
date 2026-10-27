import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function Controls() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme("glass")}>{theme}</button>;
}

afterEach(() => vi.restoreAllMocks());

describe("safe theme preferences", () => {
  it("rejects an invalid saved preference", () => {
    localStorage.setItem("kms.theme", "unknown");
    render(<ThemeProvider><Controls /></ThemeProvider>);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("kms.theme")).toBe("light");
  });
  it("starts safely when reading browser storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<ThemeProvider><Controls /></ThemeProvider>);
    expect(screen.getByRole("button", { name: "light" })).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("light");
  });
  it("still switches themes when saving preferences fails", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    render(<ThemeProvider><Controls /></ThemeProvider>);
    fireEvent.click(screen.getByRole("button", { name: "light" }));
    expect(document.documentElement.dataset.theme).toBe("glass");
    expect(screen.getByRole("button", { name: "glass" })).toBeInTheDocument();
  });
});
