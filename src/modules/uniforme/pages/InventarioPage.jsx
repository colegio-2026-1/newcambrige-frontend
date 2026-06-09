import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInventarioRequest,
  deleteObjetoRequest,
  createObjetoRequest,
  updateObjetoRequest
} from "../../../api/uniformesService";
import { useAuth } from "../../../api/useAuth";

import Header from "../../../components/layout/header";
import ModuleLayout from "../../../components/layout/ModuleLayout";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../../components/shared/searchBar";
import Modal from "../../../components/shared/Modal";
import ActionButtons from "../../../components/shared/ActionButtons";
import DataTable from "../../../components/shared/DataTable";
import Alert from "../../../components/shared/Alert";
import "../styles/uniformes.css";


import { Icon } from "@mdi/react";
import {
  mdiHome,
  mdiHanger,
  mdiTshirtCrew
} from "@mdi/js";

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
    render: (val) => (
      Number(val) > 0
        ? <span className="uniforme-badge--good">Activo</span>
        : <span className="uniforme-badge--bad">Inactivo</span>
    )
  },
  
  {
    key: "estado_fisico",
    label: "Estado físico",
    render: (val) => {
      const estado = val?.toLowerCase();

      let clase = "uniforme-badge--default";

      if (estado === "bueno") clase = "uniforme-badge--good";
      else if (estado === "regular") clase = "uniforme-badge--regular";
      else if (estado === "malo") clase = "uniforme-badge--bad";

      return (
        <span className={clase}>
          {capitalizar(val)}
        </span>
      );
    }
  }
];

export default function InventarioPage() {
  const { user, roles, loadingRoles } = useAuth();
  const navigate = useNavigate();

  const rolesPermitidos = ["admin", "titular"];

  const tieneAccesoModulo = roles.some(
    rol => rolesPermitidos.includes(rol)
  );

  useEffect(() => {
    if (!loadingRoles && !tieneAccesoModulo) {
      navigate("/home");
    }
  }, [loadingRoles, tieneAccesoModulo, navigate]);

  const [selectedRow, setSelectedRow] = useState(null);
  const [inventario, setInventario]   = useState([]);
  const [loading, setLoading]         = useState(true);

  // ── Modales ─────────────────────────────────────────────────────────────────
  const [openAgregar, setOpenAgregar] = useState(false);
  const [openEditar, setOpenEditar]   = useState(false);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [openPrestamoActivo, setOpenPrestamoActivo] = useState(false);

  // ── Estado Alerta ───────────────────────────────────────────────────────────
  const [alerta, setAlerta] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: ""
  });

  // ── Función Alerta ──────────────────────────────────────────────────────────
  const mostrarAlerta = (type, message, title = "") => {
    setAlerta({
      isOpen: true,
      type,
      title,
      message
    });
  };

  // ── Filtros ──────────────────────────────────────────────────────────────────
  const [filtros, setFiltros] = useState({ codigo: "", prenda: "", tipo: "" });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    codigo: "", prenda: "", tipo: ""
  });

  const rol = roles[0] || (loadingRoles ? "Cargando rol..." : "Sin rol");

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
      mostrarAlerta("error", "Ingrese el nombre de la prenda");
      return;
    }
    if (formAgregar.tipo === "vestimenta" && !formAgregar.talla) {
      mostrarAlerta("error", "Seleccione una talla");
      return;
    }
    if (Number(formAgregar.cantidad_total) < 0) {
      mostrarAlerta("error", "Cantidad inválida");
      return;
    }
    if (
      ["regular", "malo"].includes(formAgregar.estado_fisico?.toLowerCase()) &&
      !formAgregar.observacion?.trim()
    ) {
      mostrarAlerta(
        "error",
        "Debe ingresar una observación para prendas en estado Regular o Malo"
      );
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
      mostrarAlerta(
        "success",
        "La prenda fue registrada correctamente."
      );
    } catch (error) {
      console.error(error);
      mostrarAlerta(
        "error",
        "Error registrando prenda"
      );
    }
  };

  // ── Editar prenda ─────────────────────────────────────────────────────────────
  const editarPrenda = async () => {
    if (!selectedRow) {
      mostrarAlerta("error", "Seleccione una prenda");
      return;
    }
    if (!formEditar.nombre.trim()) {
      mostrarAlerta("error", "Ingrese el nombre");
      return;
    }
    if (
      ["regular", "malo"].includes(formEditar.estado_fisico?.toLowerCase()) &&
      !formEditar.observacion?.trim()
    ) {
      mostrarAlerta(
        "error",
        "Debe ingresar una observación para prendas en estado Regular o Malo"
      );
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
      mostrarAlerta(
        "success",
        "La prenda fue actualizada correctamente."
      );
    } catch (error) {
      console.error(error);
      mostrarAlerta(
        "error",
        error?.response?.data?.detail || "Error actualizando prenda"
      );
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
      mostrarAlerta(
        "success",
        "La prenda fue eliminada correctamente."
      );
    } catch (error) {
      console.error(error);
      mostrarAlerta(
        "error",
        error?.response?.data?.detail || "Error eliminando la prenda"
      );
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
      console.error("Error loading inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

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

  const modulos = [
    {
      label: "Inicio",
      icon: <Icon path={mdiHome} size={1} />,
      path: "/home"
    },
    {
      label: "Asignaciones Uniformes",
      icon: <Icon path={mdiTshirtCrew} size={1} />,
      path: "/uniformes/asignaciones",
      roles: ["admin", "titular"]
    },
    {
      label: "Inventario Uniformes",
      icon: <Icon path={mdiHanger} size={1} />,
      path: "/uniformes/inventario",
      roles: ["admin", "titular"]
    }
  ];

  const sidebarMenuItems = modulos.filter(modulo =>
    !modulo.roles ||
    roles.some(rol => modulo.roles.includes(rol))
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="uniformes-page">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            user={{ nombre: user?.nombre || "Usuario", rol }}
            loadingRoles={loadingRoles}
            menuItems={sidebarMenuItems}
            selectedMenu="Inventario Uniformes"
          />
        }
        actions={
          !loadingRoles && tieneAccesoModulo && (
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
                      mostrarAlerta("error", "Seleccione una prenda");
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
                      mostrarAlerta("error", "Seleccione una prenda");
                      return;
                    }
                    
                    if (Number(selectedRow.prestadas) > 0) {
                      setOpenPrestamoActivo(true);
                      return;
                    }
                    setOpenEliminar(true);
                  },
                  variante: "primary"
                }
              ]}
            />
          )
        }
      >
        <main className="uniformes-main">
          <SearchBar
            initialValues={filtros}
            fields={[
              { key: "codigo", label: "Código", type: "text" },
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
            className: "uniformes-modal-message",
            label:`¿CONFIRMA ELIMINAR LA PRENDA ${selectedRow?.nombre || ""}?`
          }  
        ]}
      />

      {/* ── Modal: Préstamo Activo ────────────────────────────────────────────── */}
      <Modal
        title="NO ES POSIBLE ELIMINAR"
        isOpen={openPrestamoActivo}
        onCancel={() => setOpenPrestamoActivo(false)}
        onAccept={() => setOpenPrestamoActivo(false)}
        values={{}}
        onChange={() => {}}
        fields={[
          {
            key: "mensaje",
            type: "label",
            className: "uniformes-modal-warning",
            label: "LA PRENDA TIENE UN PRÉSTAMO ACTIVO."
          }
        ]}
      />

      <Alert
        {...alerta}
        onClose={() =>
          setAlerta(prev => ({
            ...prev,
            isOpen: false
          }))
        }
      />
    </div>
  );
}