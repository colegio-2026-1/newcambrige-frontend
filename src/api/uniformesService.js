import axiosClient from "./axiosClient";

// ==============================
// OBTENER ASIGNACIONES
// ==============================
export const getAsignacionesRequest = () =>
  axiosClient.get("/api/uniformes/asignaciones");

// ==============================
// REGISTRAR PRÉSTAMO
// ==============================
export const registrarPrestamoRequest = (data) =>
  axiosClient.post("/api/uniformes/prestamos", data);

// ==============================
// OBJETOS DISPONIBLES
// ==============================
export const getObjetosDisponiblesRequest = () =>
  axiosClient.get("/api/uniformes/objetos/disponibles");

// ==============================
// INVENTARIO
// ==============================
// Se unifica el formato de retorno directo sin async innecesario
export const getInventarioRequest = () => 
  axiosClient.get("/api/uniformes/inventario");

// ==============================
// CREAR OBJETO
// ==============================
export const createObjetoRequest = (data) =>
  axiosClient.post("/api/uniformes/objetos", data);

// ==============================
// EDITAR OBJETO
// ==============================
export const updateObjetoRequest = (id, data) => {
  if (!id) return Promise.reject(new Error("ID requerido para actualizar"));
  return axiosClient.put(`/api/uniformes/objetos/${id}`, data);
};

// ==============================
// ELIMINAR OBJETO
// ==============================
export const deleteObjetoRequest = (id) => {
  if (!id) return Promise.reject(new Error("ID requerido para eliminar objeto"));
  return axiosClient.delete(`/api/uniformes/objetos/${id}`);
};

// ==============================
// DEVOLVER PRÉSTAMO
// ==============================
export const devolverPrestamoRequest = (id_prestamo, data) => {
  if (!id_prestamo) return Promise.reject(new Error("ID de préstamo requerido"));
  return axiosClient.put(`/api/uniformes/devolver/${id_prestamo}`, data);
};

// ==============================
// ELIMINAR PRÉSTAMO
// ==============================
export const deletePrestamoRequest = (id) => {
  if (!id) return Promise.reject(new Error("ID requerido para eliminar préstamo"));
  return axiosClient.delete(`/api/uniformes/prestamos/${id}`);
};

