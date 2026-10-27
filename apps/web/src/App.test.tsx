import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { ThemeProvider } from "./theme/ThemeProvider";
function setup(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>,
  );
}
describe("desktop shell", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
  });
  afterEach(() => vi.restoreAllMocks());
  it("renders the login placeholder without collecting credentials", async () => {
    const user = userEvent.setup();
    setup("/login");
    expect(screen.getByRole("heading", { name: "Login placeholder" })).toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "View Dashboard preview" }));
    expect(screen.getByRole("heading", { name: "Today at a glance" })).toBeInTheDocument();
  });
  it("renders the direct dashboard alias with the active sidebar destination", () => {
    setup("/dashboard");
    expect(screen.getByRole("heading", { name: "Today at a glance" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
  });
  it("shows the static dashboard overview without implying live data", () => {
    setup();
    expect(screen.getByRole("heading", { name: "Today at a glance", level: 2 })).toBeInTheDocument();
    expect(screen.getByText("DEMO DATA")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Recent order activity" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Quick action: new order" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Messages" })).toBeInTheDocument();
  });
  it("preserves route selection and content across collapse and expand", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("link", { name: "Customers" }));
    const brand = screen.getByText("ODD RAVEN");
    const header = brand.closest(".brand-header");
    const toggle = screen.getByRole("button", { name: "Collapse sidebar" });
    await user.click(toggle);
    expect(brand.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("button", { name: "Expand sidebar" })).toBe(toggle);
    expect(brand.closest(".brand-header")).toBe(header);
    expect(screen.getByRole("banner")).toHaveTextContent("Customers");
    expect(screen.getByRole("link", { name: "Customers" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(brand.parentElement).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByRole("button", { name: "Collapse sidebar" })).toBe(toggle);
    expect(screen.getByRole("banner")).toHaveTextContent("Customers");
  });
  it("applies all themes and restores the saved preference", async () => {
    const user = userEvent.setup();
    const view = setup();
    for (const theme of ["Dark", "Glass", "Light"]) {
      await user.click(screen.getByRole("button", { name: theme }));
      expect(document.documentElement.dataset.theme).toBe(theme.toLowerCase());
    }
    await user.click(screen.getByRole("button", { name: "Dark" }));
    view.unmount();
    setup();
    expect(screen.getByRole("button", { name: "Dark" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
  it("supports direct destinations and unknown routes", () => {
    setup("/missing");
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to Dashboard" })).toHaveAttribute("href", "/dashboard");
  });
  it("opens the orders destination without pretending an order was created", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("link", { name: "New Order" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "No order has been created",
    );
  });
  it("focuses search with Ctrl+K and navigates using results", async () => {
    const user = userEvent.setup();
    setup();
    await user.keyboard("{Control>}k{/Control}");
    const search = screen.getByRole("textbox", {
      name: "Search workspace pages",
    });
    expect(search).toHaveFocus();
    await user.type(search, "reports");
    await user.click(screen.getAllByRole("link", { name: "Reports" })[1]);
    expect(screen.getByRole("banner")).toHaveTextContent("Reports");
  });
});
