// src/modules/banda/inventario/utils/inventarioConstants.js

export const POR_PAGINA = 10;

export const FORM_VACIO = {
  codigo: "",           // NUEVO: Requerido por el Back
  nombre: "",           // Requerido
  id_categoria: "",     // Requerido
  id_ubicacion: "",     // Opcional
  cantidad_total: 1,    // NUEVO: Requerido (mínimo 1)
  estado: "Activo",     // NUEVO: (Activo, Inactivo, En mantenimiento)
};

export const ERRORES_VACIO = {
  codigo: "",
  nombre: "",
  id_categoria: "",
  cantidad_total: "",
};

// Adaptado a los estados reales del PDF (BR336 y BR264)
export const ESTADO_INSTRUMENTO_BADGE = {
  "Activo": {
    bg: "#DCFCE7",
    color: "#15803D",
    text: "Activo",
  },
  "Inactivo": {
    bg: "#F3F4F6",
    color: "#374151",
    text: "Inactivo",
  },
  "En mantenimiento": {
    bg: "#FEF9C3",
    color: "#854D0E",
    text: "Mantenimiento",
  },
};