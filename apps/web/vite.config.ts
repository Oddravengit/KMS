import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
const env = (
  globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env;
const codespaceName = env?.CODESPACE_NAME;
const forwardingDomain = env?.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
const forwardedHost =
  codespaceName && forwardingDomain
    ? `${codespaceName}-5173.${forwardingDomain}`
    : undefined;

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    ...(forwardedHost ? { allowedHosts: [forwardedHost] } : {}),
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
  test: { environment: "jsdom", setupFiles: "./src/test-setup.ts" },
});
