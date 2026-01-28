export class ConvocatoriaPage {
  constructor(page) {
    this.page = page;
  }

  async abrir(convocatoriaId) {
    await this.page.goto(`https://postulaciones-ti.anii.org.uy/index.php?convocatoria=${convocatoriaId}`);
  }

  async irASeccion(nombreSeccion) {
    const link = this.page.locator(`text=${nombreSeccion}`);
    await link.click();
  }
}
