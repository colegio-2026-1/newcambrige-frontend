import { useEffect, useMemo, useState } from "react";
import { 
  getInventarioRequest, 
  deleteObjetoRequest,
  createObjetoRequest,
  updateObjetoRequest 
} from "../../../api/uniformesService";
import { useAuth } from "../../../api/useAuth";
import { allrolesuserRequest } from "../../../api/endpoints";

import Header from "../../../components/layout/Header";
import ModuleLayout from "../../../components/layout/ModuleLayout";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../../components/shared/SearchBar";
import Modal from "../../../components/shared/Modal";
import ActionButtons from "../../../components/shared/ActionButtons";
import InventoryTable from "../components/InventoryTable";
import "../styles/uniformes.css";

export default function InventarioPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modales
  const [openAgregar, setOpenAgregar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({  codigo: "", prenda: "", tipo: "" });

  const idUser = user?.id_usuario;
  const rol = roles[0] || "Rol no asignado";

  const [formAgregar, setFormAgregar] = useState({
    nombre: "",
    tipo: "vestimenta",
    cantidad_total: 1,
    talla: "",
    observacion: "",
    estado_fisico: "Bueno",
    fecha_registro: new Date()
      .toISOString()
      .split("T")[0]
  });

  const [formEditar, setFormEditar] = useState({
    nombre: "",
    tipo: "vestimenta",
    cantidad_total: 0,
    estado_fisico: "Bueno",
    talla: "",
    observacion: ""
  });

  const guardarPrenda = async () => {
    if (!formAgregar.nombre.trim()) {
      alert("Ingrese el nombre de la prenda");
      return;
    }

    if (
      formAgregar.estado_fisico === "Malo" &&
      !formAgregar.observacion.trim()
    ) {
      alert("Debe ingresar una observación para prendas en mal estado");
      return;
    }

    if (
      formAgregar.tipo === "vestimenta" &&
      !formAgregar.talla
    ) {
      alert("Seleccione una talla");
      return;
    }

    if (Number(formAgregar.cantidad_total) < 0) {
      alert("Cantidad inválida");
      return;
    }

    try {
      await createObjetoRequest({
        nombre: formAgregar.nombre,
        tipo: formAgregar.tipo,
        cantidad_total: Number(formAgregar.cantidad_total),
        cantidad_disponible: Number(formAgregar.cantidad_total),
        estado_fisico: formAgregar.estado_fisico,
        talla: formAgregar.talla,
        observacion: formAgregar.observacion,
        fecha_registro: new Date()
          .toISOString()
          .split("T")[0]
      });

      await cargarInventario();
      setOpenAgregar(false);

      setFormAgregar({
        nombre: "",
        tipo: "vestimenta",
        cantidad_total: 1,
        estado_fisico: "Bueno",
        talla: "",
        observacion: "",
        fecha_registro: new Date()
          .toISOString()
          .split("T")[0]
      });

      alert("Prenda registrada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error registrando prenda");
    }
  };

  const editarPrenda = async () => {
    if (!selectedRow) {
      alert("Seleccione una prenda");
      return;
    }

    if (!formEditar.nombre.trim()) {
      alert("Ingrese el nombre");
      return;
    }

    try {
      await updateObjetoRequest(
        selectedRow.id_objeto,
        {
          nombre: formEditar.nombre,
          tipo: formEditar.tipo,
          cantidad_total: Number(formEditar.cantidad_total),
          estado_fisico: formEditar.estado_fisico,
          talla: formEditar.talla,
          observacion: formEditar.observacion
        }
      );

      await cargarInventario();
      setOpenEditar(false);
      alert("Prenda actualizada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error actualizando prenda");
    }
  };

  // Cargar inventario inicial
  useEffect(() => {
    cargarInventario();
  }, []);

  // Cargar roles del usuario
  useEffect(() => {
    const obtenerRoles = async () => {
      if (!idUser) return;
      try {
        const response = await allrolesuserRequest(idUser);
        setRoles(response?.data || []);
      } catch (error) {
        console.error("Error cargando roles", error);
        setRoles([]);
      }
    };
    obtenerRoles();
  }, [idUser]);

  const cargarInventario = async () => {
    try {
      setLoading(true);
      const response = await getInventarioRequest();
      // Ordenar alfabéticamente
      const ordenado = [...response.data].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
      setInventario(ordenado);
    } catch (error) {
      console.error("Error cargando inventario", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPrenda = async () => {
    if (!selectedRow) return alert("Seleccione una prenda");

    const confirmar = window.confirm("¿Está seguro de eliminar esta prenda?");
    if (!confirmar) return;

    try {
      await deleteObjetoRequest(selectedRow.id_objeto);
      await cargarInventario();
      setSelectedRow(null);
      alert("Prenda eliminada correctamente");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Error Cosmic.");
    }
  };

  // Filtrado en tiempo real mediante useMemo
  const inventarioFiltrado = useMemo(() => {
    return inventario.filter((item) => {
      const coincideCodigo =
        filtros.codigo === "" ||
        String(item.id_objeto)
          .includes(filtros.codigo);

      const coincidePrenda = filtros.prenda === "" || 
        item.nombre?.toLowerCase().includes(filtros.prenda.toLowerCase());

      const coincideTipo = filtros.tipo === "" || 
        item.tipo?.toLowerCase().includes(filtros.tipo.toLowerCase());

      return coincideCodigo && coincidePrenda && coincideTipo;
    });
  }, [inventario, filtros]);

  return (
    <div className="uniformes-page">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            user={{
              nombre: user?.nombre || "Usuario",
              rol: rol
            }}
            menuItems={[
              { label: "Inicio", path: "/home" },
              { label: "Inventario Prendas", path: "/uniformes/inventario" },
              { label: "Asignaciones", path: "/uniformes/asignaciones" },
            ]}
            selectedMenu="Inventario Prendas"
          />
        }
        actions={
          <ActionButtons
            filaSeleccionada={selectedRow}
            botones={[
              {
                label: "Agregar Prenda",
                onClick: () => {
                  setFormAgregar({
                    nombre: "",
                    tipo: "vestimenta",
                    cantidad_total: 1,
                    estado_fisico: "Bueno",
                    talla: "",
                    observacion: "",
                    fecha_registro: new Date()
                      .toISOString()
                      .split("T")[0]
                  });
                  setOpenAgregar(true);
                },
                siempreActivo: true,
                variante: "primary"
              },
              {
                label: "Editar Prenda",
                onClick: () => {
                  if (!selectedRow) {
                    alert("Seleccione una prenda");
                    return;
                  }
                  setFormEditar({
                    nombre: selectedRow.nombre || "",
                    tipo: selectedRow.tipo || "vestimenta",
                    cantidad_total: selectedRow.cantidad_total || 0,
                    estado_fisico: selectedRow.estado_fisico || "Bueno",
                    talla: selectedRow.talla || "",
                    observacion: selectedRow.observacion || ""
                  });
                  setOpenEditar(true);
                },
                variante: "secondary"
              },
              {
                label: "Eliminar Prenda",
                onClick: eliminarPrenda,
                variante: "danger"
              }
            ]}
          />
        }
      >
        <main className="uniformes-main">
          <SearchBar
            initialValues={filtros}
            fields={[
              { key: "codigo", label: "codigo", type: "text" },
              { key: "prenda", label: "Prenda", type: "text" },
              { key: "tipo", label: "Tipo", type: "select", options: ["vestimenta", "objeto"] }
            ]}
            loading={loading}
            onChange={(key, value) => {
              setFiltros((prev) => ({ ...prev, [key]: value }));
            }}
          />


          <div className="table-container">
            <InventoryTable
              inventario={inventarioFiltrado}
              setSelectedRow={setSelectedRow}

            />
          </div>
        </main>
      </ModuleLayout>

      <Modal
        title="AGREGAR PRENDA"
        isOpen={openAgregar}
        onCancel={() => setOpenAgregar(false)}
        onAccept={guardarPrenda}
        values={formAgregar}
        onChange={(key, value) => {
          setFormAgregar((prev) => {
            const nuevo = {
              ...prev,
              [key]: value
            };
            if (key === "tipo" && value === "objeto") {
              nuevo.talla = ""; 
            }
            return nuevo;
          });
        }} 
        fields={[
          {
            key: "nombre",
            label: "Nombre",
            type: "text"
          },
          {
            key: "tipo",
            label: "Categoria",
            type: "select",
            options: ["vestimenta", "objeto"]
          },
          {
            key: "cantidad_total",
            label: "Cantidad",
            type: "number"
          },
          {
            key: "estado_fisico",
            label: "Estado Físico",
            type: "select",
            options: [
              "Bueno",
              "Regular",
              "Malo"
            ]
          },
          ...(formAgregar.tipo === "vestimenta"
            ? [{
                key: "talla",
                label: "Talla",
                type: "select",
                options: [
                  "XS", "S", "M", "L", "XL"
                ]
              }]
            : []
          ),
          {
            key: "observacion",
            label: "Observación",
            type: "text"
          }
        ]}
      />

      <Modal
        title="EDITAR PRENDA"
        isOpen={openEditar}
        onCancel={() => setOpenEditar(false)}
        onAccept={editarPrenda}
        values={formEditar}
        onChange={(key, value) =>
          setFormEditar((prev) => {
            const nuevo = {
              ...prev,
              [key]: value
            };
            if (key === "tipo" && value === "objeto") {
              nuevo.talla = "";
            }
            return nuevo;
          })
        }
        fields={[
          {
            key: "nombre",
            label: "Nombre",
            type: "text"
          },
          {
            key: "tipo",
            label: "Tipo",
            type: "select",
            options: ["vestimenta", "objeto"]
          },
          {
            key: "cantidad_total",
            label: "Cantidad Total",
            type: "number"
          },
          {
            key: "estado_fisico",
            label: "Estado Físico",
            type: "select",
            options: [
              "Bueno",
              "Regular",
              "Malo"
            ]
          },
          ...(formEditar.tipo === "vestimenta"
            ? [{
                key: "talla",
                label: "Talla",
                type: "select",
                options: [
                  "XS", "S", "M", "L", "XL"
                ]
              }]
            : []
          ),
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