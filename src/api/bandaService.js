import axiosClient from "./axiosClient";
import { endpoints } from "./endpoints";

const { BANDA } = endpoints;

export const bandaService = {
  // Categorías
  getCategorias: () => axiosClient.get(BANDA.categorias),

  // Ubicaciones
  getUbicaciones: () => axiosClient.get(BANDA.ubicaciones),

  // Instrumentos
  getInstrumentos: () => axiosClient.get(BANDA.instrumentos),
  getInstrumentosDisponibles: () => axiosClient.get(BANDA.instrumentosDisponibles),
  crearInstrumento: (data) => axiosClient.post(BANDA.instrumentos, data),
  editarInstrumento: (id, data) => axiosClient.put(BANDA.instrumentoById(id), data),
  eliminarInstrumento: (id) => axiosClient.delete(BANDA.instrumentoById(id)),

  // Préstamos
  getPrestamos: () => axiosClient.get(BANDA.prestamos),
  crearPrestamo: (data) => axiosClient.post(BANDA.prestamos, data),
  devolverInstrumento: (id, data) => axiosClient.put(BANDA.devolverPrestamo(id), data),

// ✅ CAMBIAR ESTO PARA USAR EL ENDPOINT GLOBAL
  getAuditoria: () => axiosClient.get(BANDA.auditoria),

  getEstadisticas: () => axiosClient.get(BANDA.estadisticas),
  
  // Estadísticas
  getEstadisticas: () => axiosClient.get(BANDA.estadisticas),
};