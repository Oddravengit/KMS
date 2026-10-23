import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { destinations } from "../routes";
import { Icon } from "./Icon";
import { TopbarIconButton } from "./TopbarIconButton";
export function Topbar({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  return (
    <header className="topbar">
      <div className="page-context">
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </div>
      <div className="topbar-actions">
        <div className="search-wrapper">
          <label className="search">
            <Icon name="search" />
            <input
              ref={input}
              aria-label="Search workspace pages"
              placeholder="Search orders, customers, designs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  input.current?.blur();
                }
              }}
            />
            <kbd>Ctrl +k</kbd>
          </label>
          {query && (
            <div className="search-results" aria-label="Page search results">
              <small>Workspace pages</small>
              {destinations
                .filter((d) =>
                  d.label.toLowerCase().includes(query.toLowerCase()),
                )
                .map((d) => (
                  <Link key={d.path} to={d.path} onClick={() => setQuery("")}>
                    {d.label}
                  </Link>
                ))}
              {!destinations.some((d) =>
                d.label.toLowerCase().includes(query.toLowerCase()),
              ) && <p>No pages found</p>}
            </div>
          )}
        </div>
        <Link className="new-order" to="/orders?intent=new">
          <Icon name="plus" />
          New Order
        </Link>
        <TopbarIconButton kind="quick-action" label="Quick action: new order" to="/orders?intent=new" />
        <details className="messages">
          <summary role="button" aria-label="Messages">
            <TopbarIconButton kind="messages" label="Messages" interactive={false} />
          </summary>
          <div className="popover">Messages will appear when the backend is connected.</div>
        </details>
        <details className="notifications">
          <summary aria-label="Notifications">
            <Icon name="notification" />
          </summary>
          <div className="popover">
            Notifications will appear when the backend is connected.
          </div>
        </details>
        <details className="profile">
          <summary aria-label="Admin profile">
            <span className="avatar">
              <Icon name="user" />
            </span>
            <span className="profile-copy">
              <strong>Admin</strong>
              <small>Administrator</small>
            </span>
            <Icon name="down" />
          </summary>
          <div className="popover">
            Frontend preview · Demo administrator
            <Link to="/settings">Workspace settings</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
