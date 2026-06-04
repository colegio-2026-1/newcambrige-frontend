
import axiosClient from "./axiosClient";

export const allrolesuserRequest = (id) => axiosClient.get(`/api/usuarios/${id}/roles`);
export const allaniosacademicosRequest =() => axiosClient.get("/api/parametrizacion/anio-escolar");

export const allsalonesRequest = () => axiosClient.get("/api/salones/");
export const allmatriculasRequest = () => axiosClient.get("/api/secretaria/matriculas/");
export const allaniosacademicosRequest =() => axiosClient.get("/api/parametros/periodos");
export const crearMatriculaRequest = ({ estudiante_id, periodo_id }) => axiosClient.post(`/api/tesoreria/registrar-pago?estudiante_id=${estudiante_id}&periodo_id=${periodo_id}`, null);

