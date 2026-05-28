import axiosClient from "./axiosClient";

export const allestudiantesRequest = () => axiosClient.get("/api/estudiantes/");
export const allrolesuserRequest = (id) => axiosClient.get(`/api/usuarios/${id}/roles`);
export const allsalonesRequest = () => axiosClient.get("/api/salones/");
export const allmatriculasRequest = () => axiosClient.get("/api/secretaria/matriculas/");
export const allaniosacademicosRequest =() => axiosClient.get("/api/parametros/periodos");
export const crearMatriculaRequest = ({ estudiante_id, periodo_id }) => axiosClient.post(`/api/tesoreria/registrar-pago?estudiante_id=${estudiante_id}&periodo_id=${periodo_id}`, null);
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