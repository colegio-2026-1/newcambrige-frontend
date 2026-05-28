import { useEffect, useState } from "react";

import { inventarioService } from "../services/inventarioService";

import {
  FORM_VACIO,
  ERRORES_VACIO,
  POR_PAGINA,
} from "../utils/inventarioConstants";

const useInventario = () => {

  const [instrumentos, setInstrumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [loading, setLoading] = useState(true);

  // filtros
  const [filtroCodigo, setFiltroCodigo] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  // paginacion
  const [pagina, setPagina] = useState(1);

  // modales
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalErrorEliminar, setModalErrorEliminar] = useState(false);
  const [modalAdvertencia, setModalAdvertencia] = useState(false);

  // seleccionado
  const [seleccionado, setSeleccionado] = useState(null);

  // form
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState(ERRORES_VACIO);

  // toast
  const [toast, setToast] = useState(null);

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
  // VALIDAR FORM
  // =========================================================

  const validarForm = (esEdicion = false) => {

    const nuevoErrores = {
      ...ERRORES_VACIO,
    };

    let valido = true;

    // codigo

    if (!esEdicion && !form.codigo.trim()) {

      nuevoErrores.codigo =
        "El código del instrumento es obligatorio.";

      valido = false;
    }

    else if (
      !esEdicion &&
      !/^\d{1,6}$/.test(form.codigo.trim())
    ) {

      nuevoErrores.codigo =
        "El código debe ser un número entero de 1 a 6 dígitos.";

      valido = false;
    }

    else if (!esEdicion) {

      const existe = instrumentos.some(
        (i) =>
          String(i.codigo) === form.codigo.trim()
      );

      if (existe) {

        nuevoErrores.codigo =
          "El código del instrumento ya se encuentra registrado.";

        valido = false;
      }
    }

    // nombre

    if (!form.nombre.trim()) {

      nuevoErrores.nombre =
        "El nombre del instrumento es obligatorio.";

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

    else {

      const idActual =
        esEdicion
          ? seleccionado?.id_instrumento
          : null;

      const duplicado = instrumentos.some(
        (i) =>
          i.nombre.toLowerCase() ===
            form.nombre.trim().toLowerCase() &&
          i.id_instrumento !== idActual
      );

      if (duplicado) {

        nuevoErrores.nombre =
          "Ya existe un instrumento con este nombre.";

        valido = false;
      }
    }

    // categoria

    if (!form.id_categoria) {

      nuevoErrores.id_categoria =
        "Debe seleccionar un tipo de instrumento.";

      valido = false;
    }

    // cantidad

    if (
      !form.cantidad_total ||
      isNaN(form.cantidad_total) ||
      parseInt(form.cantidad_total) < 1
    ) {

      nuevoErrores.cantidad_total =
        "La cantidad total debe ser un número entero mayor a 0.";

      valido = false;
    }

    setErrores(nuevoErrores);

    return valido;
  };

  // =========================================================
  // CRUD
  // =========================================================

  const handleAgregar = async () => {

    if (!validarForm(false)) return;

    try {

      await inventarioService.crearInstrumento({

        codigo: form.codigo.trim(),

        nombre: form.nombre.trim(),

        id_categoria:
          parseInt(form.id_categoria),

        cantidad_total:
          parseInt(form.cantidad_total),

        id_ubicacion:
          form.id_ubicacion
            ? parseInt(form.id_ubicacion)
            : null,

        estado: form.estado,
      });

      setModalAgregar(false);

      setForm(FORM_VACIO);

      setErrores(ERRORES_VACIO);

      setPagina(1);

      cargarDatos();

      mostrarToast(
        "Los cambios han sido guardados correctamente."
      );

    } catch (error) {

      console.error(
        "Error creando instrumento:",
        error
      );
    }
  };

  const ejecutarEdicion = async () => {

    try {

      await inventarioService.editarInstrumento(
        seleccionado.id_instrumento,
        {

          nombre: form.nombre.trim(),

          id_categoria:
            parseInt(form.id_categoria),

          cantidad_total:
            parseInt(form.cantidad_total),

          id_ubicacion:
            form.id_ubicacion
              ? parseInt(form.id_ubicacion)
              : null,

          estado: form.estado,
        }
      );

      setModalEditar(false);

      setModalAdvertencia(false);

      setErrores(ERRORES_VACIO);

      cargarDatos();

      mostrarToast(
        "Los cambios han sido guardados correctamente."
      );

    } catch (error) {

      console.error(
        "Error editando instrumento:",
        error
      );
    }
  };

  const handleEditar = async () => {

    if (!validarForm(true)) return;

    const estadoAnterior =
      seleccionado?.estado;

    const tieneAsignaciones =
      (seleccionado?.asignados ?? 0) > 0;

    const cambiaANoDisponible =
      [
        "Inactivo",
        "En mantenimiento"
      ].includes(form.estado);

    if (
      tieneAsignaciones &&
      cambiaANoDisponible &&
      estadoAnterior === "Activo"
    ) {

      setModalAdvertencia(true);

      return;
    }

    await ejecutarEdicion();
  };

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

      codigo: inst.codigo ?? "",

      nombre: inst.nombre ?? "",

      id_categoria:
        inst.id_categoria ?? "",

      cantidad_total:
        inst.cantidad_total ??
        inst.total ??
        "",

      id_ubicacion:
        inst.id_ubicacion ?? "",

      estado:
        inst.estado ?? "Activo",
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

  const filtrados = instrumentos.filter((i) => {

    const matchCodigo =
      !filtroCodigo ||
      String(i.codigo ?? "").includes(filtroCodigo);

    const matchNombre =
      !filtroNombre ||
      i.nombre.toLowerCase().includes(
        filtroNombre.toLowerCase()
      );

    const matchCategoria =
      !filtroCategoria ||
      String(i.id_categoria) === filtroCategoria;

    return (
      matchCodigo &&
      matchNombre &&
      matchCategoria
    );
  });

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

  const handleBuscar = () => {

    setPagina(1);
  };

  const handleLimpiar = () => {

    setFiltroCodigo("");
    setFiltroNombre("");
    setFiltroCategoria("");
    setPagina(1);
  };

  return {

    loading,

    instrumentos,
    categorias,
    ubicaciones,

    filtroCodigo,
    setFiltroCodigo,

    filtroNombre,
    setFiltroNombre,

    filtroCategoria,
    setFiltroCategoria,

    pagina,
    setPagina,

    totalPaginas,
    paginaActual,

    filtrados,
    paginados,

    modalAgregar,
    setModalAgregar,

    modalEditar,
    setModalEditar,

    modalEliminar,
    setModalEliminar,

    modalErrorEliminar,
    setModalErrorEliminar,

    modalAdvertencia,
    setModalAdvertencia,

    seleccionado,

    form,
    setForm,

    errores,

    toast,

    abrirAgregar,
    abrirEditar,
    abrirEliminar,

    handleAgregar,
    handleEditar,
    handleEliminar,

    ejecutarEdicion,

    handleBuscar,
    handleLimpiar,
  };
};

export default useInventario;