import assert from "node:assert/strict";

// Run against the real API and its Vite proxy; never creates mock services.
const databaseUnavailable = process.argv.includes("--database-unavailable");
const targets = [
  ["backend", process.env.KMS_SMOKE_BACKEND_URL || "http://127.0.0.1:8000"],
  ["frontend proxy", process.env.KMS_SMOKE_FRONTEND_URL || "http://127.0.0.1:5173"],
];
for (const [name, base] of targets) {
  for (const endpoint of ["health", "ready"]) {
    const response = await fetch(`${base.replace(/\/$/, "")}/api/v1/${endpoint}`, {
      signal: AbortSignal.timeout(5000),
    });
    const unavailable = endpoint === "ready" && databaseUnavailable;
    assert.equal(response.status, unavailable ? 503 : 200, `${name} ${endpoint}: HTTP status`);
    assert.deepEqual(await response.json(), endpoint === "health"
      ? { status: "ok", service: "odd-raven-api", version: "v1" }
      : unavailable
        ? { status: "unavailable", database: "unavailable" }
        : { status: "ok", database: "ok" }, `${name} ${endpoint}: response contract`);
    console.log(`${name} ${endpoint}: HTTP ${response.status}, contract passed`);
  }
}
