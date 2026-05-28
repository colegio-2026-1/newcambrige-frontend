import { bandaService }
from "../../../../api/bandaService";

export const inventarioService = {

  getInstrumentos:
    () =>
      bandaService.getInstrumentos(),

  getCategorias:
    () =>
      bandaService.getCategorias(),

  getUbicaciones:
    () =>
      bandaService.getUbicaciones(),

  crearInstrumento:
    (data) =>
      bandaService.crearInstrumento(
        data
      ),

  editarInstrumento:
    (id, data) =>
      bandaService.editarInstrumento(
        id,
        data
      ),

  eliminarInstrumento:
    (id) =>
      bandaService.eliminarInstrumento(
        id
      ),
};