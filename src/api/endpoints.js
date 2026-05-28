import axiosClient from "./axiosClient";


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

// Crear el préstamo (el backend pondrá el libro en disponible = false)
export const asignarLibroRequest = (data) =>
  axiosClient.post(`/api/salones/prestamos`, data);

// Registrar devolución (el backend pondrá el libro en disponible = true)
export const devolverLibroRequest = (id, data) =>
  axiosClient.put(`/api/salones/prestamos/${id}/devolver`, data);


export const getPupitresRequest = () =>
  axiosClient.get(`/api/salones/pupitres`);

export const updatePupitreRequest = (id, data) =>
  axiosClient.put(`/api/salones/pupitres/${id}`, data);

export const getPruebasRequest = () =>
  axiosClient.get(`/api/salones/pruebas`);

export const createPruebaRequest = (data) =>
  axiosClient.post(`/api/salones/pruebas`, data);

export const updateEstadoPruebaRequest = (id, estado) =>
  axiosClient.put(`/api/salones/pruebas/${id}/estado?estado=${estado}`);


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

export const allsalonesRequest = () =>
  axiosClient.get("/api/salones/");