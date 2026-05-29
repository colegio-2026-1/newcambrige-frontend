// ======================================================
// INVENTARIO CONSTANTS
// FRONT LIMPIO ADAPTADO AL BACKEND REAL
// ======================================================

// ------------------------------------------------------
// PAGINACION
// ------------------------------------------------------

export const POR_PAGINA = 10;

// ------------------------------------------------------
// FORMULARIO VACIO
// SOLO CAMPOS EXISTENTES EN BACKEND
// ------------------------------------------------------

export const FORM_VACIO = {
  nombre: "",
  id_categoria: "",
  id_ubicacion: "",
  disponible: true,
};

// ------------------------------------------------------
// ERRORES DEL FORMULARIO
// ------------------------------------------------------

export const ERRORES_VACIO = {
  nombre: "",
  id_categoria: "",
};

// ------------------------------------------------------
// BADGES DISPONIBILIDAD
// EL BACKEND SOLO MANEJA TRUE/FALSE
// ------------------------------------------------------

export const DISPONIBILIDAD_BADGE = {
  true: {
    bg: "#DCFCE7",
    color: "#15803D",
    text: "Disponible",
  },

  false: {
    bg: "#FEE2E2",
    color: "#B91C1C",
    text: "Prestado",
  },
};