import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { destinations } from "./routes";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
export function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname === "/dashboard" ? "/" : location.pathname;
  const page = destinations.find((item) => item.path === pathname);
  const isLogin = pathname === "/login";
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
          title={isLogin ? "Login" : page?.label ?? "Page not found"}
          subtitle={isLogin ? "Authentication preview" : page?.subtitle ?? "Unknown destination"}
        />
        <main id="main-content" tabIndex={-1}>
          {isLogin ? (
            <LoginPage />
          ) : !page ? (
            <NotFoundPage />
          ) : page.path === "/" ? (
            <DashboardPage />
          ) : (
            <section className="workspace-card" aria-label="Page workspace">
              <h2>PAGE NAVIGATION PROTOTYPE</h2>
              <p>{`${page.label} tools will be added after component approval.`}</p>
              <small>
                Temporary destination screen • Real page components will replace
                this placeholder after approval.
              </small>
              {page.path === "/orders" &&
                new URLSearchParams(location.search).get("intent") === "new" && (
                  <p role="status">
                    New order entry is planned for the Orders module. No order has
                    been created.
                  </p>
                )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
