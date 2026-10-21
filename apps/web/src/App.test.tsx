import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
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
  it("preserves route selection and content across collapse and expand", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole("link", { name: "Customers" }));
    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(
      screen.getByRole("heading", { name: "Customers", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Customers" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(
      screen.getByRole("heading", { name: "Customers", level: 1 }),
    ).toBeInTheDocument();
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
    expect(
      screen.getByRole("heading", { name: "Page not found", level: 1 }),
    ).toBeInTheDocument();
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
    expect(
      screen.getByRole("heading", { name: "Reports", level: 1 }),
    ).toBeInTheDocument();
  });
});
