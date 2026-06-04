import { useEffect, useMemo, useState, useCallback } from "react";
import { prestamoService } from "../services/prestamoService";
import { allestudiantesRequest } from "../../../../api/endpoints";
import { FORM_VACIO, FORM_DEVOLUCION_VACIO, POR_PAGINA } from "../utils/prestamosConstants";

const usePrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [paginaEstudiantes, setPaginaEstudiantes] = useState(1);

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalDevolver, setModalDevolver] = useState(false);

  const [form, setForm] = useState(FORM_VACIO);
  const [formDevolucion, setFormDevolucion] = useState(FORM_DEVOLUCION_VACIO);
  const [toast, setToast] = useState(null);
  const [errores, setErrores] = useState({});

  const cargarDatos = useCallback(async () => {
    try {
      const [pRes, iRes, eRes] = await Promise.all([
        prestamoService.getPrestamos(),
        prestamoService.getInstrumentosDisponibles(),
        allestudiantesRequest(),
      ]);
      setPrestamos(pRes.data);
      setInstrumentos(iRes.data);
      setEstudiantes(eRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // --- LÓGICA ESTUDIANTES (Única tabla) ---
  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter(e => e.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()));
  }, [estudiantes, filtroNombre]);

  const estudiantesPaginados = useMemo(() => {
    return estudiantesFiltrados.slice((paginaEstudiantes - 1) * POR_PAGINA, paginaEstudiantes * POR_PAGINA);
  }, [estudiantesFiltrados, paginaEstudiantes]);

  const totalPaginasEstudiantes = Math.max(1, Math.ceil(estudiantesFiltrados.length / POR_PAGINA));

  // --- HANDLERS ---
  const handleAgregar = async () => {
    try {
      await prestamoService.crearPrestamo(form);
      setModalAgregar(false);
      setEstudianteSeleccionado(null);
      cargarDatos();
      setToast("Préstamo registrado.");
    } catch (e) { console.error(e); }
  };

  const handleDevolver = async () => {
   if (formDevolucion.estado_al_devolver === 'Malo' && !formDevolucion.observaciones?.trim()) {
      setErrores({ observaciones: "La descripción del daño es obligatoria." });
      return;
    }
    try {
      if (!prestamoSeleccionado) return;
      await prestamoService.devolverInstrumento(prestamoSeleccionado.id_prestamo, formDevolucion);
      setModalDevolver(false);
      setPrestamoSeleccionado(null);
      setEstudianteSeleccionado(null);
      setFormDevolucion(FORM_DEVOLUCION_VACIO);
      setErrores({});
      await cargarDatos();
      setToast("Instrumento devuelto correctamente.");
    } catch (e) { 
      console.error(e);
      setToast("Error al procesar la devolución.");
      await cargarDatos();
    }
  };

  const estadisticas = useMemo(() => {
    return { activos: prestamos.filter((p) => p.estado_entrega === "prestado").length };
  }, [prestamos]);

  return {
    prestamos, instrumentos, estudiantes, loading,
    estudianteSeleccionado, setEstudianteSeleccionado,
    prestamoSeleccionado, setPrestamoSeleccionado,
    filtroNombre, setFiltroNombre, 
    estudiantesPaginados, totalPaginasEstudiantes, paginaEstudiantes, setPaginaEstudiantes,
    modalAgregar, setModalAgregar, modalDevolver, setModalDevolver,
    form, setForm, formDevolucion, setFormDevolucion, toast,
    handleAgregar, handleDevolver, errores, setErrores, estadisticas,
    
    // ✅ LÓGICA INTELIGENTE: Busca el préstamo activo del estudiante seleccionado
    abrirModalDevolver: (estudiante) => { 
      const prestamoActivo = prestamos.find(p => p.id_estudiante === estudiante.id_estudiante && p.estado_entrega === "prestado");
      if (prestamoActivo) {
        setPrestamoSeleccionado(prestamoActivo);
        setFormDevolucion(FORM_DEVOLUCION_VACIO);
        setErrores({});
        setModalDevolver(true); 
      }
    }
  };
};

export default usePrestamos;