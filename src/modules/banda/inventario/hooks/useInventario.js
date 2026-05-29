
import { useEffect, useMemo, useState } from "react";

import { inventarioService } from "../services/inventarioService";

import {
  FORM_VACIO,
  ERRORES_VACIO,
  POR_PAGINA,
} from "../utils/inventarioConstants";

const useInventario = () => {

  // =========================================================
  // DATA
  // =========================================================

  const [instrumentos, setInstrumentos] =
    useState([]);

  const [categorias, setCategorias] =
    useState([]);

  const [ubicaciones, setUbicaciones] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // FILTROS
  // =========================================================

  const [filtroNombre, setFiltroNombre] =
    useState("");

  const [filtroCategoria, setFiltroCategoria] =
    useState("");

  // =========================================================
  // PAGINACION
  // =========================================================

  const [pagina, setPagina] =
    useState(1);

  // =========================================================
  // MODALES
  // =========================================================

  const [modalAgregar, setModalAgregar] =
    useState(false);

  const [modalEditar, setModalEditar] =
    useState(false);

  const [modalEliminar, setModalEliminar] =
    useState(false);

  const [modalErrorEliminar, setModalErrorEliminar] =
    useState(false);

  const [modalAdvertencia, setModalAdvertencia] =
  useState(false);

  // =========================================================
  // SELECCIONADO
  // =========================================================

  const [seleccionado, setSeleccionado] =
    useState(null);

  // =========================================================
  // FORMULARIO
  // =========================================================

  const [form, setForm] =
    useState(FORM_VACIO);

  const [errores, setErrores] =
    useState(ERRORES_VACIO);

  // =========================================================
  // TOAST
  // =========================================================

  const [toast, setToast] =
    useState(null);

  const [pendienteEdicion, setPendienteEdicion] =
  useState(null);

  // =========================================================
  // CARGAR DATOS
  // =========================================================

  const cargarDatos = async () => {

    try {

      const [
        instRes,
        catRes,
        ubiRes
      ] = await Promise.all([
        inventarioService.getInstrumentos(),
        inventarioService.getCategorias(),
        inventarioService.getUbicaciones(),
      ]);

      setInstrumentos(instRes.data);

      setCategorias(catRes.data);

      setUbicaciones(ubiRes.data);

    } catch (error) {

      console.error(
        "Error cargando inventario:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    cargarDatos();

  }, []);

  // =========================================================
  // TOAST
  // =========================================================

  const mostrarToast = (mensaje) => {

    setToast(mensaje);

    setTimeout(() => {

      setToast(null);

    }, 3500);
  };

  // =========================================================
  // VALIDAR FORMULARIO
  // =========================================================

  const validarForm = () => {

    const nuevoErrores = {
      ...ERRORES_VACIO,
    };

    let valido = true;

    // =====================================================
    // NOMBRE
    // =====================================================

    if (!form.nombre.trim()) {

      nuevoErrores.nombre =
        "El nombre es obligatorio.";

      valido = false;
    }

    else if (
      form.nombre.trim().length < 3 ||
      form.nombre.trim().length > 100
    ) {

      nuevoErrores.nombre =
        "El nombre debe tener entre 3 y 100 caracteres.";

      valido = false;
    }

    // =====================================================
    // CATEGORIA
    // =====================================================

    if (!form.id_categoria) {

      nuevoErrores.id_categoria =
        "Debe seleccionar una categoría.";

      valido = false;
    }

    setErrores(nuevoErrores);

    return valido;
  };

  // =========================================================
  // CREAR
  // =========================================================

  const handleAgregar = async () => {

    if (!validarForm()) return;

    try {

      await inventarioService.crearInstrumento({

        nombre: form.nombre.trim(),

        id_categoria:
          parseInt(form.id_categoria),

        id_ubicacion:
          form.id_ubicacion
            ? parseInt(form.id_ubicacion)
            : null,

        disponible:
          form.disponible,
      });

      setModalAgregar(false);

      setForm(FORM_VACIO);

      setErrores(ERRORES_VACIO);

      setPagina(1);

      cargarDatos();

      mostrarToast(
        "Instrumento agregado correctamente."
      );

    } catch (error) {

      console.error(
        "Error creando instrumento:",
        error
      );
    }
  };

  // =========================================================
  // EDITAR
  // =========================================================

  const ejecutarEdicion = async () => {

  try {

    await inventarioService.editarInstrumento(
      seleccionado.id_instrumento,
      {
        nombre: form.nombre.trim(),

        id_categoria:
          parseInt(form.id_categoria),

        id_ubicacion:
          form.id_ubicacion
            ? parseInt(form.id_ubicacion)
            : null,

        disponible:
          form.disponible,
      }
    );

    setModalEditar(false);

    setModalAdvertencia(false);

    setErrores(ERRORES_VACIO);

    cargarDatos();

    mostrarToast(
      "Instrumento actualizado correctamente."
    );

  } catch (error) {

    console.error(
      "Error editando instrumento:",
      error
    );
  }
};

const handleEditar = async () => {

  if (!validarForm()) return;

  // Si el instrumento pasa de disponible a no disponible
  // mostramos advertencia

  if (
    seleccionado?.disponible === true &&
    form.disponible === false
  ) {

    setPendienteEdicion(form);

    setModalAdvertencia(true);

    return;
  }

  ejecutarEdicion();
};

  // =========================================================
  // ELIMINAR
  // =========================================================

  const handleEliminar = async () => {

    try {

      await inventarioService.eliminarInstrumento(
        seleccionado.id_instrumento
      );

      setModalEliminar(false);

      cargarDatos();

      mostrarToast(
        "Instrumento eliminado correctamente."
      );

    } catch (error) {

      console.error(
        "Error eliminando instrumento:",
        error
      );

      if (error.response?.status === 400) {

        setModalEliminar(false);

        setModalErrorEliminar(true);
      }
    }
  };

  // =========================================================
  // ABRIR MODALES
  // =========================================================

  const abrirAgregar = () => {

    setForm(FORM_VACIO);

    setErrores(ERRORES_VACIO);

    setModalAgregar(true);
  };

  const abrirEditar = (inst) => {

    setSeleccionado(inst);

    setForm({

      nombre:
        inst.nombre ?? "",

      id_categoria:
        inst.id_categoria ?? "",

      id_ubicacion:
        inst.id_ubicacion ?? "",

      disponible:
        inst.disponible ?? true,
    });

    setErrores(ERRORES_VACIO);

    setModalEditar(true);
  };

  const abrirEliminar = (inst) => {

    setSeleccionado(inst);

    setModalEliminar(true);
  };

  // =========================================================
  // FILTROS
  // =========================================================

  const filtrados =
    instrumentos.filter((i) => {

      const matchNombre =
        !filtroNombre ||
        i.nombre
          .toLowerCase()
          .includes(
            filtroNombre.toLowerCase()
          );

      const matchCategoria =
        !filtroCategoria ||
        String(i.id_categoria) ===
          filtroCategoria;

      return (
        matchNombre &&
        matchCategoria
      );
    });

  // =========================================================
  // PAGINACION
  // =========================================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      filtrados.length / POR_PAGINA
    )
  );

  const paginaActual = Math.min(
    pagina,
    totalPaginas
  );

  const paginados = filtrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

  // =========================================================
  // BUSCAR
  // =========================================================

  const handleBuscar = () => {

    setPagina(1);
  };

  const handleLimpiar = () => {

    setFiltroNombre("");

    setFiltroCategoria("");

    setPagina(1);
  };

  // =========================================================
  // ESTADISTICAS
  // =========================================================

  const estadisticas = useMemo(() => {

    const total =
      instrumentos.length;

    const disponibles =
      instrumentos.filter(
        (i) => i.disponible === true
      ).length;

    const ocupados =
      instrumentos.filter(
        (i) => i.disponible === false
      ).length;

    return {

      total,
      disponibles,
      ocupados,
    };

  }, [instrumentos]);

  // =========================================================
  // RETURN
  // =========================================================

  return {

    // DATA
    loading,
    instrumentos,
    categorias,
    ubicaciones,
    modalAdvertencia,
    setModalAdvertencia,
    ejecutarEdicion,

    // FILTROS
    filtroNombre,
    setFiltroNombre,

    filtroCategoria,
    setFiltroCategoria,

    // PAGINACION
    pagina,
    setPagina,

    totalPaginas,
    paginaActual,

    filtrados,
    paginados,

    // MODALES
    modalAgregar,
    setModalAgregar,

    modalEditar,
    setModalEditar,

    modalEliminar,
    setModalEliminar,

    modalErrorEliminar,
    setModalErrorEliminar,

    // SELECCION
    seleccionado,

    // FORM
    form,
    setForm,

    errores,

    // TOAST
    toast,

    // STATS
    estadisticas,

    // ACTIONS
    abrirAgregar,
    abrirEditar,
    abrirEliminar,

    handleAgregar,
    handleEditar,
    handleEliminar,

    handleBuscar,
    handleLimpiar,
  };
};

export default useInventario;
