import { useState, useEffect, useMemo } from "react";
import Header from "../../../components/layout/Header";
import ModuleLayout from "../../../components/layout/ModuleLayout";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../../components/shared/SearchBar";
import ActionButtons from "../../../components/shared/ActionButtons";
import AsignacionesTable from "../components/AsignacionesTable";
import AsignarPrendaModal from "../components/AsignarPrendaModal";
import Modal from "../../../components/shared/Modal";
import { 
  getAsignacionesRequest, 
  deletePrestamoRequest, 
  devolverPrestamoRequest 
} from "../../../api/uniformesService";
import { useAuth } from "../../../api/useAuth";
import {
  allrolesuserRequest,
  allaniosacademicosRequest
} from "../../../api/endpoints";
import "../styles/uniformes.css";

export default function AsignacionesPage() {
  const { user } = useAuth();

  // Estados de la interfaz
  const [roles, setRoles] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodos, setPeriodos] = useState([]);
  const [periodosCargados, setPeriodosCargados] = useState(false);

  // Modales
  const [openModal, setOpenModal] = useState(false);
  const [openDevolver, setOpenDevolver] = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);

  const [formDevolucion, setFormDevolucion] = useState({
    prenda: "",
    talla: "",
    fecha_entrega: "",
    fecha_devolucion: "",
    estado_entrega: "",
    estado_devolucion: "",
    observacion: ""
  });

  // Filtros iniciales - 'anio' se inicializa vacío para responder dinámicamente a la BD
  const [filtros, setFiltros] = useState({
    codigo: "",
    nombre: "",
    grado: "",
    grupo: "",
    anio: ""
  });

  // 1. Estado para almacenar los filtros confirmados mediante el botón de búsqueda
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    codigo: "",
    nombre: "",
    grado: "",
    grupo: "",
    anio: ""
  });

  const idUser = user?.id_usuario;
  const rol = roles[0] || "Rol no asignado";

  // 2. Modificación de cargarPeriodos para poblar ambos estados simultáneamente usando finally
  const cargarPeriodos = async () => {
    try {
      const res = await allaniosacademicosRequest();

      setPeriodos(res.data);

      // Buscar dinámicamente el periodo con estado activo
      const periodoActivo = res.data.find(
        periodo => periodo.activo
      );

      const anioActivo = periodoActivo?.nombre || ""

      setFiltros(prev => ({
        ...prev,
        anio: anioActivo
      }));

      setFiltrosAplicados(prev => ({
        ...prev,
        anio: anioActivo
      }));

    } catch (error) {
      console.error("Error cargando periodos", error);
    } finally {
      // Garantiza que el SearchBar aparezca incluso si la consulta falla
      setPeriodosCargados(true);
    }
  };

  // Carga unificada de Asignaciones y Roles
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

  const eliminarAsignacion = async (id) => {
    try {
      await deletePrestamoRequest(id);
      await cargarAsignaciones();
      setSelectedRow(null);
    } catch (error) {
      console.error("Error deleting loan assignment", error);
      throw error; // Lanzamos el error para que sea capturado en confirmarEliminarAsignacion
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
      await devolverPrestamoRequest(
        selectedRow.id_prestamo,
        {
          estado_devolucion: formDevolucion.estado_devolucion,
          observacion: formDevolucion.observacion
        }
      );

      await cargarAsignaciones();
      setOpenDevolver(false);

      setFormDevolucion({
        prenda: "",
        talla: "",
        fecha_entrega: "",
        fecha_devolucion: "",
        estado_entrega: "",
        estado_devolucion: "",
        observacion: ""
      });

      alert("Devolución registrada");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.detail ||
        "Error devolver prenda"
      );
    }
  };

  // Memorizar opciones de Grados únicos
  const opcionesGrados = useMemo(() => {
    return asignaciones
      .map((item) => item.grado?.toString())
      .filter((value, index, self) => value && self.indexOf(value) === index)
      .sort((a, b) => Number(a) - Number(b));
  }, [asignaciones]);

  // Memorizar opciones de Grupos únicos filtrados por el Grado seleccionado
  const opcionesGrupos = useMemo(() => {
    if (filtros.grado === "") return [];
    return asignaciones
      .filter((item) => item.grado?.toString() === filtros.grado)
      .map((item) => item.grupo?.toString())
      .filter((value, index, self) => value && self.indexOf(value) === index)
      .sort();
  }, [asignaciones, filtros.grado]);

  // Memorizar opciones de Años únicos desde los periodos de la BD
  const opcionesAnios = useMemo(() => {
    return periodos
      .map((p) => p.nombre)
      .filter(Boolean);
  }, [periodos]);

  // 3 y 4. Cambiadas referencias internas y dependencia de hook a filtrosAplicados
  const asignacionesFiltradas = useMemo(() => {
    return asignaciones.filter((item) => {
      const coincideCodigo = filtrosAplicados.codigo === "" || 
        item.codigo?.toString().includes(filtrosAplicados.codigo);

      const coincideNombre = filtrosAplicados.nombre === "" || 
        item.nombre_completo?.toLowerCase().includes(filtrosAplicados.nombre.toLowerCase());

      const coincideGrado = filtrosAplicados.grado === "" || 
        item.grado?.toString() === filtrosAplicados.grado;

      const coincideGrupo = filtrosAplicados.grupo === "" || 
        item.grupo?.toString() === filtrosAplicados.grupo;

      const coincideAnio = filtrosAplicados.anio === "" || 
        item.anio?.toString() === filtrosAplicados.anio;

      return coincideCodigo && coincideNombre && coincideGrado && coincideGrupo && coincideAnio;
    });
  }, [asignaciones, filtrosAplicados]);

  // Bloqueo de seguridad si no hay usuario
  if (!user) {
    return (
      <div style={{ padding: "30px", fontFamily: "sans-serif", fontWeight: "600" }}>
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="uniformes-page">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            user={{
              nombre: user?.nombre || "ADMIN",
              rol: rol
            }}
            menuItems={[
              { label: "Inicio", path: "/home" },
              { label: "Asignaciones", path: "/uniformes/asignaciones" },
              { label: "Inventario Prenda", path: "/uniformes/inventario" },
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
                  console.log("FILA:", selectedRow);
                  if (!selectedRow) {
                    alert("Seleccione una asignación");
                    return;
                  }
                  setFormDevolucion({
                    prenda: selectedRow.prenda || "",
                    talla: selectedRow.talla || "",
                    fecha_entrega: selectedRow.fecha_entrega
                      ? new Date(selectedRow.fecha_entrega)
                          .toLocaleDateString("es-CO")  
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
                variante: "danger"
              }
            ]}
          />
        }
      >
        <main className="uniformes-main">
          {/* 5. Agregada la propiedad onSearch al componente SearchBar */}
          {periodosCargados && (
            <SearchBar
              initialValues={filtros}
              loading={loading}
              fields={[
                { key: "codigo", label: "Código", type: "text" },
                { key: "nombre", label: "Nombre", type: "text" },
                { key: "grado", label: "Grado", type: "select", options: opcionesGrados },
                { key: "grupo", label: "Grupo", type: "select", options: opcionesGrupos },
                { key: "anio", label: "Año", type: "select", options: opcionesAnios }
              ]}
              onChange={(key, value) => {
                setFiltros((prev) => {
                  const nuevos = { ...prev, [key]: value };
                  if (key === "grado") nuevos.grupo = ""; 
                  return nuevos;
                });
              }}
              onSearch={(f) => {
                setFiltrosAplicados(f);
              }}
            />
          )}

          <div className="table-container">
            <AsignacionesTable
              asignaciones={asignacionesFiltradas}
              loading={loading}
              setSelectedRow={setSelectedRow}
            />
          </div>
        </main>
      </ModuleLayout>

      <AsignarPrendaModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        estudianteSeleccionado={selectedRow}
        onSuccess={cargarAsignaciones}
      />

      <Modal
        title="REGISTRAR DEVOLUCIÓN"
        isOpen={openDevolver}
        onCancel={() => setOpenDevolver(false)}
        onAccept={devolverPrenda}
        values={formDevolucion}
        onChange={(key, value) =>
          setFormDevolucion((prev) => ({
            ...prev,
            [key]: value
          }))
        }
        fields={[
          {
            key: "prenda",
            label: "Prenda",
            type: "text"
          },
          {
            key: "talla",
            label: "Talla",
            type: "text"
          },
          {
            key: "fecha_entrega",
            label: "Fecha de Entrega",
            type: "text"
          },
          {
            key: "fecha_devolucion",
            label: "Fecha de Devolución",
            type: "text"
          },
          {
            key: "estado_entrega",
            label: "Estado de Entrega",
            type: "text"
          },
          {
            key: "estado_devolucion",
            label: "Estado de Devolución",
            type: "select",
            options: [
              { value: "Bueno", label: "Bueno" },
              { value: "Regular", label: "Regular" },
              { value: "Malo", label: "Malo" }
            ]
          },
          {
            key: "observacion",
            label: "Observación",
            type: "text"
          }
        ]}
      />

      <Modal
        title="CONFIRMAR ELIMINACIÓN"
        isOpen={openEliminar}
        onCancel={() => setOpenEliminar(false)}
        onAccept={confirmarEliminarAsignacion}
        values={{}}
        onChange={() => {}}
        fields={[
          {
            key: "mensaje1",
            type: "label",
            label: "¿CONFIRMA ELIMINAR LA ASIGNACIÓN?"
          },
          {
            key: "mensaje2",
            type: "label",
            label: `${selectedRow?.nombre_completo || ""}`
          },
          {
            key: "mensaje3",
            type: "label",
            label: `${selectedRow?.prenda || ""}`
          },
          {
            key: "mensaje4",
            type: "label",
            label: "Esta acción no se puede deshacer."
          }
        ]}
      />
    </div>
  );
}