import { useState, useEffect, useMemo } from "react";
import Header from "../../../components/layout/header";
import ModuleLayout from "../../../components/layout/ModuleLayout";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../../components/shared/searchBar";
import ActionButtons from "../../../components/shared/ActionButtons";
import DataTable from "../../../components/shared/DataTable";
import Modal from "../../../components/shared/Modal";
import {
  getAsignacionesRequest,
  deletePrestamoRequest,
  devolverPrestamoRequest,
  getObjetosDisponiblesRequest,
  registrarPrestamoRequest
} from "../../../api/uniformesService";
import { useAuth } from "../../../api/useAuth";
import {
  allrolesuserRequest,
  allaniosacademicosRequest
} from "../../../api/endpoints";
import "../styles/uniformes.css";

// ─── Utilidad ────────────────────────────────────────────────────────────────
const capitalizar = (texto) =>
  texto
    ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
    : "—";

// ─── Columnas de la tabla (definidas fuera del componente: una sola instancia) ─
const COLUMNS = [
  { key: "codigo", label: "Código" },
  { key: "nombre_completo", label: "Nombre completo" },
  { key: "grado", label: "Grado" },
  { key: "grupo", label: "Grupo" },
  {
    key: "prenda",
    label: "Prenda",
    render: (val) => capitalizar(val)
  },
  {
    key: "fecha_entrega",
    label: "Fecha Entrega",
    render: (_, row) =>
      row.fecha_entrega
        ? new Date(row.fecha_entrega).toLocaleDateString("es-CO")
        : "—"
  },
  {
    key: "estado",
    label: "Estado",
    render: (val) => {
      const estado = val?.toLowerCase();
      let clase = "badge--default";
      if (estado === "prestado")     clase = "badge--warn";
      else if (estado === "bueno")   clase = "badge--good";
      else if (estado === "regular") clase = "badge--regular";
      else if (estado === "malo")    clase = "badge--bad";
      else if (estado === "sin asignar") clase = "badge--no";
      return <span className={clase}>{capitalizar(val)}</span>;
    }
  }
];

