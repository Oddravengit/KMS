import { useEffect, useState } from "react";
import { apiUrl } from "../services/api";

type State = "checking" | "connected" | "unavailable" | "unknown";

function label(state: State) {
  return {
    checking: "Checking…",
    connected: "Connected",
    unavailable: "Unavailable",
    unknown: "Unknown",
  }[state];
}

async function checkApi(signal: AbortSignal): Promise<State> {
  try {
    const response = await fetch(apiUrl("health"), {
      signal: AbortSignal.any([signal, AbortSignal.timeout(4000)]),
    });
    if (!response.ok) return "unavailable";
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null && "status" in body && body.status === "ok" &&
      "service" in body && body.service === "odd-raven-api" &&
      "version" in body && body.version === "v1"
      ? "connected"
      : "unavailable";
  } catch {
    return "unavailable";
  }
}

async function checkDatabase(signal: AbortSignal): Promise<State> {
  try {
    const response = await fetch(apiUrl("ready"), {
      signal: AbortSignal.any([signal, AbortSignal.timeout(4000)]),
    });
    const body: unknown = await response.json();
    return response.ok && typeof body === "object" && body !== null && "status" in body && body.status === "ok" &&
      "database" in body && body.database === "ok"
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
    const controller = new AbortController();
    const refresh = async () => {
      await Promise.all([
        checkApi(controller.signal).then((state) => {
          if (active) setApi(state);
        }),
        checkDatabase(controller.signal).then((state) => {
          if (active) setDatabase(state);
        }),
      ]);
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => {
      active = false;
      controller.abort();
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
