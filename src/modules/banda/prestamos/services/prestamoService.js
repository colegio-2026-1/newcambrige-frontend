import { bandaService }
from "../../../../api/bandaService";

// ======================================================
// SERVICIO PRESTAMOS
// ======================================================

export const prestamoService = {

  // ====================================================
  // GET
  // ====================================================

  getPrestamos: () =>

    bandaService.getPrestamos(),

  getInstrumentosDisponibles: () =>

    bandaService.getInstrumentosDisponibles(),

  // ====================================================
  // POST
  // ====================================================

  crearPrestamo: (data) =>

    bandaService.crearPrestamo(
      data
    ),

  // ====================================================
  // PUT
  // ====================================================

  devolverInstrumento: (id) =>

    bandaService.devolverInstrumento(
      id
    ),
};