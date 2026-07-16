import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL,
    trace: "on-first-retry",
    video: process.env.PLAYWRIGHT_VIDEO === "1" ? "on" : "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1"
    ? undefined
    : {
        command: "./node_modules/.bin/next dev",
        url: baseURL,
        reuseExistingServer: true,
      },
});
