import axiosClient from "./axiosClient";

export const allrolesuserRequest = (id) => axiosClient.get(`/api/usuarios/${id}/roles`);
export const allaniosacademicosRequest =() => axiosClient.get("/api/parametrizacion/anio-escolar");
export const crearMatriculaRequest = ( estudiante_id, periodo_id ) => axiosClient.post(`/api/secretaria/matriculas`, {
    id_estudiante: estudiante_id,
    id_periodo: periodo_id
  });
export const crearDetalleRequest = (matricula_id, tipo_id, mes) => axiosClient.post(`api/secretaria/detalles-matricula`,{
        id_matricula: matricula_id,
        id_tipo: tipo_id,
        mes: mes
    });
export const alltipoconceptoRequest =() => axiosClient.get("/api/secretaria/tipos-concepto");
export const allestudiantesbyperiodoRequest = (id_periodo) => axiosClient.get(`/api/estudiantes/periodo/${id_periodo}`);
export const allsalonesbyperiodoRequest = (id_periodo) => axiosClient.get(`/api/salones/periodo/${id_periodo}`);
export const allmatriculasbyperiodoRequest = (id_periodo) => axiosClient.get(`/api/secretaria/matriculas/periodo/${id_periodo}`);
export const alldetallematriculabyperiodoRequest = (id_periodo,tipo) => axiosClient.get(`api/secretaria/detalles-matricula/periodo/tipo-detalle/?periodo_id=${id_periodo}&id_tipo=${tipo}`);