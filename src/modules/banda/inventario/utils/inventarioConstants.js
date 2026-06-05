export const POR_PAGINA = 10;

export const FORM_VACIO = {
  // ❌ 'codigo' eliminado: el backend usa id_instrumento autogenerado
  nombre: "",
  id_categoria: "",
  id_ubicacion: "",
  cantidad_total: 1,
  estado: "Activo",
};

export const ERRORES_VACIO = {
  nombre: "",
  id_categoria: "",
  id_ubicacion: "",
  cantidad_total: "",
  estado: ""
};

export const ESTADO_INSTRUMENTO_BADGE = {
  "Activo": { bg: "#DCFCE7", color: "#15803D", text: "Activo" },
  "Inactivo": { bg: "#F3F4F6", color: "#374151", text: "Inactivo" },
  "En mantenimiento": { bg: "#FEF9C3", color: "#854D0E", text: "Mantenimiento" },
};