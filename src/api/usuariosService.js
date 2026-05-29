import axiosClient from "./axiosClient";

// Obtener todos los usuarios
export const obtenerUsuariosRequest = async () => {
  return await axiosClient.get("/api/usuarios");
};

// Crear un nuevo usuario
export const crearUsuarioRequest = async (usuarioData) => {
  // usuarioData debe tener: { nombre: "...", password: "...", roles: [...] }
  return await axiosClient.post("/api/usuarios", usuarioData);
};

// Actualizar datos básicos (nombre, password, estado)
export const actualizarUsuarioRequest = async (id, usuarioData) => {
  return await axiosClient.put(`/api/usuarios/${id}`, usuarioData);
};

// Actualizar los roles del usuario
export const asignarRolesRequest = async (id, rolesData) => {
  return await axiosClient.put(`/api/usuarios/${id}/roles`, rolesData);
};

// Eliminar usuario
export const eliminarUsuarioRequest = async (id) => {
  return await axiosClient.delete(`/api/usuarios/${id}`);
};