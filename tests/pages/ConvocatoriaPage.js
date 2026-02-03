export class ConvocatoriaPage {
  constructor(page) {
    this.page = page;
  }

  async abrir(convocatoriaId) {
    await this.page.goto(`https://postulaciones-ti.anii.org.uy/index.php?convocatoria=${convocatoriaId}`);
  }

  async irASeccion(nombreSeccion) {
  const boton = this.page.getByRole('button', {
    name: new RegExp(nombreSeccion, 'i'),
  });

  await boton.waitFor({ state: 'visible', timeout: 20000 });
  await boton.scrollIntoViewIfNeeded();
  await boton.click();
}
}
