import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { prestamoService }
from "../services/prestamoService";

import {
  FORM_VACIO,
  ERRORES_VACIO,
  POR_PAGINA,
} from "../utils/prestamosConstants";

import {
  allestudiantesRequest
} from "../../../../api/endpoints";

const usePrestamos = () => {

  // ====================================================
  // DATA
  // ====================================================

  const [prestamos, setPrestamos] =
    useState([]);

  const [instrumentos, setInstrumentos] =
    useState([]);

  const [estudiantes, setEstudiantes] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ====================================================
  // FILTRO
  // ====================================================

  const [filtroNombre, setFiltroNombre] =
    useState("");

  // ====================================================
  // PAGINACION
  // ====================================================

  const [pagina, setPagina] =
    useState(1);

  // ====================================================
  // MODALES
  // ====================================================

  const [modalAgregar, setModalAgregar] =
    useState(false);

  // ====================================================
  // ESTUDIANTE SELECCIONADO
  // ====================================================

  const [
    estudianteSeleccionado,
    setEstudianteSeleccionado
  ] = useState(null);

  // ====================================================
  // FORMULARIO
  // ====================================================

  const [form, setForm] =
    useState(FORM_VACIO);

  const [errores, setErrores] =
    useState(ERRORES_VACIO);

  // ====================================================
  // TOAST
  // ====================================================

  const [toast, setToast] =
    useState(null);

  // ====================================================
  // CARGAR DATOS
  // ====================================================

  const cargarDatos = async () => {

    try {

      const [
        prestamosRes,
        instrumentosRes,
        estudiantesRes
      ] = await Promise.all([

        prestamoService.getPrestamos(),

        prestamoService.getInstrumentosDisponibles(),

        allestudiantesRequest(),
      ]);

      setPrestamos(
        prestamosRes.data
      );

      setInstrumentos(
        instrumentosRes.data
      );

      setEstudiantes(
        estudiantesRes.data
      );

    } catch (error) {

      console.error(
        "Error cargando préstamos:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    cargarDatos();

  }, []);

  // ====================================================
  // FILTRO ESTUDIANTES
  // ====================================================

  const estudiantesFiltrados =
    useMemo(() => {

      return estudiantes.filter(
        (e) =>
          e.nombre
            ?.toLowerCase()
            .includes(
              filtroNombre.toLowerCase()
            )
      );

    }, [
      estudiantes,
      filtroNombre
    ]);

  // ====================================================
  // TOAST
  // ====================================================

  const mostrarToast = (mensaje) => {

    setToast(mensaje);

    setTimeout(() => {

      setToast(null);

    }, 3500);
  };

  // ====================================================
  // VALIDAR
  // ====================================================

  const validarForm = () => {

    const nuevoErrores = {
      ...ERRORES_VACIO,
    };

    let valido = true;

    if (!form.id_instrumento) {

      nuevoErrores.id_instrumento =
        "Seleccione un instrumento";

      valido = false;
    }

    if (!form.id_estudiante) {

      nuevoErrores.id_estudiante =
        "Seleccione un estudiante";

      valido = false;
    }

    if (!form.fecha_prestamo) {

      nuevoErrores.fecha_prestamo =
        "Seleccione fecha";

      valido = false;
    }

    setErrores(nuevoErrores);

    return valido;
  };

  // ====================================================
  // CREAR PRESTAMO
  // ====================================================

  const handleAgregar = async () => {

    if (!validarForm()) return;

    try {

      await prestamoService.crearPrestamo({

        id_instrumento:
          parseInt(form.id_instrumento),

        id_estudiante:
          parseInt(form.id_estudiante),

        fecha_prestamo:
          form.fecha_prestamo,

        observacion:
          form.observacion.trim(),
      });

      setModalAgregar(false);

      setForm(FORM_VACIO);

      setErrores(ERRORES_VACIO);

      cargarDatos();

      mostrarToast(
        "Préstamo registrado correctamente."
      );

    } catch (error) {

      console.error(
        "Error creando préstamo:",
        error
      );
    }
  };

  // ====================================================
  // DEVOLVER
  // ====================================================

  const devolverInstrumento =
    async (id) => {

      try {

        await prestamoService
          .devolverInstrumento(id);

        cargarDatos();

        mostrarToast(
          "Instrumento devuelto correctamente."
        );

      } catch (error) {

        console.error(
          "Error devolviendo instrumento:",
          error
        );
      }
    };

  // ====================================================
  // PAGINACION
  // ====================================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      prestamos.length /
      POR_PAGINA
    )
  );

  const paginaActual = Math.min(
    pagina,
    totalPaginas
  );

  const paginados = prestamos.slice(

    (paginaActual - 1) *
    POR_PAGINA,

    paginaActual *
    POR_PAGINA
  );

  // ====================================================
  // STATS
  // ====================================================

  const estadisticas = useMemo(() => {

    return {

      total:
        prestamos.length,

      activos:
        prestamos.filter(
          (p) =>
            p.estado_entrega ===
            "prestado"
        ).length,
    };

  }, [prestamos]);

  // ====================================================
  // RETURN
  // ====================================================

  return {

    // DATA
    prestamos,
    instrumentos,
    estudiantes,
    loading,

    // FILTROS
    filtroNombre,
    setFiltroNombre,

    estudiantesFiltrados,

    // PAGINACION
    pagina,
    setPagina,

    totalPaginas,
    paginaActual,

    paginados,

    // MODALES
    modalAgregar,
    setModalAgregar,

    // ESTUDIANTE
    estudianteSeleccionado,
    setEstudianteSeleccionado,

    // FORM
    form,
    setForm,

    errores,

    // TOAST
    toast,

    // STATS
    estadisticas,

    // ACTIONS
    handleAgregar,

    devolverInstrumento,
  };
};

export default usePrestamos;