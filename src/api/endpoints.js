import axiosClient from "./axiosClient";

export const allrolesuserRequest = (id) => axiosClient.get(`/api/usuarios/${id}/roles`);
export const allaniosacademicosRequest =() => axiosClient.get("/api/parametros/parametrizacion/anio-escolar");
export const crearMatriculaRequest = ( estudiante_id, periodo_id ) => axiosClient.post(`/api/secretaria/matriculas`, {
    id_estudiante: estudiante_id,
    id_periodo: periodo_id
  });

export const alltipoconceptoRequest =() => axiosClient.get("/api/secretaria/tipos-concepto");
export const allestudiantesbyperiodoRequest = (id_periodo) => axiosClient.get(`/api/estudiantes/periodo/${id_periodo}`);
export const allsalonesbyperiodoRequest = (id_periodo) => axiosClient.get(`/api/salones/periodo/${id_periodo}`);
export const allmatriculasbyperiodoRequest = (id_periodo) => axiosClient.get(`/api/secretaria/matriculas/periodo/${id_periodo}`);
export const alldetallematriculabyperiodoRequest = (id_periodo,tipo) => axiosClient.get(`api/secretaria/detalles-matricula/periodo/tipo-detalle/?periodo_id=${id_periodo}&id_tipo=${tipo}`);