// login_manual.js
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Abrimos la página de login
  await page.goto('https://postulaciones-ti.anii.org.uy/login.php');

  console.log("Hacé login manual en el navegador (usuario, contraseña, captcha si hay).");

  // Espera hasta que completes el login manual
  await page.waitForTimeout(120000); // 2 minutos, ajusta según necesites

  // Guardar el estado de la sesión inmediatamente después del login
  await context.storageState({ path: 'auth.json' });
  console.log("Sesión guardada en auth.json ✅");

  await browser.close();
})();
