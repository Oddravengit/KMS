import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Breadcrumb } from "./Breadcrumb";
import { DashboardSectionContainer } from "./DashboardSectionContainer";
import { PageHeader } from "./PageHeader";

describe("shared layout components", () => {
  it("renders breadcrumb links and marks the current page", () => {
    render(<MemoryRouter><Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Orders", href: "/orders" }, { label: "Details" }]} /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("href", "/orders");
    expect(screen.getByText("Details")).toHaveAttribute("aria-current", "page");
  });

  it("renders a page header with optional actions", () => {
    render(<PageHeader title="Orders" subtitle="Manage orders" actions={<button type="button">New Order</button>} />);
    expect(screen.getByRole("heading", { name: "Orders" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New Order" })).toBeInTheDocument();
  });

  it("exposes loading, empty and error section states", () => {
    const { rerender } = render(<DashboardSectionContainer title="Activity" state="loading" />);
    expect(screen.getByRole("status", { name: "Activity loading" })).toBeInTheDocument();
    rerender(<DashboardSectionContainer title="Activity" state="empty" emptyMessage="Nothing here" />);
    expect(screen.getByRole("status")).toHaveTextContent("Nothing here");
    rerender(<DashboardSectionContainer title="Activity" state="error" errorMessage="Try again" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Try again");
  });
});
