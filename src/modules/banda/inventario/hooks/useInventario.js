import { useEffect, useMemo, useState, useCallback } from "react";
import { inventarioService } from "../services/inventarioService";
import { FORM_VACIO, ERRORES_VACIO, POR_PAGINA } from "../utils/inventarioConstants";

const useInventario = () => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [pagina, setPagina] = useState(1);

  // Modales
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalErrorEliminar, setModalErrorEliminar] = useState(false);
  const [modalAdvertencia, setModalAdvertencia] = useState(false);

  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState(ERRORES_VACIO);
  const [toast, setToast] = useState(null);

  // =========================================================
  // HELPER: MOSTRAR MENSAJES
  // =========================================================
  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(null), 4000);
  };

  // ✅ NUEVO HELPER: TRADUCTOR DE ERRORES DE FASTAPI
  const extraerErrorBackend = (e, mensajePorDefecto) => {
    if (e.response?.data?.detail) {
      const detail = e.response.data.detail;
      // Si es un error 422 (Array de validación de Pydantic)
      if (Array.isArray(detail)) {
        const campo = detail[0].loc[detail[0].loc.length - 1];
        return `Error en el campo '${campo}': ${detail[0].msg}`;
      }
      // Si es un error normal (String)
      return detail;
    }
    return mensajePorDefecto;
  };

  // =========================================================
  // CARGAR DATOS
  // =========================================================
  const cargarDatos = useCallback(async () => {
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
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // =========================================================
  // VALIDACIONES EN TIEMPO REAL
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

    const todoValido = (!isNaN(codigoVal) && codigoVal > 0 && codigoUnico) &&
                       (nombreVal?.length >= 3 && nombreUnico) &&
                       (!!form.id_categoria && cantidadVal >= 1);

    return {
      codigo: !isNaN(codigoVal) && codigoVal > 0 && codigoUnico,
      nombre: nombreVal?.length >= 3 && nombreUnico,
      datos: !!form.id_categoria && cantidadVal >= 1,
      todoValido
    };
  }, [form, instrumentos, seleccionado]);

  // =========================================================
  // HANDLERS (CREAR, EDITAR, ELIMINAR)
  // =========================================================
  const handleAgregar = async () => {
    if (!validaciones.todoValido) return;
    
    try {
      const payload = {
        codigo: parseInt(form.codigo),
        nombre: form.nombre.trim(),
        id_categoria: parseInt(form.id_categoria),
        id_ubicacion: form.id_ubicacion ? parseInt(form.id_ubicacion) : null,
        cantidad_total: parseInt(form.cantidad_total),
        estado: form.estado
      };

      await inventarioService.crearInstrumento(payload);
      setModalAgregar(false);
      cargarDatos();
      mostrarToast("Instrumento agregado correctamente.");
    } catch (e) { 
      console.error("Error 422 Payload:", e.response?.data);
      // ✅ USAMOS EL TRADUCTOR PARA EVITAR EL PANTALLAZO BLANCO
      mostrarToast(extraerErrorBackend(e, "Error al crear el instrumento."));
    }
  };

  const ejecutarEdicion = async () => {
    try {
      const payload = {
        nombre: form.nombre.trim(),
        id_categoria: parseInt(form.id_categoria),
        id_ubicacion: form.id_ubicacion ? parseInt(form.id_ubicacion) : null,
        cantidad_total: parseInt(form.cantidad_total),
        estado: form.estado
      };

      await inventarioService.editarInstrumento(seleccionado.id_instrumento, payload);
      setModalEditar(false);
      setModalAdvertencia(false);
      cargarDatos();
      mostrarToast("Instrumento actualizado.");
    } catch (e) { 
      console.error(e);
      mostrarToast(extraerErrorBackend(e, "Error al actualizar."));
    }
  };

  const handleEditar = async () => {
    if (!validaciones.todoValido) return;
    
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
      setSeleccionado(null);
      cargarDatos();
      mostrarToast("Instrumento eliminado.");
    } catch (e) {
      setModalEliminar(false);
      setModalErrorEliminar(true);
    }
  };

  // =========================================================
  // FILTRADO Y PAGINACIÓN
  // =========================================================
  const filtrados = useMemo(() => {
    return instrumentos.filter((i) => {
      const matchNombre = !filtroNombre || i.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const matchCat = !filtroCategoria || i.categoria_nombre === filtroCategoria;
      return matchNombre && matchCat;
    });
  }, [instrumentos, filtroNombre, filtroCategoria]);

  const paginados = useMemo(() => {
    return filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  }, [filtrados, pagina]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));

  return {
    loading, instrumentos, categorias, ubicaciones, seleccionado, setSeleccionado,
    filtroNombre, setFiltroNombre, filtroCategoria, setFiltroCategoria,
    pagina, setPagina, totalPaginas, paginados,
    modalAgregar, setModalAgregar, modalEditar, setModalEditar, modalEliminar, setModalEliminar,
    modalErrorEliminar, setModalErrorEliminar, modalAdvertencia, setModalAdvertencia,
    form, setForm, errores, toast, validaciones, ejecutarEdicion,
    abrirAgregar: () => { setForm(FORM_VACIO); setModalAgregar(true); },
    abrirEditar: (inst) => { setForm(inst); setModalEditar(true); },
    abrirEliminar: () => setModalEliminar(true),
    handleAgregar, handleEditar, handleEliminar, handleBuscar: () => setPagina(1),
    handleLimpiar: () => { setFiltroNombre(""); setFiltroCategoria(""); setPagina(1); }
  };
};

export default useInventario;