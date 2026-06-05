import axiosClient from "./axiosClient";

/* ==========================================
   MÓDULO: AÑO ESCOLAR
========================================== */
export const obtenerAniosRequest = () => axiosClient.get('/api/parametrizacion/anio-escolar');

export const crearAnioRequest = (data, forzar = false) => 
  axiosClient.post(`/api/parametrizacion/anio-escolar?forzar=${forzar}`, data);

export const actualizarAnioRequest = (id, data, forzar = false) => 
  axiosClient.patch(`/api/parametrizacion/anio-escolar/${id}?forzar=${forzar}`, data);


// /* ==========================================
//    MÓDULO: OBJETOS / INVENTARIO
// ========================================== */
// export const obtenerObjetosRequest = () => axiosClient.get('/api/uniformes/objetos');

// export const crearObjetoRequest = (objeto) => axiosClient.post('/api/uniformes/objetos', objeto);

// export const actualizarObjetoRequest = (id, objeto) => axiosClient.put(`/api/uniformes/objetos/${id}`, objeto);

// export const eliminarObjetoRequest = (id) => axiosClient.delete(`/api/uniformes/objetos/${id}`);


/* ==========================================
   MÓDULO: TIPOS DE PRUEBA
========================================== */
export const obtenerTiposPruebaRequest = () => axiosClient.get('/api/parametrizacion/tipos-prueba');

export const crearTipoPruebaRequest = (prueba) => axiosClient.post('/api/parametrizacion/tipos-prueba', prueba);

export const actualizarTipoPruebaRequest = (id, prueba) => axiosClient.patch(`/api/parametrizacion/tipos-prueba/${id}`, prueba);