import axiosClient from "./axiosClient";

/* ==========================================
   MÓDULO: AÑO ESCOLAR
========================================== */
export const obtenerAniosRequest = () => axiosClient.get('/api/parametrizacion/anio-escolar');

export const crearAnioRequest = (data, forzar = false) => 
  axiosClient.post(`/api/parametrizacion/anio-escolar?forzar=${forzar}`, data);

export const actualizarAnioRequest = (id, data, forzar = false) => 
  axiosClient.patch(`/api/parametrizacion/anio-escolar/${id}?forzar=${forzar}`, data);


/* ==========================================
   MÓDULO: INVENTARIO / OBJETOS (UNIFORMES)
========================================== */

export const obtenerObjetosRequest = () => 
  axiosClient.get('/api/uniformes/objetos');

export const obtenerInventarioRequest = () => 
  axiosClient.get('/api/uniformes/inventario');

export const obtenerObjetosDisponiblesRequest = () => 
  axiosClient.get('/api/uniformes/objetos/disponibles');

export const crearObjetoRequest = (data) => 
  axiosClient.post('/api/uniformes/objetos', data);

export const actualizarObjetoRequest = (id, data) => 
  axiosClient.put(`/api/uniformes/objetos/${id}`, data);

export const eliminarObjetoRequest = (id) => 
  axiosClient.delete(`/api/uniformes/objetos/${id}`);


/* ==========================================
   MÓDULO: TIPOS DE PRUEBA
========================================== */
export const obtenerTiposPruebaRequest = () => axiosClient.get('/api/parametrizacion/tipos-prueba');

export const crearTipoPruebaRequest = (prueba) => axiosClient.post('/api/parametrizacion/tipos-prueba', prueba);

export const actualizarTipoPruebaRequest = (id, prueba) => axiosClient.patch(`/api/parametrizacion/tipos-prueba/${id}`, prueba);

/* ==========================================
   MÓDULO: REGISTRO DE LIBROS (SALÓN)
========================================== */
export const obtenerLibrosRequest = () => 
  axiosClient.get('/api/salones/libros');

export const crearLibroRequest = (libro) => 
  axiosClient.post('/api/salones/libros', libro);

export const actualizarLibroRequest = (id, libro) => 
  axiosClient.put(`/api/salones/libros/${id}`, libro);

export const eliminarLibroRequest = (id) => 
  axiosClient.delete(`/api/salones/libros/${id}`);

// ==========================================
// MÓDULO: ASIGNACIÓN DE TITULARES
// ==========================================
export const obtenerTitularesRequest = () => 
  axiosClient.get('/api/parametrizacion/titulares');

export const obtenerSalonesPorPeriodoRequest = (id_periodo) => 
  axiosClient.get(`/api/parametrizacion/salones/periodo/${id_periodo}`);

export const asignarTitularRequest = (id_salon, data) => 
  axiosClient.put(`/api/parametrizacion/salones/${id_salon}/asignar-titular`, data);

export const obtenerSalonesRequest = () => 
  axiosClient.get('/api/salones/');

export const crearSalonRequest = (data) => axiosClient.post('/api/salones/', data);

/* ==========================================
   MÓDULO: INSTRUMENTOS (BANDA)
========================================== */
export const obtenerInstrumentosRequest = () => 
  axiosClient.get('/api/banda/instrumentos');

export const crearInstrumentoRequest = (data) => 
  axiosClient.post('/api/banda/instrumentos', data);

export const actualizarInstrumentoRequest = (id, data) => 
  axiosClient.put(`/api/banda/instrumentos/${id}`, data);

export const eliminarInstrumentoRequest = (id) => 
  axiosClient.delete(`/api/banda/instrumentos/${id}`);


export const obtenerCategoriasRequest = () => 
  axiosClient.get('/api/banda/categorias'); 

export const crearCategoriaRequest = (data) => 
  axiosClient.post('/api/banda/categorias', data);

export const actualizarCategoriaRequest = (id, data) => 
  axiosClient.put(`/api/banda/categorias/${id}`, data);

export const eliminarCategoriaRequest = (id) => 
  axiosClient.delete(`/api/banda/categorias/${id}`);