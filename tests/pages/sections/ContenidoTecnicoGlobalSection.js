import { expect } from '@playwright/test';

export class ContenidoTecnicoGlobalSection {
  constructor(page) {
    this.page = page;

    // Cada Summernote está justo después de su textarea
    this.editables = [
      page.locator('#comentario_1').locator('xpath=following-sibling::div//div[@class="note-editable"]'),
      page.locator('#comentario_2').locator('xpath=following-sibling::div//div[@class="note-editable"]'),
      page.locator('#comentario_3').locator('xpath=following-sibling::div//div[@class="note-editable"]'),
    ];

    this.botonGrabar = page.locator(
      '[onclick="return validarDatoEvalGlobal();"]'
    );

    this.mensajeOk = page.locator(
      'text=La información se guardó correctamente'
    );
  }

  async completarWysiwygPorIndice(indice, texto) {
  const editor = this.editables[indice];
  await editor.click();
  await editor.fill(texto);
}



  async guardar() {
    await this.botonGrabar.click();
  }

  async validarGuardado() {
    await expect(this.mensajeOk).toBeVisible();
  }
}
