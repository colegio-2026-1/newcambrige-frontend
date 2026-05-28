const BANDA = {
  categorias: "/api/banda/categorias",
  ubicaciones: "/api/banda/ubicaciones",
  instrumentos: "/api/banda/instrumentos",
  instrumentoById: (id) => `/api/banda/instrumentos/${id}`,
  instrumentosDisponibles: "/api/banda/instrumentos/disponibles",
  prestamos: "/api/banda/prestamos",
  prestamoById: (id) => `/api/banda/prestamos/${id}`,
  devolverPrestamo: (id) => `/api/banda/prestamos/${id}/devolver`,
  estadisticas: "/api/banda/estadisticas",
};

export const endpoints = {
  BANDA,
};