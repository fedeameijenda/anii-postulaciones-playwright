import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { ConvocatoriaPage } from '../pages/ConvocatoriaPage.js';
import { ContenidoTecnicoGlobalSection } from '../pages/sections/ContenidoTecnicoGlobalSection.js';

// Leer JSON
const configPath = path.resolve('tests/config/FSA_1_2026_1.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

test('Completar contenido técnico global', async ({ page }) => {

  // Abrir convocatoria
  await page.goto(config.convocatoria.url);

  
  const crearBtn = page.getByRole('link', {
  name: /crear nueva propuesta/i,
  });
  await crearBtn.click();




  const convocatoria = new ConvocatoriaPage(page);
  const contenidoTecnico = new ContenidoTecnicoGlobalSection(page);

  // Ir a sección "Contenido técnico"
  await convocatoria.irASeccion(
    config.menuSecciones.contenidoTecnico
  );

  // Completar campos uno por uno
  for (let i = 0; i < config.contenidoTecnicoGlobal.campos.length; i++) {
    const campo = config.contenidoTecnicoGlobal.campos[i];
    await contenidoTecnico.completarCampo(campo.nombre, campo.textoValido);
  }

  // Guardar
  await contenidoTecnico.guardar();

  // Validar que se guardó correctamente
  const guardado = await contenidoTecnico.estaGuardadoCorrectamente();
  expect(guardado).toBeTruthy();
});
