import { describe, expect, it, vi, afterEach } from "vitest";
import { apiUrl } from "./api";

afterEach(() => vi.unstubAllEnvs());

describe("API configuration", () => {
  it("uses the same-origin versioned proxy by default", () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    expect(apiUrl("health")).toBe("/api/v1/health");
  });
  it("uses the configured backend and normalizes slash boundaries", () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test/api/v1/");
    expect(apiUrl("/health")).toBe("https://api.example.test/api/v1/health");
  });
});
