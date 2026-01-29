export class ContenidoTecnicoGlobalSection {
  constructor(page) {
    this.page = page;

    // Botón de grabar
    this.botonGrabar = page.getByRole('button', { name: /grabar/i });

    // Notificación de guardado
    this.mensajeOkSelector = 'div.sl-notification.show';
    this.mensajeOkTexto = 'La información se guardó correctamente';
  }

  // Devuelve el editor WYSIWYG asociado a un textarea
  getEditorPorNombre(nombreCampo) {
    return this.page
      .locator('#' + nombreCampo)
      .locator('xpath=following-sibling::div//div[contains(@class,"note-editable")]');
  }

  // Completa un solo campo
  async completarCampo(nombreCampo, texto) {
    const editor = this.getEditorPorNombre(nombreCampo);
    await editor.click();
    await editor.fill(texto);
  }

  // Completa todos los campos
  async completarCampos(campos) {
    for (const campo of campos) {
      await this.completarCampo(campo.nombre, campo.textoValido);
    }
  }

  // Click en grabar
  async guardar() {
    await this.botonGrabar.click();
  }

  // Devuelve true si se ve mensaje de guardado
  async estaGuardadoCorrectamente(timeout = 10000) {
    try {
      const mensaje = this.page.locator(this.mensajeOkSelector, {
        hasText: this.mensajeOkTexto,
      });
      await mensaje.waitFor({ state: 'visible', timeout }); // espera que aparezca
      return true;
    } catch {
      return false;
    }
  }
}
