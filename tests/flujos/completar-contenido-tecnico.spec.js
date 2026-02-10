import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

import { ConvocatoriaPage } from '../pages/ConvocatoriaPage.js';
import { ContenidoTecnicoGlobalSection } from '../pages/sections/ContenidoTecnicoGlobalSection.js';

// Leer JSON
const configPath = path.resolve('tests/config/FSA_1_2026_1.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Leer DATA
const dataPath = path.resolve('tests/data/contenidoTecnicoGlobal.data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

test('Completar contenido técnico global', async ({ page }, testInfo) => {

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
  for (const campo of data.campos) {
    await contenidoTecnico.completarCampo(
      campo.nombre,
      campo.textoValido
    );
  }

  // Guardar
  await contenidoTecnico.guardar();

  // ✅ Validar mensaje de éxito UNA SOLA VEZ (acá sí existe)
  expect(
    await contenidoTecnico.seMuestraMensajeCorrecto()
  ).toBeTruthy();

  // Validar que se guardó correctamente
  const guardado = await contenidoTecnico.estaGuardadoCorrectamente();
  expect(guardado).toBeTruthy();

  await testInfo.attach('guardado-ok', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Navegar a otra sección
  await convocatoria.irASeccion(
    config.menuSecciones.presupuesto
  );

  // Volver a contenido técnico
  await convocatoria.irASeccion(
    config.menuSecciones.contenidoTecnico
  );

  // ✅ Validar persistencia de datos (esto es lo importante)
  for (const campo of data.campos) {
    const valorGuardado =
      await contenidoTecnico.obtenerValorCampo(campo.nombre);

    expect(valorGuardado).toContain(campo.textoValido);
  }

  await testInfo.attach('datos-persistidos', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
