import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { ConvocatoriaPage } from '../pages/ConvocatoriaPage.js';
import { ContenidoTecnicoGlobalSection } from '../pages/sections/ContenidoTecnicoGlobalSection.js';

// Leer JSON manualmente (ESM-safe)
const configPath = path.resolve('tests/config/FSA_1_2026_1.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

test('Completar contenido técnico global', async ({ page }) => {
  // Login MANUAL
  await page.goto(
  'https://postulaciones-ti.anii.org.uy/index.php?convocatoria=FSA_1_2026_1'
);

//Pausa para login del sistema a mano
await page.pause();

  const convocatoria = new ConvocatoriaPage(page);
  const contenidoTecnico = new ContenidoTecnicoGlobalSection(
    page,
    config.contenidoTecnicoGlobal
  );

  //Ejecución del flujo

  await convocatoria.irASeccion(config.nombreSeccionMenu);
  await contenidoTecnico.completarWysiwygs();
  await contenidoTecnico.guardar();
  await contenidoTecnico.validarGuardado();
});
