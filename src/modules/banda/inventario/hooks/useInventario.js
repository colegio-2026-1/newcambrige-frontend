import { useEffect, useMemo, useState, useCallback } from "react";
import { inventarioService } from "../services/inventarioService";
import { FORM_VACIO, ERRORES_VACIO, POR_PAGINA } from "../utils/inventarioConstants";

const useInventario = () => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  // ✅ Filtros actualizados para coincidir con la imagen
  const [filtroId, setFiltroId] = useState(""); 
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [pagina, setPagina] = useState(1);

  const [form, setForm] = useState(FORM_VACIO);
  const [toast, setToast] = useState(null);

  // Modales
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalErrorEliminar, setModalErrorEliminar] = useState(false);
  const [modalAdvertencia, setModalAdvertencia] = useState(false);

  const mostrarToast = (mensaje) => {
    setToast(mensaje);
    setTimeout(() => setToast(null), 4000);
  };

  const extraerErrorBackend = (e, mensajePorDefecto) => {
    if (e.response?.data?.detail) {
      const detail = e.response.data.detail;
      return Array.isArray(detail) ? `Error: ${detail[0].msg}` : detail;
    }
    return mensajePorDefecto;
  };

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
      mostrarToast("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // ✅ VALIDACIONES SIN 'CODIGO' (id_instrumento es automático)
  const validaciones = useMemo(() => {
    const nombreVal = form.nombre?.trim();
    const cantidadVal = parseInt(form.cantidad_total);

    const nombreUnico = !instrumentos.some(
      (i) => i.nombre.toLowerCase() === nombreVal?.toLowerCase() && i.id_instrumento !== seleccionado?.id_instrumento
    );

    const todoValido = (nombreVal?.length >= 2 && nombreUnico) &&
                       (!!form.id_categoria && !isNaN(cantidadVal) && cantidadVal >= 0);

    return {
      ombre: nombreVal?.length >= 2 && nombreUnico,
      datos: !!form.id_categoria && !isNaN(cantidadVal) && cantidadVal >= 0,
      todoValido
    };
  }, [form, instrumentos, seleccionado]);

  // ✅ PAYLOAD LIMPIO (Evita error 422 en el Backend)
  const handleAgregar = async () => {
  // Ajustamos la validación para que no dependa de 'codigo'
  if (!form.nombre || !form.id_categoria || !form.cantidad_total) {
    mostrarToast("Por favor complete los campos obligatorios.");
    return;
  }
  
  try {
    const payload = {
      // ❌ ELIMINAMOS 'codigo' de aquí, ya no se envía
      nombre: form.nombre.trim(),
      id_categoria: parseInt(form.id_categoria),
      id_ubicacion: form.id_ubicacion ? parseInt(form.id_ubicacion) : null,
      cantidad_total: parseInt(form.cantidad_total),
      estado: form.estado || "Activo"
    };

    await inventarioService.crearInstrumento(payload);
    setModalAgregar(false);
    cargarDatos();
    mostrarToast("Instrumento agregado correctamente.");
  } catch (e) { 
    console.error("Error al guardar:", e.response?.data);
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
      mostrarToast("Cambios guardados.");
    } catch (e) { 
      mostrarToast(extraerErrorBackend(e, "Error al actualizar."));
    }
  };

  const handleEditar = async () => {
    if (!validaciones.todoValido) return;
    // Lógica de advertencia si se cambia a inactivo con préstamos
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
      mostrarToast("Registro eliminado.");
    } catch (e) {
      setModalEliminar(false);
      setModalErrorEliminar(true);
    }
  };

  // ✅ FILTRADO POR ID Y NOMBRE (Sincronizado con la SearchBar)
  const filtrados = useMemo(() => {
    return instrumentos.filter((i) => {
      const matchId = !filtroId || i.id_instrumento.toString().includes(filtroId);
      const matchNombre = !filtroNombre || i.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const matchCat = !filtroCategoria || i.categoria_nombre === filtroCategoria;
      return matchId && matchNombre && matchCat;
    });
  }, [instrumentos, filtroId, filtroNombre, filtroCategoria]);

  const paginados = useMemo(() => {
    return filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  }, [filtrados, pagina]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));

  return {
    loading, categorias, ubicaciones, seleccionado, setSeleccionado,
    setFiltroId, setFiltroNombre, setFiltroCategoria,
    pagina, setPagina, totalPaginas, paginados,
    modalAgregar, setModalAgregar, modalEditar, setModalEditar, modalEliminar, setModalEliminar,
    modalErrorEliminar, setModalErrorEliminar, modalAdvertencia, setModalAdvertencia,
    form, setForm, toast, validaciones, ejecutarEdicion,
    abrirAgregar: () => { setForm(FORM_VACIO); setModalAgregar(true); },
    abrirEditar: (inst) => { setForm(inst); setModalEditar(true); },
    abrirEliminar: () => setModalEliminar(true),
    handleAgregar, handleEditar, handleEliminar, handleBuscar: () => setPagina(1),
    handleLimpiar: () => { setFiltroId(""); setFiltroNombre(""); setFiltroCategoria(""); setPagina(1); }
  };
};

export default useInventario;