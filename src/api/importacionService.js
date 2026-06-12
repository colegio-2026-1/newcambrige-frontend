import axiosClient from "./axiosClient";

// ==============================
// GESTIÓN DE CREDENCIALES
// ==============================
export const obtenerCredencialesRequest = () =>
    axiosClient.get("/api/importacion/credenciales");

export const actualizarCredencialesRequest = (datos) =>
    axiosClient.put("/api/importacion/credenciales", datos);

// ==============================
// EJECUCIÓN DEL SCRAPING
// ==============================
export const iniciarScrapingEstudiantesRequest = () =>
    axiosClient.post("/api/importacion/scraping/estudiantes");

export const iniciarScrapingDocentesRequest = () =>
    axiosClient.post("/api/importacion/scraping/docentes");

// ==============================
// CARGA INDIVIDUAL
// ==============================
export const crearIndividualRequest = (tipo, datos) =>
    axiosClient.post("/api/importacion/carga-individual", { tipo, datos });

// ==============================
// SINCRONIZACIÓN Y CANCELACIÓN
// ==============================
export const sincronizarEstudiantesRequest = (ejecucion_id) =>
    axiosClient.post("/api/importacion/sincronizar-estudiantes", { ejecucion_id });

export const sincronizarDocentesRequest = (ejecucion_id) =>
    axiosClient.post("/api/importacion/sincronizar-docentes", { ejecucion_id });

export const cancelarScrapingRequest = (ejecucion_id, tipo) =>
    axiosClient.delete(`/api/importacion/scraping/cancelar/${ejecucion_id}?tipo=${tipo}`);
