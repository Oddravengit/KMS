import { useEffect, useState } from "react";

type State = "checking" | "connected" | "unavailable" | "unknown";

function label(state: State) {
  return {
    checking: "Checking…",
    connected: "Connected",
    unavailable: "Unavailable",
    unknown: "Unknown",
  }[state];
}

async function checkApi(): Promise<State> {
  try {
    const response = await fetch("/api/v1/health", {
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return "unavailable";
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null && "status" in body && body.status === "ok"
      ? "connected"
      : "unavailable";
  } catch {
    return "unavailable";
  }
}

async function checkDatabase(): Promise<State> {
  try {
    const response = await fetch("/api/v1/ready", {
      signal: AbortSignal.timeout(4000),
    });
    const body: unknown = await response.json();
    return response.ok && typeof body === "object" && body !== null && "database" in body && body.database === "ok"
      ? "connected"
      : "unavailable";
  } catch {
    return "unknown";
  }
}

export function ConnectionStatus() {
  const [api, setApi] = useState<State>("checking");
  const [database, setDatabase] = useState<State>("checking");

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const [apiState, databaseState] = await Promise.all([
        checkApi(),
        checkDatabase(),
      ]);
      if (active) {
        setApi(apiState);
        setDatabase(databaseState);
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="connection-status" aria-label="Development connections">
      <strong>Development connections</strong>
      <span aria-live="polite">API: {label(api)}</span>
      <span aria-live="polite">Database: {label(database)}</span>
    </section>
  );
}
