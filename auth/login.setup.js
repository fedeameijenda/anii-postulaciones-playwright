import { test } from '@playwright/test';

test('Login y guardar sesión', async ({ page }) => {
  await page.goto(
    'https://postulaciones-ti.anii.org.uy/index.php?convocatoria=FSA_1_2026_1'
  );

  //  login MANUAL local
  await page.pause();

  // Guardar cookies + localStorage
  await page.context().storageState({ path: 'auth.json' });
});
