// src/api/endpoints.js

import axiosClient from "./axiosClient";

// ==============================
// ENDPOINTS URLs
// ==============================

const API_ENDPOINTS = {
  // ======== SALON (Clases) ========
  SALON: {
    LIST: "/api/salones",
    GET: (id) => `/api/salones/${id}`,
    BY_GRADO_GRUPO: (grado, grupo) => `/api/salones/grado/${grado}/grupo/${grupo}`,
    CREATE: "/api/salones",
    UPDATE: (id) => `/api/salones/${id}`,
    DELETE: (id) => `/api/salones/${id}`,
  },

  // ======== PRUEBA ========
  PRUEBA: {
    LIST: "/api/salones/pruebas",
    GET: (id) => `/api/salones/pruebas/${id}`,
    CREATE: "/api/salones/pruebas",
    UPDATE: (id) => `/api/salones/pruebas/${id}`,
    DELETE: (id) => `/api/salones/pruebas/${id}`,
  },

  // ======== PUPITRE ========
  PUPITRE: {
    LIST: "/api/salones/pupitres",
    GET: (id) => `/api/salones/pupitres/${id}`,
    CREATE: "/api/salones/pupitres",
    UPDATE: (id) => `/api/salones/pupitres/${id}`,
    DELETE: (id) => `/api/salones/pupitres/${id}`,
  },

  // ======== BIBLIOTECA (Inventario Libro) ========
  BIBLIOTECA: {
    LIST: "/api/salones/libros",
    GET: (id) => `/api/salones/libros/${id}`,
    CREATE: "/api/salones/libros",
    UPDATE: (id) => `/api/salones/libros/${id}`,
    DELETE: (id) => `/api/salones/libros/${id}`,
    PRESTAMOS: "/api/salones/prestamos",
    CREAR_PRESTAMO: "/api/salones/prestamos",
  },
};

// ==============================
// FUNCIONES SALON
// ==============================

// Listar todos los salones
export const getSalonesRequest = (skip = 0, limit = 100) =>
  axiosClient.get(API_ENDPOINTS.SALON.LIST, {
    params: { skip, limit },
  });

// Obtener un salón por ID
export const getSalonRequest = (salonId) =>
  axiosClient.get(API_ENDPOINTS.SALON.GET(salonId));

// Obtener salones por grado y grupo
export const getSalonesByGradoGrupoRequest = (grado, grupo) =>
  axiosClient.get(API_ENDPOINTS.SALON.BY_GRADO_GRUPO(grado, grupo));

// Crear salón
export const createSalonRequest = (data) =>
  axiosClient.post(API_ENDPOINTS.SALON.CREATE, data);

// Actualizar salón
export const updateSalonRequest = (salonId, data) =>
  axiosClient.put(API_ENDPOINTS.SALON.UPDATE(salonId), data);

// Eliminar salón
export const deleteSalonRequest = (salonId) =>
  axiosClient.delete(API_ENDPOINTS.SALON.DELETE(salonId));

// ==============================
// FUNCIONES PRUEBA
// ==============================

export const getPruebasRequest = () =>
  axiosClient.get(API_ENDPOINTS.PRUEBA.LIST);

export const getPruebaRequest = (pruebaId) =>
  axiosClient.get(API_ENDPOINTS.PRUEBA.GET(pruebaId));

export const createPruebaRequest = (data) =>
  axiosClient.post(API_ENDPOINTS.PRUEBA.CREATE, data);

export const updatePruebaRequest = (pruebaId, data) =>
  axiosClient.put(API_ENDPOINTS.PRUEBA.UPDATE(pruebaId), data);

export const deletePruebaRequest = (pruebaId) =>
  axiosClient.delete(API_ENDPOINTS.PRUEBA.DELETE(pruebaId));

// ==============================
// FUNCIONES PUPITRE
// ==============================

export const getPupitresRequest = () =>
  axiosClient.get(API_ENDPOINTS.PUPITRE.LIST);

export const getPupitreRequest = (pupitreId) =>
  axiosClient.get(API_ENDPOINTS.PUPITRE.GET(pupitreId));

export const createPupitreRequest = (data) =>
  axiosClient.post(API_ENDPOINTS.PUPITRE.CREATE, data);

export const updatePupitreRequest = (pupitreId, data) =>
  axiosClient.put(API_ENDPOINTS.PUPITRE.UPDATE(pupitreId), data);

export const deletePupitreRequest = (pupitreId) =>
  axiosClient.delete(API_ENDPOINTS.PUPITRE.DELETE(pupitreId));

// ==============================
// FUNCIONES BIBLIOTECA
// ==============================

export const getLibrosRequest = () =>
  axiosClient.get(API_ENDPOINTS.BIBLIOTECA.LIST);

export const getLibroRequest = (libroId) =>
  axiosClient.get(API_ENDPOINTS.BIBLIOTECA.GET(libroId));

export const createLibroRequest = (data) =>
  axiosClient.post(API_ENDPOINTS.BIBLIOTECA.CREATE, data);

export const updateLibroRequest = (libroId, data) =>
  axiosClient.put(API_ENDPOINTS.BIBLIOTECA.UPDATE(libroId), data);

export const deleteLibroRequest = (libroId) =>
  axiosClient.delete(API_ENDPOINTS.BIBLIOTECA.DELETE(libroId));

export const getPrestamosRequest = () =>
  axiosClient.get(API_ENDPOINTS.BIBLIOTECA.PRESTAMOS);

export const createPrestamoRequest = (data) =>
  axiosClient.post(API_ENDPOINTS.BIBLIOTECA.CREAR_PRESTAMO, data);

export default API_ENDPOINTS;