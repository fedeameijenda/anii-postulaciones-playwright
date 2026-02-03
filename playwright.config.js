// @ts-check
import { defineConfig, devices } from '@playwright/test';

import path from 'path';

import * as dotenv from 'dotenv';
dotenv.config();
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });



const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS;



if (process.env.CI && (!BASIC_AUTH_USER || !BASIC_AUTH_PASS)) {
  throw new Error(
    'Faltan variables de entorno BASIC_AUTH_USER / BASIC_AUTH_PASS'
  );
}



/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
   testDir: './tests/flujos', // acá estan los tests
  /* Run tests in files in parallel */
  fullyParallel: true, // se manejan instancias o no separadas del navegador
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0, //se configuró 2 reintentos en CI y 0 reintentos en local
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined, // en CI usa un solo worker, y a nivel local lo decide segun el CPU
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  outputDir: 'test-results/screenshots',
  
  use: {
  httpCredentials: {
    username: /** @type {string} */ (BASIC_AUTH_USER),
    password: /** @type {string} */ (BASIC_AUTH_PASS),
  },
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
  headless: process.env.CI ? true : false,
  storageState: 'auth/auth.json',
  

},

  /* Configure projects for major browsers */
  projects: [
    
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