export default function AsignacionesPage() {
  const { user } = useAuth();

  // ── Estados de la interfaz ──────────────────────────────────────────────────
  const [roles, setRoles]               = useState([]);
  const [selectedRow, setSelectedRow]   = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [periodos, setPeriodos]         = useState([]);
  const [periodosCargados, setPeriodosCargados] = useState(false);

  // ── Modales ─────────────────────────────────────────────────────────────────
  const [openModal, setOpenModal]       = useState(false);
  const [openDevolver, setOpenDevolver] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);

  // ── Estado interno del modal AsignarPrenda ───────────────────────────────────
  const [prendas, setPrendas]           = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  const [formAsignar, setFormAsignar]   = useState({
    id_objeto: "",
    talla: "",
    fecha_prestamo: "",
    estado: "bueno",
    observacion: ""
  });

  const fechaVisual = new Date().toLocaleDateString("es-CO");

  // Cargar prendas disponibles y resetear formulario al abrir el modal
  useEffect(() => {
    const cargarPrendas = async () => {
      try {
        const response = await getObjetosDisponiblesRequest();
        setPrendas(response.data);
      } catch (error) {
        console.error("Error cargando prendas:", error);
      }
    };

    if (openModal) {
      cargarPrendas();
      setFormAsignar({
        id_objeto: "",
        talla: "",
        fecha_prestamo: fechaVisual,
        estado: "bueno",
        observacion: ""
      });
    }
  }, [openModal, fechaVisual]);

  const opcionesPrendas = useMemo(
    () => prendas.map((item) => ({ value: item.id_objeto, label: item.nombre })),
    [prendas]
  );

  const prendaSeleccionada = prendas.find(
    (p) => p.id_objeto === Number(formAsignar.id_objeto)
  );

  const handleAsignarSubmit = async () => {
    if (loadingModal) return;

    if (!formAsignar.id_objeto) {
      alert("Seleccione una prenda");
      return;
    }
    if (prendaSeleccionada?.tipo === "vestimenta" && !formAsignar.talla) {
      alert("Seleccione una talla");
      return;
    }
    if (!selectedRow?.id_estudiante) {
      alert("Debe seleccionar un estudiante");
      return;
    }

    const data = {
      id_objeto: parseInt(formAsignar.id_objeto),
      id_estudiante: selectedRow.id_estudiante,
      talla: prendaSeleccionada?.tipo === "vestimenta" ? formAsignar.talla : null,
      estado: formAsignar.estado,
      cantidad_prestada: 1
    };

    try {
      setLoadingModal(true);
      await registrarPrestamoRequest(data);
      alert("Prenda asignada correctamente");
      await cargarAsignaciones();
      setOpenModal(false);
    } catch (error) {
      console.error("ERROR BACKEND:", error.response?.data);
      alert(error.response?.data?.detail || "Error al registrar préstamo");
    } finally {
      setLoadingModal(false);
    }
  };

  // ── Formulario devolución ────────────────────────────────────────────────────
  const [formDevolucion, setFormDevolucion] = useState({
    prenda: "",
    talla: "",
    fecha_entrega: "",
    fecha_devolucion: "",
    estado_entrega: "",
    estado_devolucion: "",
    observacion: ""
  });

  // ── Filtros ──────────────────────────────────────────────────────────────────
  const [filtros, setFiltros] = useState({
    codigo: "", nombre: "", grado: "", grupo: "", anio: ""
  });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    codigo: "", nombre: "", grado: "", grupo: "", anio: ""
  });

  const idUser = user?.id_usuario;
  const rol    = roles[0] || "Rol no asignado";

  // ── Carga de periodos ────────────────────────────────────────────────────────
  const cargarPeriodos = async () => {
    try {
      const res = await allaniosacademicosRequest();
      setPeriodos(res.data);

      const periodoActivo = res.data.find((periodo) => periodo.activo);
      const anioActivo    = periodoActivo?.nombre || "";

      setFiltros((prev)          => ({ ...prev, anio: anioActivo }));
      setFiltrosAplicados((prev) => ({ ...prev, anio: anioActivo }));
    } catch (error) {
      console.error("Error cargando periodos", error);
    } finally {
      setPeriodosCargados(true);
    }
  };

  // ── Carga inicial unificada ──────────────────────────────────────────────────
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        const resAsignaciones = await getAsignacionesRequest();
        setAsignaciones(resAsignaciones.data);

        if (idUser) {
          const resRoles = await allrolesuserRequest(idUser);
          setRoles(resRoles?.data || []);
        }
      } catch (error) {
        console.error("Error cargando datos del módulo:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarDatosIniciales();
  }, [idUser]);

  useEffect(() => {
    cargarPeriodos();
  }, []);

  const cargarAsignaciones = async () => {
    try {
      const response = await getAsignacionesRequest();
      setAsignaciones(response.data);
    } catch (error) {
      console.error("Error cargando asignaciones", error);
    }
  };

  // ── Eliminar ─────────────────────────────────────────────────────────────────
  const eliminarAsignacion = async (id) => {
    try {
      await deletePrestamoRequest(id);
      await cargarAsignaciones();
      setSelectedRow(null);
    } catch (error) {
      console.error("Error deleting loan assignment", error);
      throw error;
    }
  };

  const confirmarEliminarAsignacion = async () => {
    if (!selectedRow) return;
    try {
      await eliminarAsignacion(selectedRow.id_prestamo);
      setOpenEliminar(false);
    } catch (error) {
      console.error("Error al confirmar la eliminación de la asignación:", error);
      alert("No se pudo eliminar la asignación. Intente de nuevo.");
    }
  };

  // ── Devolver ─────────────────────────────────────────────────────────────────
  const devolverPrenda = async () => {
    if (!selectedRow) {
      alert("Seleccione una asignación");
      return;
    }
    if (!formDevolucion.estado_devolucion) {
      alert("Seleccione el estado de devolución");
      return;
    }
    if (
      formDevolucion.estado_devolucion === "Malo" &&
      !formDevolucion.observacion.trim()
    ) {
      alert("Debe ingresar una observación cuando la prenda se devuelve en mal estado");
      return;
    }

    try {
      await devolverPrestamoRequest(selectedRow.id_prestamo, {
        estado_devolucion: formDevolucion.estado_devolucion,
        observacion: formDevolucion.observacion
      });

      await cargarAsignaciones();
      setOpenDevolver(false);
      setFormDevolucion({
        prenda: "", talla: "", fecha_entrega: "", fecha_devolucion: "",
        estado_entrega: "", estado_devolucion: "", observacion: ""
      });
      alert("Devolución registrada");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Error devolver prenda");
    }
  };

  // ── Opciones de filtros ──────────────────────────────────────────────────────
  const opcionesGrados = useMemo(() =>
    asignaciones
      .map((item) => item.grado?.toString())
      .filter((value, index, self) => value && self.indexOf(value) === index)
      .sort((a, b) => Number(a) - Number(b)),
    [asignaciones]
  );

  const opcionesGrupos = useMemo(() => {
    if (filtros.grado === "") return [];
    return asignaciones
      .filter((item) => item.grado?.toString() === filtros.grado)
      .map((item) => item.grupo?.toString())
      .filter((value, index, self) => value && self.indexOf(value) === index)
      .sort();
  }, [asignaciones, filtros.grado]);

  const opcionesAnios = useMemo(() =>
    periodos.map((p) => p.nombre).filter(Boolean),
    [periodos]
  );

  // ── Filtrado ─────────────────────────────────────────────────────────────────
  const asignacionesFiltradas = useMemo(() =>
    asignaciones.filter((item) => {
      const coincideCodigo  = filtrosAplicados.codigo === "" ||
        item.codigo?.toString().includes(filtrosAplicados.codigo);
      const coincideNombre  = filtrosAplicados.nombre === "" ||
        item.nombre_completo?.toLowerCase().includes(filtrosAplicados.nombre.toLowerCase());
      const coincideGrado   = filtrosAplicados.grado === "" ||
        item.grado?.toString() === filtrosAplicados.grado;
      const coincideGrupo   = filtrosAplicados.grupo === "" ||
        item.grupo?.toString() === filtrosAplicados.grupo;
      const coincideAnio    = filtrosAplicados.anio === "" ||
        item.anio?.toString() === filtrosAplicados.anio;
      return coincideCodigo && coincideNombre && coincideGrado && coincideGrupo && coincideAnio;
    }),
    [asignaciones, filtrosAplicados]
  );

  // ── Guard ─────────────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ padding: "30px", fontFamily: "sans-serif", fontWeight: "600" }}>
        Cargando usuario...
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="uniformes-page">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            user={{ nombre: user?.nombre || "admin", rol }}
            menuItems={[
              { label: "Inicio", path: "/home" },
              { label: "Asignaciones", path: "/uniformes/asignaciones" },
              { label: "Inventario Prenda", path: "/uniformes/inventario" }
            ]}
            selectedMenu="Asignaciones"
          />
        }
        actions={
          <ActionButtons
            filaSeleccionada={selectedRow}
            botones={[
              {
                label: "Asignar Prenda",
                onClick: () => setOpenModal(true),
                variante: "primary"
              },
              {
                label: "Devolver Prenda",
                disabled: !!selectedRow && !selectedRow.id_prestamo,
                onClick: () => {
                  if (!selectedRow) {
                    alert("Seleccione una asignación");
                    return;
                  }
                  setFormDevolucion({
                    prenda: selectedRow.prenda || "",
                    talla: selectedRow.talla || "",
                    fecha_entrega: selectedRow.fecha_entrega
                      ? new Date(selectedRow.fecha_entrega).toLocaleDateString("es-CO")
                      : "",
                    fecha_devolucion: new Date().toLocaleDateString("es-CO"),
                    estado_entrega: selectedRow.estado_entrega || "",
                    estado_devolucion: "",
                    observacion: ""
                  });
                  setOpenDevolver(true);
                },
                variante: "secondary"
              },
              {
                label: "Eliminar",
                disabled: !!selectedRow && !selectedRow.id_prestamo,
                onClick: () => {
                  if (!selectedRow) {
                    alert("Seleccione una asignación");
                    return;
                  }
                  setOpenEliminar(true);
                },
                variante: "primary"
              }
            ]}
          />
        }
      >
        <main className="uniformes-main">
          {periodosCargados && (
            <SearchBar
              initialValues={filtros}
              loading={loading}
              fields={[
                { key: "codigo", label: "Código",  type: "text" },
                { key: "nombre", label: "Nombre",  type: "text" },
                { key: "grado",  label: "Grado",   type: "select", options: opcionesGrados },
                { key: "grupo",  label: "Grupo",   type: "select", options: opcionesGrupos },
                { key: "anio",   label: "Año",     type: "select", options: opcionesAnios }
              ]}
              onChange={(key, value) => {
                setFiltros((prev) => {
                  const nuevos = { ...prev, [key]: value };
                  if (key === "grado") nuevos.grupo = "";
                  return nuevos;
                });
              }}
              onSearch={(f) => setFiltrosAplicados(f)}
            />
          )}

          <div className="table-container">
            <DataTable
              columns={COLUMNS}
              rows={asignacionesFiltradas}
              onRowClick={setSelectedRow}
              pageSize={10}
              emptyText={
                loading
                  ? "Cargando asignaciones..."
                  : "No hay asignaciones registradas"
              }
            />
          </div>
        </main>
      </ModuleLayout>

      {/* ── Modal: Asignar Prenda ─────────────────────────────────────────────── */}
      <Modal
        title="ASIGNAR PRENDA"
        isOpen={openModal}
        onCancel={() => setOpenModal(false)}
        onAccept={handleAsignarSubmit}
        values={formAsignar}
        disabled={loadingModal}
        onChange={(key, value) => {
          if (key === "fecha_prestamo" || loadingModal) return;
          setFormAsignar((prev) => {
            const nuevo = { ...prev, [key]: value };
            if (key === "id_objeto") {
              const objeto = prendas.find((p) => p.id_objeto === Number(value));
              nuevo.talla = objeto?.tipo === "objeto" ? "No aplica" : "";
            }
            return nuevo;
          });
        }}
        fields={[
          {
            key: "id_objeto",
            label: "Prenda",
            type: "select",
            options: opcionesPrendas
          },
          {
            key: "talla",
            label: "Talla",
            type: "select",
            options:
              prendaSeleccionada?.tipo === "objeto"
                ? ["No aplica"]
                : ["S", "M", "L", "XL"]
          },
          { key: "fecha_prestamo", label: "Fecha de Entrega", type: "text" },
          {
            key: "estado",
            label: "Estado de la prenda",
            type: "select",
            options: [
              { value: "bueno",   label: "Bueno" },
              { value: "regular", label: "Regular" },
              { value: "malo",    label: "Malo" }
            ]
          },
          { key: "observacion", label: "Observación", type: "text" }
        ]}
      />

      {/* ── Modal: Registrar Devolución ───────────────────────────────────────── */}
      <Modal
        title="REGISTRAR DEVOLUCIÓN"
        isOpen={openDevolver}
        onCancel={() => setOpenDevolver(false)}
        onAccept={devolverPrenda}
        values={formDevolucion}
        onChange={(key, value) =>
          setFormDevolucion((prev) => ({ ...prev, [key]: value }))
        }
        fields={[
          { key: "prenda",           label: "Prenda",               type: "text" },
          { key: "talla",            label: "Talla",                type: "text" },
          { key: "fecha_entrega",    label: "Fecha de Entrega",     type: "text" },
          { key: "fecha_devolucion", label: "Fecha de Devolución",  type: "text" },
          { key: "estado_entrega",   label: "Estado de Entrega",    type: "text" },
          {
            key: "estado_devolucion",
            label: "Estado de Devolución",
            type: "select",
            options: [
              { value: "Bueno",   label: "Bueno" },
              { value: "Regular", label: "Regular" },
              { value: "Malo",    label: "Malo" }
            ]
          },
          { key: "observacion", label: "Observación", type: "text" }
        ]}
      />

      {/* ── Modal: Confirmar Eliminación ──────────────────────────────────────── */}
      <Modal
        title="CONFIRMAR ELIMINACIÓN"
        isOpen={openEliminar}
        onCancel={() => setOpenEliminar(false)}
        onAccept={confirmarEliminarAsignacion}
        values={{}}
        onChange={() => {}}
        fields={[
          { key: "mensaje1", type: "label", label: "¿CONFIRMA ELIMINAR LA ASIGNACIÓN?" },
          { key: "mensaje2", type: "label", label: `${selectedRow?.nombre_completo || ""}` },
          { key: "mensaje3", type: "label", label: `${selectedRow?.prenda || ""}` },
          { key: "mensaje4", type: "label", label: "Esta acción no se puede deshacer." }
        ]}
      />
    </div>
  );
}