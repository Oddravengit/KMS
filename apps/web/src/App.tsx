import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { destinations } from "./routes";
import { DashboardOverview } from "./components/DashboardOverview";
export function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const page = destinations.find((item) => item.path === location.pathname);
  return (
    <div className={`app-shell${collapsed ? " is-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Sidebar
        collapsed={collapsed}
        toggle={() => setCollapsed((value) => !value)}
      />
      <div className="workspace">
        <Topbar
          title={page?.label ?? "Page not found"}
          subtitle={page?.subtitle ?? "Unknown destination"}
        />
        <main id="main-content" tabIndex={-1}>
          {page?.path === "/" ? <DashboardOverview /> : <section className="workspace-card" aria-label="Page workspace">
            <h2>PAGE NAVIGATION PROTOTYPE</h2>
            <p>
              {page ? (
                `${page.label} ${page.path === "/" ? "KPIs and charts" : "tools"} will be added after component approval.`
              ) : (
                <Link to="/">Return to Dashboard</Link>
              )}
            </p>
            <small>
              Temporary destination screen • Real page components will replace
              this placeholder after approval.
            </small>
            {page?.path === "/orders" &&
              new URLSearchParams(location.search).get("intent") === "new" && (
                <p role="status">
                  New order entry is planned for the Orders module. No order has
                  been created.
                </p>
              )}
          </section>}
        </main>
      </div>
    </div>
  );
}
