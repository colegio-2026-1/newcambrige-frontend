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
import { allrolesuserRequest } from "../../../api/endpoints";
import "../styles/uniformes.css";

export default function AsignacionesPage() {
  const { user } = useAuth();

  // Periodo Académico
  const anioActual = new Date().getFullYear().toString();
  const anioAnterior = (new Date().getFullYear() - 1).toString();

  // Estados de la interfaz
  const [roles, setRoles] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [openModal, setOpenModal] = useState(false);
  const [openDevolver, setOpenDevolver] = useState(false);

  const [formDevolucion, setFormDevolucion] = useState({
    estado_devolucion: "",
    observacion: ""
  });

  // Filtros iniciales
  const [filtros, setFiltros] = useState({
    codigo: "",
    nombre: "",
    grado: "",
    grupo: "",
    anio: anioActual
  });

  const idUser = user?.id_usuario;
  const rol = roles[0] || "Rol no asignado";

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

  const cargarAsignaciones = async () => {
    try {
      const response = await getAsignacionesRequest();
      setAsignaciones(response.data);
    } catch (error) {
      console.error("Error cargando asignaciones", error);
    }
  };

  const eliminarAsignacion = async (id) => {
    const confirmar = window.confirm("¿Eliminar asignación?");
    if (!confirmar) return;

    try {
      await deletePrestamoRequest(id);
      await cargarAsignaciones();
      setSelectedRow(null);
    } catch (error) {
      console.error("Error eliminando asignación", error);
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
        estado_devolucion: "",
        observacion: ""
      });

      alert("Devolución registrada");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.detail ||
        "Error devolviendo prenda"
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

  // Filtros Dinámicos Eficientes 
  const asignacionesFiltradas = useMemo(() => {
    return asignaciones.filter((item) => {
      const coincideCodigo = filtros.codigo === "" || 
        item.codigo?.toString().includes(filtros.codigo);

      const coincideNombre = filtros.nombre === "" || 
        item.nombre_completo?.toLowerCase().includes(filtros.nombre.toLowerCase());

      const coincideGrado = filtros.grado === "" || 
        item.grado?.toString() === filtros.grado;

      const coincideGrupo = filtros.grupo === "" || 
        item.grupo?.toString() === filtros.grupo;

      const coincideAnio = filtros.anio === "" || 
        item.anio?.toString() === filtros.anio;

      return coincideCodigo && coincideNombre && coincideGrado && coincideGrupo && coincideAnio;
    });
  }, [asignaciones, filtros]);

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
              { label: "Inventario Prendas", path: "/uniformes/inventario" },
              { label: "Asignaciones", path: "/uniformes/asignaciones" },
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
                onClick: () => {
                  if (!selectedRow) {
                    alert("Seleccione una asignación");
                    return;
                  }
                  setFormDevolucion({
                    estado_devolucion: "",
                    observacion: ""
                  });
                  setOpenDevolver(true);
                },
                variante: "secondary"
              },
              {
                label: "Eliminar",
                onClick: () => {
                  if (!selectedRow) return alert("Seleccione una asignación");
                  eliminarAsignacion(selectedRow.id_prestamo);
                },
                variante: "danger"
              }
            ]}
          />
        }
      >
        <main className="uniformes-main">
          <SearchBar
            initialValues={filtros}
            loading={loading}
            fields={[
              { key: "codigo", label: "Código", type: "text" },
              { key: "nombre", label: "Nombre", type: "text" },
              { key: "grado", label: "Grado", type: "select", options: opcionesGrados },
              { key: "grupo", label: "Grupo", type: "select", options: opcionesGrupos },
              { key: "anio", label: "Año", type: "select", options: [anioAnterior, anioActual] }
            ]}
            onChange={(key, value) => {
              setFiltros((prev) => {
                const nuevos = { ...prev, [key]: value };
                if (key === "grado") nuevos.grupo = ""; 
                return nuevos;
              });
            }}
          />

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
            key: "estado_devolucion",
            label: "Estado de la Prenda",
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
    </div>
  );
}