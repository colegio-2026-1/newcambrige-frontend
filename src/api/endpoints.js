
import axiosClient from "./axiosClient";

export const allrolesuserRequest = (id) => axiosClient.get(`/api/usuarios/${id}/roles`);
export const allaniosacademicosRequest =() => axiosClient.get("/api/parametrizacion/anio-escolar");
