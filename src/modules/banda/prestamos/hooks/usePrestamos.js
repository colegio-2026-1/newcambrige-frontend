import { useEffect, useMemo, useState, useCallback } from "react";
import { 
  getPrestamosRequest, 
  getInstrumentosDisponiblesRequest, 
  getEstudiantesRequest,
  getSalonesRequest,
  asignarInstrumentoRequest, 
  devolverInstrumentoRequest 
} from "../../../../api/endpointsBanda";

import { FORM_VACIO, FORM_DEVOLUCION_VACIO } from "../utils/prestamosConstants";

const usePrestamos = () => {
  // ── ESTADOS ──
  const [prestamos, setPrestamos] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salones, setSalones] = useState([]);

  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("");

  const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });
    const closeAlert = () => setAlert(prev => ({ ...prev, isOpen: false }));

 const showAlert = useCallback((type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  }, []);

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalDevolver, setModalDevolver] = useState(false);

  const [form, setForm] = useState(FORM_VACIO);
  const [formDevolucion, setFormDevolucion] = useState(FORM_DEVOLUCION_VACIO);
  const [errores, setErrores] = useState({});

  // ── CARGA DE DATOS ──
  const cargarDatos = useCallback(async () => {
    try {
      const [pRes, iRes, eRes, sRes] = await Promise.all([
        getPrestamosRequest(),
        getInstrumentosDisponiblesRequest(),
        getEstudiantesRequest(),
        getSalonesRequest(),
      ]);
      setPrestamos(pRes.data || []);
      setInstrumentos(iRes.data || []);
      setEstudiantes(eRes.data || []);
      setSalones(sRes.data || []);
    } catch (e) {
      console.error("Error en conexión:", e);
      showAlert("error", "Error de Conexión", "No se pudieron cargar los datos del servidor.");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const salonesMap = useMemo(() => {
    return Object.fromEntries(salones.map(s => [s.id_salon, s]));
  }, [salones]);

   const opcionesGrado = useMemo(() => 
    [...new Set(salones.map(s => s.grado).filter(Boolean))].sort(),
    [salones]
  );

  const opcionesGrupo = useMemo(() => {
  if (!filtroGrado) return [];

  return [...new Set(
    salones
      .filter(s => String(s.grado) === String(filtroGrado))
      .map(s => s.grupo)
      .filter(Boolean)
  )].sort();
}, [salones, filtroGrado]);

  // ── FILTRADO DE TABLA ──
  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter(e => {
      const salon = salonesMap[e.id_salon];

      const matchDoc = !filtroDocumento || String(e.documento).includes(filtroDocumento);
      const matchNom = !filtroNombre || e.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const matchGra =
  !filtroGrado ||
  String(salon?.grado) === String(filtroGrado);

const matchGru =
  !filtroGrupo ||
  String(salon?.grupo) === String(filtroGrupo);
      return matchDoc && matchNom && matchGra && matchGru;
    });
  }, [estudiantes, filtroDocumento, filtroNombre, filtroGrado, filtroGrupo, salonesMap]);

  // ── LÓGICA DE SELECCIÓN SEGURA ──
  const seleccionarEstudiante = (est) => {
    setEstudianteSeleccionado(est);
    if (est) {
      setForm(prev => ({ ...prev, id_estudiante: est.id_estudiante }));
    } else {
      setForm(FORM_VACIO);
    }
  };

  // ── HANDLERS (LOGICA DE BOTONES) ──

  const handleAgregar = async () => {
    const idInst = parseInt(form.id_instrumento);
    const idEst = parseInt(form.id_estudiante);
    if (!idInst || !idEst) { showAlert("warning", "Por favor seleccione un instrumento."); return; }
    try {
      await asignarInstrumentoRequest({ id_instrumento: idInst, id_estudiante: idEst, observacion: form.observacion });
      setModalAgregar(false); setForm(FORM_VACIO); setEstudianteSeleccionado(null);
      await cargarDatos(); 
      showAlert("success", "Instrumento asignado correctamente.");
    } catch (e) { showAlert("error", "No se pudo realizar la asignación."); }
  };

  const handleDevolver = async () => {
    if (formDevolucion.estado_al_devolver === 'Malo' && !formDevolucion.observaciones?.trim()) {
      setErrores({ observaciones: "Requerido para mantenimiento." }); return;
    }
    try {
      if (!prestamoSeleccionado)return;
      await devolverInstrumentoRequest(prestamoSeleccionado.id_prestamo, formDevolucion);
      setModalDevolver(false); 
      await cargarDatos();
      showAlert("success", "exito", "Instrumento devuelto exitosamente."); 
    } catch (e) { showAlert("error","error", "No se pudo procesar la devolución."); }
  };

   return {
    prestamos, instrumentos, estudiantes, loading,
    estudianteSeleccionado, seleccionarEstudiante,
    prestamoSeleccionado, filtroNombre, setFiltroNombre, 
    filtroDocumento, setFiltroDocumento, filtroGrado, setFiltroGrado, filtroGrupo, setFiltroGrupo,
    opcionesGrado, opcionesGrupo, salonesMap,
    estudiantesFiltrados,
    modalAgregar, setModalAgregar, modalDevolver, setModalDevolver,
    form, setForm, formDevolucion, setFormDevolucion, 
    alert, closeAlert, errores, setErrores,
    handleAgregar, handleDevolver,
    handleBuscar: () => {},
    handleLimpiar: () => {
      setFiltroDocumento(""); setFiltroNombre(""); setFiltroGrado(""); 
      setFiltroGrupo("");
    },
    abrirModalDevolver: (estudiante) => { 
      const p = (prestamos || []).find(p => String(p.id_estudiante) === String(estudiante.id_estudiante) && p.estado_entrega === "prestado");
      if (p) {
        setPrestamoSeleccionado(p);
        setFormDevolucion(FORM_DEVOLUCION_VACIO);
        setErrores({});
        setModalDevolver(true); 
      } else {
        showAlert("info", "El estudiante no tiene instrumentos prestados.");
      }
    }
  };
};

export default usePrestamos;