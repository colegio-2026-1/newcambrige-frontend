import axiosClient from "./axiosClient";

export const estudianteFirmasRequest = (estudiante_id,periodo_id) =>axiosClient.get(`/api/paz-salvo/estudiante/${estudiante_id}?periodo_id=${periodo_id}`);
export const estudiantesRectoriaRequest = (periodo_id,grado,grupo,semaforo,nombre,documento) =>axiosClient.get(`/api/paz-salvo/estudiantes-rectoria`,{params: {periodo_id,grado,grupo,semaforo,nombre,documento}});
export const firmarRectoriaEstudianteRequest = (estudiante_id,periodo_id) =>axiosClient.post(`/api/paz-salvo/rectoria/${estudiante_id}?periodo_id=${periodo_id}`);
export const descargarPdfEstudianteRequest = (estudiante_id,periodo_id) =>axiosClient.get(`/api/paz-salvo/descargar-pdf/estudiante/${estudiante_id}?periodo_id=${periodo_id}`,{responseType: "blob"});
export const selloRequest = () =>axiosClient.get("/api/paz-salvo/sello",{responseType: "blob"});
export const docentesRectoriaRequest = (periodo_id,nombre,documento) =>axiosClient.get("/api/paz-salvo/docentes-rectoria",{params: {periodo_id,nombre,documento}});
export const firmarDocenteRequest = (docente_id,periodo_id) =>axiosClient.post(`/api/paz-salvo/rectoria/docente/${docente_id}?periodo_id=${periodo_id}`);
export const descargarPdfDocenteRequest = (docente_id,periodo_id) =>axiosClient.get(`/api/paz-salvo/descargar-pdf/docente/${docente_id}?periodo_id=${periodo_id}`,{responseType: "blob"});
export const periodosPazYSalvoRequest = () =>axiosClient.get("/api/paz-salvo/periodos");
export const pendientesPazYSalvoRequest = (periodo_id) =>axiosClient.get(`/api/paz-salvo/pendientes?periodo_id=${periodo_id}`);
export const descargarPdfEstudiantesBatchRequest = (periodo_id, grado, grupo) => {const params = {}; if (periodo_id) params.periodo_id = periodo_id; if (grado) params.grado = grado; if (grupo) params.grupo = grupo; return axiosClient.get("/api/paz-salvo/descargar-pdf/estudiantes/batch", { params, responseType: "blob" });};
export const imagenFirmaRequest = (nombreModulo, usuarioId)=> {let url = `/api/paz-salvo/firma/modulo/${nombreModulo}`; if (usuarioId) {url += `?usuario_id=${usuarioId}`;} return axiosClient.get(url, {responseType: "blob"});};
export const descargarPdfDocentesBatchRequest = (periodo_id, grado, grupo) => {const params = {}; if (periodo_id) params.periodo_id = periodo_id; if (grado) params.grado = grado; if (grupo) params.grupo = grupo; return axiosClient.get("/api/paz-salvo/descargar-pdf/docentes/batch", { params, responseType: "blob" });};