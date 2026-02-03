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

test.describe('Contenido Técnico - límite de palabras', () => {

  for (const campo of data.campos) {
    test(`No permite guardar si ${campo.nombre} supera el límite`, async ({ page }, testInfo) => {

      // Ir a la convocatoria
      await page.goto(config.convocatoria.url);
      await page.getByRole('link', { name: /crear nueva propuesta/i }).click();

      const convocatoria = new ConvocatoriaPage(page);
      const contenidoTecnico = new ContenidoTecnicoGlobalSection(page);

      await convocatoria.irASeccion(config.menuSecciones.contenidoTecnico);

      // Completar TODOS los campos: inválido en el que probamos, válido en los demás
      for (const otroCampo of data.campos) {
        await contenidoTecnico.completarCampo(
          otroCampo.nombre,
          otroCampo.nombre === campo.nombre
            ? campo.textoExcedeMaximo
            : otroCampo.textoValido
        );
      }

      await contenidoTecnico.guardar();

      // Validaciones
      expect(await contenidoTecnico.estaGuardadoCorrectamente(3000)).toBeFalsy();
      expect(await contenidoTecnico.campoTieneError(campo.nombre)).toBeTruthy();
      expect(await contenidoTecnico.seMuestraMensajeError(data.mensajes.errorLimitePalabras)).toBeTruthy();

      // Screenshot
      await contenidoTecnico.screenshotCampo(
        campo.nombre,
        `error-limite-${campo.nombre}`,
        testInfo
      );
    });
  }

});
