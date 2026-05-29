import { bandaService }
from "../../../../api/bandaService";

// =========================================================
// SERVICIO INVENTARIO
// CENTRALIZA TODAS LAS PETICIONES DEL MODULO
// =========================================================

export const inventarioService = {

  // =======================================================
  // GET
  // =======================================================

  getInstrumentos: () =>

    bandaService.getInstrumentos(),

  getCategorias: () =>

    bandaService.getCategorias(),

  getUbicaciones: () =>

    bandaService.getUbicaciones(),

  // =======================================================
  // POST
  // =======================================================

  crearInstrumento: (data) =>

    bandaService.crearInstrumento(
      data
    ),

  // =======================================================
  // PUT
  // =======================================================

  editarInstrumento: (
    id,
    data
  ) =>

    bandaService.editarInstrumento(
      id,
      data
    ),

  // =======================================================
  // DELETE
  // =======================================================

  eliminarInstrumento: (id) =>

    bandaService.eliminarInstrumento(
      id
    ),
};