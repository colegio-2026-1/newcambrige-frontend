import axiosClient from "./axiosClient";

const BANDA_URLS = {
  categorias: "/api/banda/categorias",
  ubicaciones: "/api/banda/ubicaciones",
  instrumentos: "/api/banda/instrumentos",
  instrumentoById: (id) => `/api/banda/instrumentos/${id}`,
  instrumentosDisponibles: "/api/banda/instrumentos/disponibles",
  prestamos: "/api/banda/prestamos",
  devolverPrestamo: (id) => `/api/banda/prestamos/${id}/devolver`,
  estadisticas: "/api/banda/estadisticas",
  auditoria: "/api/banda/auditoria",
};

export const bandaService = {
  // ✅ AGREGAMOS ESTA LÍNEA PARA NO DEPENDER DE ENDPOINTS.JS
  getEstudiantes: () => axiosClient.get("/api/estudiantes"), 

  getCategorias: () => axiosClient.get(BANDA_URLS.categorias),
  getUbicaciones: () => axiosClient.get(BANDA_URLS.ubicaciones),
  getInstrumentos: () => axiosClient.get(BANDA_URLS.instrumentos),
  getInstrumentosDisponibles: () => axiosClient.get(BANDA_URLS.instrumentosDisponibles),
  crearInstrumento: (data) => axiosClient.post(BANDA_URLS.instrumentos, data),
  editarInstrumento: (id, data) => axiosClient.put(BANDA_URLS.instrumentoById(id), data),
  eliminarInstrumento: (id) => axiosClient.delete(BANDA_URLS.instrumentoById(id)),
  getPrestamos: () => axiosClient.get(BANDA_URLS.prestamos),
  crearPrestamo: (data) => axiosClient.post(BANDA_URLS.prestamos, data),
  devolverInstrumento: (id, data) => axiosClient.put(BANDA_URLS.devolverPrestamo(id), data),
  getAuditoria: () => axiosClient.get(BANDA_URLS.auditoria),
  getEstadisticas: () => axiosClient.get(BANDA_URLS.estadisticas),
};