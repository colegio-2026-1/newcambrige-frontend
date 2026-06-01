import { useEffect, useMemo, useState, useCallback } from "react";
import { prestamoService } from "../services/prestamoService";
import { allestudiantesRequest } from "../../../../api/endpoints";
import { FORM_VACIO, FORM_DEVOLUCION_VACIO, POR_PAGINA } from "../utils/prestamosConstants";

const usePrestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selecciones para DataTable
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [pagina, setPagina] = useState(1);
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

  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter(e => e.nombre?.toLowerCase().includes(filtroNombre.toLowerCase()));
  }, [estudiantes, filtroNombre]);

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
      setFormDevolucion(FORM_DEVOLUCION_VACIO); // Resetear formulario
      setErrores({});
      
      await cargarDatos();
      setToast("Instrumento devuelto correctamente.");
    } catch (e) { 
      console.error(e);
      setToast("Error al procesar la devolución.");
      await cargarDatos(); // Refrescar datos para evitar inconsistencias
    }
  };


  return {
    prestamos, instrumentos, estudiantes, loading,
    estudianteSeleccionado, setEstudianteSeleccionado,
    prestamoSeleccionado, setPrestamoSeleccionado,
    filtroNombre, setFiltroNombre, estudiantesFiltrados,
    modalAgregar, setModalAgregar, modalDevolver, setModalDevolver,
    form, setForm, formDevolucion, setFormDevolucion, toast,
    handleAgregar, handleDevolver, errores, setErrores,
    abrirModalDevolver: (p) => { setPrestamoSeleccionado(p);setFormDevolucion(FORM_DEVOLUCION_VACIO);
      setErrores({});
      setModalDevolver(true); }
  };
};

export default usePrestamos;