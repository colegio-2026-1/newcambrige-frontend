import { useEffect, useMemo, useState, useCallback } from "react";
import { 
  getPrestamosRequest, 
  getInstrumentosDisponiblesRequest, 
  getEstudiantesRequest,
  asignarInstrumentoRequest, 
  devolverInstrumentoRequest 
} from "../../../../api/endpointsBanda";

import { FORM_VACIO, FORM_DEVOLUCION_VACIO, POR_PAGINA } from "../utils/prestamosConstants";

const usePrestamos = () => {
  // ── ESTADOS ──
  const [prestamos, setPrestamos] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroDocumento, setFiltroDocumento] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [paginaEstudiantes, setPaginaEstudiantes] = useState(1);

  const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });
  const showAlert = (type, message, title = '') => setAlert({ isOpen: true, type, message, title });
  const closeAlert = () => setAlert(prev => ({ ...prev, isOpen: false }));

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalDevolver, setModalDevolver] = useState(false);

  const [form, setForm] = useState(FORM_VACIO);
  const [formDevolucion, setFormDevolucion] = useState(FORM_DEVOLUCION_VACIO);
  const [toast, setToast] = useState(null);
  const [errores, setErrores] = useState({});

  // ── CARGA DE DATOS ──
  const cargarDatos = useCallback(async () => {
    try {
      const [pRes, iRes, eRes] = await Promise.all([
        getPrestamosRequest(),
        getInstrumentosDisponiblesRequest(),
        getEstudiantesRequest(),
      ]);
      setPrestamos(pRes.data || []);
      setInstrumentos(iRes.data || []);
      setEstudiantes(eRes.data || []);
    } catch (e) {
      console.error("Error en conexión:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const opcionesGrado = useMemo(() => {
    return [...new Set(estudiantes.map(e => e.salon?.grado).filter(Boolean))].sort();
  }, [estudiantes]);

  const opcionesGrupo = useMemo(() => {
    if (!filtroGrado) return [];
    const filtrados = estudiantes.filter(e => e.salon?.grado === filtroGrado);
    return [...new Set(filtrados.map(e => e.salon?.grupo).filter(Boolean))].sort();
  }, [estudiantes, filtroGrado]);

  // ── LÓGICA DE SELECCIÓN SEGURA ──
  const seleccionarEstudiante = (est) => {
    setEstudianteSeleccionado(est);
    if (est) {
      setForm(prev => ({ ...prev, id_estudiante: est.id_estudiante }));
    } else {
      setForm(FORM_VACIO);
    }
  };

  // ── FILTRADO Y PAGINACIÓN ──
  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter(e => {
      const matchDoc = !filtroDocumento || String(e.documento).includes(filtroDocumento);
      const matchNom = !filtroNombre || e.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      const matchGra = !filtroGrado || e.salon?.grado === filtroGrado;
      const matchGru = !filtroGrupo || e.salon?.grupo === filtroGrupo;
      return matchDoc && matchNom && matchGra && matchGru;
    });
  }, [estudiantes, filtroDocumento, filtroNombre, filtroGrado, filtroGrupo]);

  const estudiantesPaginados = useMemo(() => {
    const inicio = (paginaEstudiantes - 1) * POR_PAGINA;
    return estudiantesFiltrados.slice(inicio, inicio + POR_PAGINA);
  }, [estudiantesFiltrados, paginaEstudiantes]);

  const totalPaginasEstudiantes = Math.max(1, Math.ceil(estudiantesFiltrados.length / POR_PAGINA));

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
      await devolverInstrumentoRequest(prestamoSeleccionado.id_prestamo, formDevolucion);
      setModalDevolver(false); 
      await cargarDatos();
      showAlert("success", "Instrumento devuelto exitosamente."); 
    } catch (e) { showAlert("error", "No se pudo procesar la devolución."); }
  };

   return {
    prestamos, instrumentos, estudiantes, loading,
    estudianteSeleccionado, seleccionarEstudiante,
    prestamoSeleccionado, filtroNombre, setFiltroNombre, 
    filtroDocumento, setFiltroDocumento, filtroGrado, setFiltroGrado, filtroGrupo, setFiltroGrupo,
    opcionesGrado, opcionesGrupo, 
    estudiantesPaginados, paginaEstudiantes, setPaginaEstudiantes,
    totalPaginasEstudiantes,
    modalAgregar, setModalAgregar, modalDevolver, setModalDevolver,
    form, setForm, formDevolucion, setFormDevolucion, 
    alert, closeAlert, errores, setErrores,
    handleAgregar, handleDevolver,
    handleBuscar: () => setPaginaEstudiantes(1),
    handleLimpiar: () => {
      setFiltroDocumento(""); setFiltroNombre(""); setFiltroGrado(""); 
      setFiltroGrupo(""); setPaginaEstudiantes(1);
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