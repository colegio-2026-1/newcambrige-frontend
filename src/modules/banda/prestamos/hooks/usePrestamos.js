import { useEffect, useMemo, useState, useCallback } from "react";
import { prestamoService } from "../services/prestamoService";
import { bandaService } from "../../../../api/bandaService";
import { FORM_VACIO, FORM_DEVOLUCION_VACIO, POR_PAGINA } from "../utils/prestamosConstants";

const usePrestamos = () => {
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
  const [filtroAño, setFiltroAño] = useState("");
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
        bandaService.getEstudiantes(),
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
    return estudiantes.filter(e => {
      const matchDoc = !filtroDocumento || e.documento.includes(filtroDocumento);
      const matchNom = !filtroNombre || e.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      // Nota: asumiendo que el objeto estudiante trae e.salon_grado y e.salon_grupo
      const matchGra = !filtroGrado || e.salon_grado === filtroGrado;
      const matchGru = !filtroGrupo || e.salon_grupo === filtroGrupo;
      
      return matchDoc && matchNom && matchGra && matchGru;
    });
  }, [estudiantes, filtroDocumento, filtroNombre, filtroGrado, filtroGrupo]);


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
    filtroNombre, setFiltroNombre, filtroDocumento, setFiltroDocumento, 
    filtroGrado, setFiltroGrado, filtroGrupo, setFiltroGrupo, filtroAño, setFiltroAño,
    estudiantesPaginados, totalPaginasEstudiantes, paginaEstudiantes, setPaginaEstudiantes,
    modalAgregar, setModalAgregar, modalDevolver, setModalDevolver,
    form, setForm, formDevolucion, setFormDevolucion, toast,
    handleAgregar, handleDevolver, errores, setErrores, estadisticas,
    
    handleLimpiar: () => {
      setFiltroDocumento(""); setFiltroNombre(""); setFiltroGrado(""); setFiltroGrupo(""); setFiltroAño("");
      setPaginaEstudiantes(1);
    },
        handleBuscar: () => setPaginaEstudiantes(1),
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