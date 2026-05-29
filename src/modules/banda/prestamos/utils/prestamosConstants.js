// ======================================================
// PAGINACION
// ======================================================

export const POR_PAGINA = 10;

// ======================================================
// FORMULARIO VACIO
// ADAPTADO AL BACKEND REAL
// ======================================================

export const FORM_VACIO = {

  id_instrumento: "",

  id_estudiante: "",

  fecha_prestamo:
    new Date()
      .toISOString()
      .split("T")[0],

  observacion: "",
};

// ======================================================
// ERRORES
// ======================================================

export const ERRORES_VACIO = {

  id_instrumento: "",

  id_estudiante: "",

  fecha_prestamo: "",
};