import axiosClient from "./axiosClient";

// ============ ESTUDIANTES ============
export const getEstudiantesRequest = () => 
  axiosClient.get(`/api/estudiantes/`);

export const getSalonesRequest = () => 
  axiosClient.get(`/api/salones`);


// ============ CATEGORÍAS Y UBICACIONES ============
export const getCategoriasRequest = () => 
  axiosClient.get(`/api/banda/categorias`);

// ============ INSTRUMENTOS (INVENTARIO) ============
export const getInstrumentosRequest = () => 
  axiosClient.get(`/api/banda/instrumentos`);

export const getInstrumentosDisponiblesRequest = () => 
  axiosClient.get(`/api/banda/instrumentos/disponibles`);

export const createInstrumentoRequest = (data) => 
  axiosClient.post(`/api/banda/instrumentos`, data);

export const updateInstrumentoRequest = (id, data) => 
  axiosClient.put(`/api/banda/instrumentos/${id}`, data);

export const deleteInstrumentoRequest = (id) => 
  axiosClient.delete(`/api/banda/instrumentos/${id}`);

// ============ ASIGNACIONES (PRÉSTAMOS) ============
export const getPrestamosRequest = () => 
  axiosClient.get(`/api/banda/prestamos`);

export const asignarInstrumentoRequest = (data) => 
  axiosClient.post(`/api/banda/prestamos`, data);

export const devolverInstrumentoRequest = (id, data) => 
  axiosClient.put(`/api/banda/prestamos/${id}/devolver`, data);

