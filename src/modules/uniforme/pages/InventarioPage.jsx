import { useEffect, useMemo, useState } from "react";
import {
  getInventarioRequest,
  deleteObjetoRequest,
  createObjetoRequest,
  updateObjetoRequest
} from "../../../api/uniformesService";
import { useAuth } from "../../../api/useAuth";
import { allrolesuserRequest } from "../../../api/endpoints";

import Header from "../../../components/layout/header";
import ModuleLayout from "../../../components/layout/ModuleLayout";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../../components/shared/searchBar";
import Modal from "../../../components/shared/Modal";
import ActionButtons from "../../../components/shared/ActionButtons";
import DataTable from "../../../components/shared/DataTable";
import "../styles/uniformes.css";

// ─── Utilidad ────────────────────────────────────────────────────────────────
const capitalizar = (texto) =>
  texto
    ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
    : "—";

// ─── Columnas de la tabla (definidas fuera del componente: una sola instancia) ─
const COLUMNS = [
  { key: "id_objeto", label: "Código" },
  {
    key: "nombre",
    label: "Nombre",
    render: (val) => capitalizar(val)
  },
  {
    key: "tipo",
    label: "Categoría",
    render: (val) => capitalizar(val)
  },
  {
    key: "cantidad_disponible",
    label: "Disponibilidad",
    render: (val) => (Number(val) > 0 ? "Activo" : "Inactivo")
  },
  {
    key: "estado_fisico",
    label: "Estado físico",
    render: (val) => capitalizar(val)
  }
];

