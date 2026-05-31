export const POR_PAGINA = 10;

export const FORM_VACIO = {
  id_instrumento: "",
  id_estudiante: "",
  observacion: "",
  // Eliminamos fecha_prestamo: el Backend usa la del servidor
};

// NUEVO: Para el formulario de devoluciones (Requerimiento BR22)
export const FORM_DEVOLUCION_VACIO = {
  estado_al_devolver: "Bueno", // Bueno o Malo
  observaciones: "",
};

export const ERRORES_VACIO = {
  id_instrumento: "",
  id_estudiante: "",
  estado_al_devolver: "",
  observaciones: "",
};