export const ESTADOS_INSTRUMENTO = [
  "Activo",
  "Inactivo",
  "En mantenimiento",
];

export const POR_PAGINA = 10;

export const FORM_VACIO = {
  codigo: "",
  nombre: "",
  id_categoria: "",
  cantidad_total: "",
  id_ubicacion: "",
  estado: "Activo",
};

export const ERRORES_VACIO = {
  codigo: "",
  nombre: "",
  id_categoria: "",
  cantidad_total: "",
};

export const ESTADO_BADGE = {
  "Activo": {
    bg: "#DCFCE7",
    color: "#15803D",
  },

  "Inactivo": {
    bg: "#F3F4F6",
    color: "#6B7280",
  },

  "En mantenimiento": {
    bg: "#FEF9C3",
    color: "#CA8A04",
  },
};