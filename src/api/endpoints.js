import axiosClient from "./axiosClient";

// ======================
// 📚 BIBLIOTECA
// ======================
export const getLibrosRequest = () =>
  axiosClient.get(`/api/salones/libros`);

export const createLibroRequest = (data) =>
  axiosClient.post(`/api/salones/libros`, data);

export const updateLibroRequest = (id, data) =>
  axiosClient.put(`/api/salones/libros/${id}`, data);

export const deleteLibroRequest = (id) =>
  axiosClient.delete(`/api/salones/libros/${id}`);

export const getPrestamosRequest = () =>
  axiosClient.get(`/api/salones/prestamos`);

// ======================
// 🪑 PUPITRES
// ======================
export const getPupitresRequest = () =>
  axiosClient.get(`/api/salones/pupitres`);

export const updatePupitreRequest = (id, data) =>
  axiosClient.put(`/api/salones/pupitres/${id}`, data);

// ======================
// 🧪 PRUEBAS
// ======================
export const getPruebasRequest = () =>
  axiosClient.get(`/api/salones/pruebas`);

export const createPruebaRequest = (data) =>
  axiosClient.post(`/api/salones/pruebas`, data);

export const updateEstadoPruebaRequest = (id, estado) =>
  axiosClient.put(`/api/salones/pruebas/${id}/estado?estado=${estado}`);

export const allestudiantesRequest = () => axiosClient.get("/api/estudiantes/");
export const allrolesuserRequest = (id) => axiosClient.get(`/api/usuarios/${id}/roles`);
export const allsalonesRequest = () => axiosClient.get("/api/salones/");
export const allmatriculasRequest = () => axiosClient.get("/api/secretaria/matriculas/");
export const allaniosacademicosRequest =() => axiosClient.get("/api/parametros/parametrizacion/anio-escolar");
export const crearMatriculaRequest = ({ estudiante_id, periodo_id }) => axiosClient.post(`/api/tesoreria/registrar-pago?estudiante_id=${estudiante_id}&periodo_id=${periodo_id}`, null);