export default function InventarioPage() {
  const { user } = useAuth();

  const [roles, setRoles]             = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [inventario, setInventario]   = useState([]);
  const [loading, setLoading]         = useState(true);

  // ── Modales ─────────────────────────────────────────────────────────────────
  const [openAgregar, setOpenAgregar] = useState(false);
  const [openEditar, setOpenEditar]   = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);

  // ── Filtros ──────────────────────────────────────────────────────────────────
  const [filtros, setFiltros] = useState({ codigo: "", prenda: "", tipo: "" });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    codigo: "", prenda: "", tipo: ""
  });

  const idUser = user?.id_usuario;
  const rol    = roles[0] || "Rol no asignado";

  // ── Formularios ──────────────────────────────────────────────────────────────
  const [formAgregar, setFormAgregar] = useState({
    nombre: "",
    tipo: "vestimenta",
    cantidad_total: 1,
    talla: "",
    observacion: "",
    estado_fisico: "Bueno",
    fecha_registro: new Date().toLocaleDateString("en-CA")
  });

  const [formEditar, setFormEditar] = useState({
    nombre: "",
    tipo: "vestimenta",
    cantidad_total: 0,
    estado_fisico: "Bueno",
    talla: "",
    observacion: ""
  });

  // ── Guardar prenda ────────────────────────────────────────────────────────────
  const guardarPrenda = async () => {
    if (!formAgregar.nombre.trim()) {
      alert("Ingrese el nombre de la prenda");
      return;
    }
    if (formAgregar.tipo === "vestimenta" && !formAgregar.talla) {
      alert("Seleccione una talla");
      return;
    }
    if (Number(formAgregar.cantidad_total) < 0) {
      alert("Cantidad inválida");
      return;
    }
    if (
      ["regular", "malo"].includes(formAgregar.estado_fisico?.toLowerCase()) &&
      !formAgregar.observacion?.trim()
    ) {
      alert("Debe ingresar una observación para prendas en estado Regular o Malo");
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
        fecha_registro: new Date().toLocaleDateString("en-CA")
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
        fecha_registro: new Date().toLocaleDateString("en-CA")
      });
      alert("Prenda registrada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error registrando prenda");
    }
  };

  // ── Editar prenda ─────────────────────────────────────────────────────────────
  const editarPrenda = async () => {
    if (!selectedRow) {
      alert("Seleccione una prenda");
      return;
    }
    if (!formEditar.nombre.trim()) {
      alert("Ingrese el nombre");
      return;
    }
    if (
      ["regular", "malo"].includes(formEditar.estado_fisico?.toLowerCase()) &&
      !formEditar.observacion?.trim()
    ) {
      alert("Debe ingresar una observación para prendas en estado Regular o Malo");
      return;
    }

    try {
      await updateObjetoRequest(selectedRow.id_objeto, {
        nombre: formEditar.nombre,
        tipo: formEditar.tipo,
        cantidad_total: Number(formEditar.cantidad_total),
        estado_fisico: formEditar.estado_fisico,
        talla: formEditar.talla,
        observacion: formEditar.observacion
      });

      await cargarInventario();
      setOpenEditar(false);
      alert("Prenda actualizada correctamente");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Error actualizando prenda");
    }
  };

  // ── Eliminar prenda ───────────────────────────────────────────────────────────
  const eliminarPrenda = async () => {
    if (!selectedRow) return;
    try {
      await deleteObjetoRequest(selectedRow.id_objeto);
      await cargarInventario();
      setSelectedRow(null);
      setOpenEliminar(false);
      alert("Prenda eliminada correctamente");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.detail || "Error eliminando prenda");
    }
  };

  // ── Carga de inventario ───────────────────────────────────────────────────────
  const cargarInventario = async () => {
    try {
      setLoading(true);
      const response = await getInventarioRequest();
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

  useEffect(() => {
    cargarInventario();
  }, []);

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

  // ── Filtrado ─────────────────────────────────────────────────────────────────
  const inventarioFiltrado = useMemo(() =>
    inventario.filter((item) => {
      const coincideCodigo =
        filtrosAplicados.codigo === "" ||
        String(item.id_objeto).includes(filtrosAplicados.codigo);
      const coincidePrenda =
        filtrosAplicados.prenda === "" ||
        item.nombre?.toLowerCase().includes(filtrosAplicados.prenda.toLowerCase());
      const coincideTipo =
        filtrosAplicados.tipo === "" ||
        item.tipo?.toLowerCase().includes(filtrosAplicados.tipo.toLowerCase());
      return coincideCodigo && coincidePrenda && coincideTipo;
    }),
    [inventario, filtrosAplicados]
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="uniformes-page">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            user={{ nombre: user?.nombre || "Usuario", rol }}
            menuItems={[
              { label: "Inicio", path: "/home" },
              { label: "Asignaciones", path: "/uniformes/asignaciones" },
              { label: "Inventario Prendas", path: "/uniformes/inventario" }
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
                    fecha_registro: new Date().toLocaleDateString("en-CA")
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
                onClick: () => {
                  if (!selectedRow) {
                    alert("Seleccione una prenda");
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
          <SearchBar
            initialValues={filtros}
            fields={[
              { key: "codigo", label: "codigo", type: "text" },
              { key: "prenda", label: "Prenda",  type: "text" },
              { key: "tipo",   label: "Tipo",    type: "select", options: ["vestimenta", "objeto"] }
            ]}
            loading={loading}
            onChange={(key, value) =>
              setFiltros((prev) => ({ ...prev, [key]: value }))
            }
            onSearch={(f) => setFiltrosAplicados(f)}
          />

          <div className="table-container">
            <DataTable
              columns={COLUMNS}
              rows={inventarioFiltrado}
              onRowClick={setSelectedRow}
              pageSize={10}
              emptyText="No se encontraron prendas con el criterio de búsqueda ingresado."
            />
          </div>
        </main>
      </ModuleLayout>

      {/* ── Modal: Agregar Prenda ─────────────────────────────────────────────── */}
      <Modal
        title="AGREGAR PRENDA"
        isOpen={openAgregar}
        onCancel={() => setOpenAgregar(false)}
        onAccept={guardarPrenda}
        values={formAgregar}
        onChange={(key, value) => {
          setFormAgregar((prev) => {
            const nuevo = { ...prev, [key]: value };
            if (key === "tipo") {
              nuevo.talla = value === "objeto" ? "No aplica" : "";
            }
            return nuevo;
          });
        }}
        fields={[
          { key: "nombre",         label: "Nombre",        type: "text" },
          { key: "tipo",           label: "Categoria",     type: "select", options: ["vestimenta", "objeto"] },
          { key: "cantidad_total", label: "Cantidad",      type: "number" },
          {
            key: "estado_fisico",
            label: "Estado Físico",
            type: "select",
            options: ["Bueno", "Regular", "Malo"]
          },
          {
            key: "talla",
            label: "Talla",
            type: "select",
            options: formAgregar.tipo === "objeto" ? ["No aplica"] : ["XS", "S", "M", "L", "XL"]
          },
          { key: "observacion", label: "Observación", type: "text" }
        ]}
      />

      {/* ── Modal: Editar Prenda ──────────────────────────────────────────────── */}
      <Modal
        title="EDITAR PRENDA"
        isOpen={openEditar}
        onCancel={() => setOpenEditar(false)}
        onAccept={editarPrenda}
        values={formEditar}
        onChange={(key, value) =>
          setFormEditar((prev) => {
            const nuevo = { ...prev, [key]: value };
            if (key === "tipo") {
              nuevo.talla = value === "objeto" ? "No aplica" : "";
            }
            return nuevo;
          })
        }
        fields={[
          { key: "nombre",         label: "Nombre",        type: "text" },
          { key: "tipo",           label: "Tipo",          type: "select", options: ["vestimenta", "objeto"] },
          { key: "cantidad_total", label: "Cantidad Total", type: "number" },
          {
            key: "estado_fisico",
            label: "Estado Físico",
            type: "select",
            options: ["Bueno", "Regular", "Malo"]
          },
          {
            key: "talla",
            label: "Talla",
            type: "select",
            options: formEditar.tipo === "objeto" ? ["No aplica"] : ["XS", "S", "M", "L", "XL"]
          },
          { key: "observacion", label: "Observación", type: "text" }
        ]}
      />

      {/* ── Modal: Confirmar Eliminación ──────────────────────────────────────── */}
      <Modal
        title="CONFIRMAR ELIMINACIÓN"
        isOpen={openEliminar}
        onCancel={() => setOpenEliminar(false)}
        onAccept={eliminarPrenda}
        values={{}}
        fields={[
          {
            key: "mensaje",
            type: "label",
            label:`¿CONFIRMA ELIMINAR LA PRENDA ${selectedRow?.nombre || ""}?`
      
          }  
        ]}
      />
    </div>
  );
}