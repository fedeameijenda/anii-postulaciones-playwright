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

  async completarCampo(nombreCampo, texto) {
  const editor = this.getEditorPorNombre(nombreCampo);

  // Esperar que esté visible
  await editor.waitFor({ state: 'visible', timeout: 15000 });

  // Hacer scroll para asegurar que Playwright pueda clickear
  await editor.scrollIntoViewIfNeeded();

  // Click seguro usando evaluate
  await editor.evaluate(el => el.focus());

  // Llenar el contenido
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
  const mensajes = this.page.locator(
    'div.sl-notification.show',
    { hasText: this.mensajeOkTexto }
  );

  // Devuelve false si no aparece el mensaje en X tiempo
try {
  await mensajes.first().waitFor({ state: 'attached', timeout });
  return true;
} catch {
  return false;
}
  
}

  async campoTieneError(nombreCampo) {
  const editor = this.getEditorPorNombre(nombreCampo);

  // el div padre tiene el borde rojo
  const contenedor = editor.locator('xpath=ancestor::div[contains(@style,"border")]');

  return await contenedor.evaluate(el =>
    getComputedStyle(el).borderColor === 'rgb(255, 0, 0)'
  );
}
async obtenerValorCampo(nombreCampo) {
  const campo = this.page.locator(
    `#${nombreCampo}`
  ).locator(
    'xpath=following-sibling::div//div[contains(@class,"note-editable")]'
  );

  await campo.waitFor({ state: 'visible' });

  return await campo.innerText();
}
// Devuelve el contenedor visual del campo
getContenedorCampo(nombreCampo) {
  const editor = this.getEditorPorNombre(nombreCampo);

  return editor.locator(
    'xpath=ancestor::div[contains(@style,"border")]'
  );
}

// 📸 Screenshot del campo específico (con error)
async screenshotCampo(nombreCampo, nombreArchivo, testInfo) {
  const contenedor = this.getContenedorCampo(nombreCampo);

  // aseguramos que esté visible en pantalla
  await contenedor.scrollIntoViewIfNeeded();

  await testInfo.attach(nombreArchivo, {
    body: await contenedor.screenshot(),
    contentType: 'image/png',
  });
}

  async seMuestraNotificacion(textoEsperado, timeout = 3000) {
  const mensaje = this.page.locator(
    'div.sl-notification.show',
    { hasText: textoEsperado }
  );

  try {
    await mensaje.first().waitFor({ state: 'attached', timeout });
    return true;
  } catch {
    return false;
  }
}

async seMuestraMensajeCorrecto(timeout = 3000) {
  return await this.seMuestraNotificacion(
    this.mensajeOkTexto,
    timeout
  );
}

async seMuestraMensajeError(textoError, timeout = 3000) {
  return await this.seMuestraNotificacion(
    textoError,
    timeout
  );
}


}
