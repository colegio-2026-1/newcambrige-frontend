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
  const [instrumentos, setInstrumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FILTROS Y PAGINACION
  // =========================================================
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [pagina, setPagina] = useState(1);

  // =========================================================
  // MODALES Y SELECCION
  // =========================================================
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalErrorEliminar, setModalErrorEliminar] = useState(false);
  const [modalAdvertencia, setModalAdvertencia] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  // =========================================================
  // FORMULARIO Y TOAST
  // =========================================================
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState(ERRORES_VACIO);
  const [toast, setToast] = useState(null);

  // =========================================================
  // CARGAR DATOS
  // =========================================================
  const cargarDatos = async () => {
    try {
      const [instRes, catRes, ubiRes] = await Promise.all([
        inventarioService.getInstrumentos(),
        inventarioService.getCategorias(),
        inventarioService.getUbicaciones(),
      ]);
      setInstrumentos(instRes.data);
      setCategorias(catRes.data);
      setUbicaciones(ubiRes.data);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(null), 3500);
  };

  // =========================================================
  // VALIDACIÓN EN TIEMPO REAL (BR253)
  // =========================================================
  const validaciones = useMemo(() => {
    const codigoVal = parseInt(form.codigo);
    const nombreVal = form.nombre?.trim();
    const cantidadVal = parseInt(form.cantidad_total);

    const codigoUnico = !instrumentos.some(
      (i) => i.codigo === codigoVal && i.id_instrumento !== seleccionado?.id_instrumento
    );

    const nombreUnico = !instrumentos.some(
      (i) => i.nombre.toLowerCase() === nombreVal?.toLowerCase() && i.id_instrumento !== seleccionado?.id_instrumento
    );

    return {
      codigo: !isNaN(codigoVal) && codigoVal > 0 && codigoUnico,
      nombre: nombreVal?.length >= 3 && nombreVal?.length <= 100 && nombreUnico,
      datos: !!form.id_categoria && !isNaN(cantidadVal) && cantidadVal >= 1,
      todoValido: false // Se calcula abajo
    };
  }, [form, instrumentos, seleccionado]);

  // BR254: El botón se habilita solo si todoValido es true
  validaciones.todoValido = validaciones.codigo && validaciones.nombre && validaciones.datos;

  // =========================================================
  // ACCIONES (CREAR, EDITAR, ELIMINAR)
  // =========================================================
  const handleAgregar = async () => {
    if (!validaciones.todoValido) return;
    try {
      await inventarioService.crearInstrumento({
        codigo: parseInt(form.codigo),
        nombre: form.nombre.trim(),
        id_categoria: parseInt(form.id_categoria),
        id_ubicacion: form.id_ubicacion ? parseInt(form.id_ubicacion) : null,
        cantidad_total: parseInt(form.cantidad_total),
        estado: form.estado,
      });
      setModalAgregar(false);
      cargarDatos();
      mostrarToast("Instrumento agregado correctamente.");
    } catch (error) {
      console.error("Error creando:", error);
      mostrarToast(error.response?.data?.detail || "Error al crear");
    }
  };

  const ejecutarEdicion = async () => {
    try {
      await inventarioService.editarInstrumento(seleccionado.id_instrumento, {
        nombre: form.nombre.trim(),
        id_categoria: parseInt(form.id_categoria),
        id_ubicacion: form.id_ubicacion ? parseInt(form.id_ubicacion) : null,
        cantidad_total: parseInt(form.cantidad_total),
        estado: form.estado,
      });
      setModalEditar(false);
      setModalAdvertencia(false);
      cargarDatos();
      mostrarToast("Instrumento actualizado correctamente.");
    } catch (error) {
      console.error("Error editando:", error);
      mostrarToast(error.response?.data?.detail || "Error al editar");
    }
  };

  const handleEditar = async () => {
    if (!validaciones.todoValido) return;
    // BR354: Advertencia si cambia de Activo a otro estado teniendo préstamos
    if (seleccionado?.estado === "Activo" && form.estado !== "Activo" && seleccionado?.cantidad_disponible < seleccionado?.cantidad_total) {
      setModalAdvertencia(true);
      return;
    }
    ejecutarEdicion();
  };

  const handleEliminar = async () => {
    try {
      await inventarioService.eliminarInstrumento(seleccionado.id_instrumento);
      setModalEliminar(false);
      cargarDatos();
      mostrarToast("Instrumento eliminado correctamente.");
    } catch (error) {
      setModalEliminar(false);
      setModalErrorEliminar(true); // Muestra el modal de "No es posible eliminar con préstamos activos"
    }
  };

  // =========================================================
  // MANEJO DE MODALES
  // =========================================================
  const abrirAgregar = () => {
    setSeleccionado(null);
    setForm(FORM_VACIO);
    setModalAgregar(true);
  };

  const abrirEditar = (inst) => {
    setSeleccionado(inst);
    setForm({
      codigo: inst.codigo,
      nombre: inst.nombre,
      id_categoria: inst.id_categoria,
      id_ubicacion: inst.id_ubicacion || "",
      cantidad_total: inst.cantidad_total,
      estado: inst.estado,
    });
    setModalEditar(true);
  };

  const abrirEliminar = (inst) => {
    setSeleccionado(inst);
    setModalEliminar(true);
  };

  // =========================================================
  // FILTROS Y PAGINACION (LÓGICA)
  // =========================================================
  const filtrados = instrumentos.filter((i) => {
    const matchNombre = !filtroNombre || i.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const matchCategoria = !filtroCategoria || String(i.id_categoria) === filtroCategoria;
    return matchNombre && matchCategoria;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const handleBuscar = () => setPagina(1);
  const handleLimpiar = () => {
    setFiltroNombre("");
    setFiltroCategoria("");
    setPagina(1);
  };

  // =========================================================
  // ESTADISTICAS (BR333, BR334)
  // =========================================================
  const estadisticas = useMemo(() => {
    const total = instrumentos.reduce((acc, i) => acc + i.cantidad_total, 0);
    const disponibles = instrumentos.reduce((acc, i) => acc + i.cantidad_disponible, 0);
    return { total, disponibles, ocupados: total - disponibles };
  }, [instrumentos]);

  // =========================================================
  // RETURN
  // =========================================================
  return {
    loading,
    instrumentos,
    categorias,
    ubicaciones,
    modalAdvertencia,
    setModalAdvertencia,
    ejecutarEdicion,
    filtroNombre,
    setFiltroNombre,
    filtroCategoria,
    setFiltroCategoria,
    pagina,
    setPagina,
    totalPaginas,
    paginados,
    modalAgregar,
    setModalAgregar,
    modalEditar,
    setModalEditar,
    modalEliminar,
    setModalEliminar,
    modalErrorEliminar,
    setModalErrorEliminar,
    seleccionado,
    setSeleccionado,
    form,
    setForm,
    errores,
    toast,
    estadisticas,
    validaciones, // <--- EXPORTADO PARA EL PANEL
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