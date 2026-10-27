import { NavLink, useLocation } from "react-router-dom";
import { destinations } from "../routes";
import { themes, useTheme } from "../theme/ThemeProvider";
import { Icon } from "./Icon";
import { ConnectionStatus } from "./ConnectionStatus";
export function Sidebar({
  collapsed,
  toggle,
}: {
  collapsed: boolean;
  toggle: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const pathname = location.pathname === "/dashboard" ? "/" : location.pathname;
  const selected = destinations.findIndex((item) => item.path === pathname);
  return (
    <aside className="sidebar" aria-label="Application sidebar">
      <div className="brand-header">
        <span className="brand-mark" aria-hidden="true" />
        <div className="brand-copy" aria-hidden={collapsed}>
          <strong>ODD RAVEN</strong>
          <small>DTF ERP</small>
        </div>
        <button
          className="collapse-button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <Icon name="collapse" />
        </button>
      </div>
      <nav aria-label="Main navigation">
        <div className="nav-list">
          {selected >= 0 && (
            <span
              className="nav-indicator"
              style={{ transform: `translateY(${selected * 54}px)` }}
            />
          )}
          {destinations.map((item) => (
            <NavLink
              key={item.path}
              to={item.path === "/" && location.pathname === "/dashboard" ? "/dashboard" : item.path}
              end
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
            >
              <Icon name={item.icon} monochrome />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <fieldset className="theme-switcher">
        <legend>Appearance</legend>
        <div className="theme-options">
          <span
            className="theme-indicator"
            style={{ transform: `translateX(${themes.indexOf(theme) * 100}%)` }}
          />
          {themes.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={theme === option}
              onClick={() => setTheme(option)}
              title={option}
            >
              {collapsed
                ? option[0].toUpperCase()
                : option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </fieldset>
      {import.meta.env.DEV && <ConnectionStatus />}
    </aside>
  );
}
