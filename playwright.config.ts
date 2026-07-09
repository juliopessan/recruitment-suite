import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: false,
  retries: 1,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://recruitment-suite.vercel.app',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchArgs: [],
      },
    },
  ],

  globalSetup: undefined,
})

export const CHROMIUM_EXECUTABLE = '/opt/pw-browsers/chromium'

export function getChromiumPath(): string {
  return CHROMIUM_EXECUTABLE

  webServer: undefined,
})
