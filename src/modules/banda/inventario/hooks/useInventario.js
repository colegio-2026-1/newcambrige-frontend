import { useEffect, useMemo, useState, useCallback } from "react";
import { FORM_VACIO } from "../utils/inventarioConstants";
import { 
  getInstrumentosRequest, 
  getCategoriasRequest, 
  createInstrumentoRequest,
  updateInstrumentoRequest,
  deleteInstrumentoRequest 
} from "../../../../api/endpointsBanda";

const useInventario = () => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  const [filtroId, setFiltroId] = useState(""); 
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const [form, setForm] = useState(FORM_VACIO);
  
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    onClose: null,
    onCancel: null,
    acceptText: "Aceptar",
  });

  const closeAlert = useCallback(() => {
    setAlert((prev) => ({
      ...prev,
      isOpen: false
    }));
  }, []);


  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  
  const showAlert = useCallback((type, title, message, onConfirmAction = null, onCancelAction = null, acceptText = "Aceptar") => {
    setAlert({
      isOpen: true,
      type,
      title,
      message,
      onClose: onConfirmAction ? () => { onConfirmAction(); closeAlert(); } : closeAlert,
      onCancel: onCancelAction || null,
      acceptText
    });
  }, [closeAlert]);

  
  const extraerErrorBackend = (e, mensajePorDefecto) => {
    if (e.response?.data?.detail) {
      const detail = e.response.data.detail;
      return Array.isArray(detail) ? `Error: ${detail[0].msg}` : detail;
    }
    return mensajePorDefecto;
  };

  const cargarDatos = useCallback(async () => {
    try {
      const [instRes, catRes] = await Promise.all([
        getInstrumentosRequest(),
        getCategoriasRequest(),
      ]);
      setInstrumentos(instRes.data || []);
      setCategorias(catRes.data || []);
    } catch (error) {
      showAlert("error", "Error", "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);
  const validaciones = useMemo(() => {
  const nombreVal = form.nombre?.trim();

  const nombreUnico = !instrumentos.some(i =>
    i.nombre.toLowerCase() === nombreVal?.toLowerCase() &&
    i.id_instrumento !== seleccionado?.id_instrumento
  );

  const cantidadVal = Number(form.cantidad_total);

  const todoValido =
    nombreVal?.length >= 2 &&
    nombreUnico &&
    !!form.id_categoria;

  return {
    nombre: nombreVal?.length >= 2 && nombreUnico,
    datos: !!form.id_categoria && !isNaN(cantidadVal) && cantidadVal >= 0,
    todoValido
  };
}, [form, instrumentos, seleccionado]);

  const handleAgregar = async () => {
    if (!form.nombre || !form.id_categoria || form.cantidad_total === "" || form.cantidad_total === null) {
      showAlert("error", "Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const payload = {
        nombre: form.nombre.trim(),
        id_categoria: parseInt(form.id_categoria),
        cantidad_total: 1,
        estado: form.estado || "Activo"
      };

      await createInstrumentoRequest(payload);
      setModalAgregar(false);
      await cargarDatos();
      showAlert("success", "Operación Exitosa", "Instrumento agregado correctamente.");
    } catch (e) { 
      showAlert("error", "Error", extraerErrorBackend(e, "Error al crear el instrumento."));
    }
  };

  const ejecutarEdicion = async () => {
    try {
      const payload = {
        nombre: form.nombre.trim(),
        id_categoria: parseInt(form.id_categoria),
        cantidad_total: 1,
        estado: form.estado
      };
      console.log("EDITANDO", payload);

      await updateInstrumentoRequest(seleccionado.id_instrumento, payload);
      setModalEditar(false);
      await cargarDatos();
      showAlert("success", "Operación Exitosa", "Cambios guardados.");
    } catch (e) { 
      showAlert("error", "Error", extraerErrorBackend(e, "Error al actualizar."));
    }
  };

  const handleEditar = async () => {
    if (!validaciones.todoValido) return;
    if (seleccionado?.estado === "Activo" && form.estado !== "Activo" && seleccionado?.cantidad_disponible < seleccionado?.cantidad_total) {
      showAlert("warning", "Advertencia", "El instrumento tiene unidades prestadas. Cambiar su estado a inactivo puede afectar las asignaciones actuales. ¿Deseas continuar?", 
        ejecutarEdicion, closeAlert, "Sí, continuar");
      return;
    }
    await ejecutarEdicion();
  };

   const handleEliminar = async () => {
    try {
      await deleteInstrumentoRequest(seleccionado.id_instrumento);
      setSeleccionado(null);
      await cargarDatos();
      showAlert("success", "Operación Exitosa", "Registro eliminado.");
    } catch (e) {
      if (e.response?.status === 400) {
        showAlert("error", "OPERACIÓN DENEGADA", "No es posible eliminar este instrumento porque existen préstamos vigentes asociados a él.");
      } else {
        showAlert("error", "Error", extraerErrorBackend(e, "Ocurrió un error inesperado al eliminar."));
      }
    }
  };

  const filtrados = useMemo(() => {
    return instrumentos.filter((i) => {
      const matchId = !filtroId || i.id_instrumento.toString().includes(filtroId);
      const matchNombre = !filtroNombre || i.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const matchCat = !filtroCategoria || i.categoria_nombre === filtroCategoria;
      return matchId && matchNombre && matchCat;
    });
  }, [instrumentos, filtroId, filtroNombre, filtroCategoria]);

  
  return {
    loading, categorias, seleccionado, setSeleccionado,
    setFiltroId, setFiltroNombre, setFiltroCategoria, filtrados,
    modalAgregar, setModalAgregar, modalEditar, setModalEditar,
    form, setForm, alert, showAlert, closeAlert, validaciones, ejecutarEdicion,
    abrirAgregar: () => { setSeleccionado(null); setForm(FORM_VACIO); setModalAgregar(true); },
    abrirEditar: (inst) => {
      if (!inst) return;
      setForm({
        id_instrumento: inst.id_instrumento,
        nombre: inst.nombre,
        id_categoria: inst.id_categoria,
        cantidad_total: inst.cantidad_total,
        estado: inst.estado
      });
      setModalEditar(true);
    }, 
    abrirEliminar: () => {
      if (!seleccionado) return;
      showAlert("warning", "ELIMINAR", `¿Eliminar permanentemente ${seleccionado.nombre}?`,
         handleEliminar, closeAlert, "Eliminar");
    },


    handleAgregar, handleEditar,
     handleBuscar: () => {},
    handleLimpiar: () => { setFiltroId(""); setFiltroNombre(""); setFiltroCategoria(""); }
  };
};

export default useInventario;