import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/useAuth";
import axiosClient from "../../api/axiosClient";

import {
  getPupitresRequest,
  updatePupitreRequest,
  allsalonesRequest,
} from "../../api/endpointsSalon";
import PruebasIcon    from "../../assets/Salon/pruebas.svg";
import BibliotecaIcon from "../../assets/Salon/biblioteca.svg";

import { allrolesuserRequest, allaniosacademicosRequest } from "../../api/endpoints";
import Header from "../../components/layout/header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import SearchBar from "../../components/shared/SearchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";

export default function PupitrePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [fila, setFila] = useState(null);
  const userName = user?.nombre || "Usuario";
  const [cargandoRol, setCargandoRol] = useState(true);
  const idUser = user?.id_usuario;
  const [roles, setRoles] = useState([]);
  const rol = roles[0] || "Rol Desconocido";
  const [modal, setModal] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [rowsFiltered, setRowsFiltered] = useState([]);
  const [salones, setSalones] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [error, setError] = useState(null);

  // =========================
  // SIDEBAR
  // =========================
  const menuItems = [
    { label: "Inicio",     icon: <Home size={18} />, path: "/salon" },
    { label: "Biblioteca", icon: BibliotecaIcon,      path: "/salon/biblioteca/inicio" },
    { label: "Pruebas",    icon: PruebasIcon,         path: "/salon/pruebas" },
  ];

  // =========================
  // MAPS RELACIONALES
  // =========================
  const salonesMap = {};
  salones.forEach((s) => { salonesMap[s.id_salon] = s; });

  const periodosMap = {};
  periodos.forEach((p) => { periodosMap[p.id_periodo] = p; });

  // =========================
  // COLUMNAS TABLA
  // =========================
  const columns = [
    { key: "codigo", label: "CÓDIGO" },
    { key: "nombre", label: "NOMBRE COMPLETO" },
    {
      key: "grado", label: "GRADO",
      render: (_, row) => <span>{salonesMap[row.id_salon]?.grado || row.grado}</span>,
    },
    {
      key: "grupo", label: "GRUPO",
      render: (_, row) => <span>{salonesMap[row.id_salon]?.grupo || row.grupo}</span>,
    },
    {
      key: "estado", label: "PAGO",
      render: (val) => (
        <span className={val === "visto" ? "badge--ok" : "badge--warning"}>
          {val === "visto" ? "Pagado" : "Pendiente"}
        </span>
      ),
    },
    {
      key: "fecha_pago", label: "FECHA DE PAGO",
      render: (val) => (!val || val === "" ? <span>---</span> : <span>{val}</span>),
    },
  ];

  // =========================
  // ROLES
  // =========================
  useEffect(() => {
    const obtenerRoles = async () => {
      if (!idUser) return;
      try {
        setCargandoRol(true);
        const response = await allrolesuserRequest(idUser);
        setRoles(response?.data || []);
      } catch (error) {
        console.error("Error al obtener el rol:", error);
        setRoles([]);
      } finally {
        setCargandoRol(false);
      }
    };
    obtenerRoles();
  }, [idUser]);

  // =========================
  // CARGAR DATOS
  // =========================
  const cargarPupitres = async () => {
    try {
      const response = await getPupitresRequest();
      const data = response.data || [];
      setRows(data);
      setRowsFiltered(data);
    } catch (error) {
      console.error("Error cargando pupitres:", error);
      setError(error.message);
    }
  };

  const cargarSalones = async () => {
    try {
      const response = await allsalonesRequest();
      setSalones(response.data || []);
    } catch (error) {
      console.error("Error cargando salones:", error);
    }
  };

  const cargarPeriodos = async () => {
    try {
      const response = await allaniosacademicosRequest();
      setPeriodos(response.data || []);
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setLoading(true);
        await Promise.all([cargarPupitres(), cargarSalones(), cargarPeriodos()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cargarTodo();
  }, []);

  // =========================
  // FILTRAR
  // =========================
  const FiltrarEstudiantes = (filtros) => {
    let filtered = rows;
    if (filtros.documento) filtered = filtered.filter((r) => r.codigo?.toString().includes(filtros.documento));
    if (filtros.nombre)    filtered = filtered.filter((r) => r.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase()));
    if (filtros.Grado)     filtered = filtered.filter((r) => (salonesMap[r.id_salon]?.grado || r.grado)?.toString() === filtros.Grado.toString());
    if (filtros.Grupo)     filtered = filtered.filter((r) => (salonesMap[r.id_salon]?.grupo || r.grupo)?.toString() === filtros.Grupo.toString());
    if (filtros.Periodo) {
      filtered = filtered.filter((r) => {
        const salon = salonesMap[r.id_salon];
        const periodo = periodosMap[salon?.id_periodo];
        return periodo?.nombre?.toString() === filtros.Periodo.toString();
      });
    }
    setRowsFiltered(filtered);
  };

  // =========================
  // ACCIONES
  // =========================
  const handleRowClick = (f) => {
    setFila(f);
    setMensajeConfirmacion("");
  };

  const handleValidarPago = () => {
    if (!fila) { alert("Debes seleccionar una fila"); return; }
    setMensajeConfirmacion("");
    setModal(true);
  };

  const handleConfirmarPago = async () => {
    try {
      if (!fila) return;
      const nuevoEstado = "visto";
      const fechaActual = new Date().toISOString().split("T")[0];
      await updatePupitreRequest(fila.id_mantenimiento, { estado: nuevoEstado, fecha_pago: fechaActual });
      const rowsActualizados = rows.map((r) =>
        r.id_mantenimiento === fila.id_mantenimiento ? { ...r, estado: nuevoEstado, fecha_pago: fechaActual } : r
      );
      setRows(rowsActualizados);
      setRowsFiltered(rowsActualizados);
      setFila(null);
      setModal(false);
    } catch (error) {
      console.error("Error al validar pago:", error.response?.data || error);
      alert("Error al validar el pago");
    }
  };

  const cerrarModal = () => {
    setModal(false);
    setMensajeConfirmacion("");
    setFila(null);
  };

  // =========================
  // LOADING / ERROR
  // =========================
  if (loading) return <div>Cargando pupitres...</div>;
  if (error)   return <div>Error cargando datos: {error}</div>;

  // =========================
  // RENDER
  // =========================
  return (
    <div>
      <style>{`
        .badge--ok      { display:inline-block; padding:.4rem .8rem; background:#D4EDDA; color:#155724; border-radius:.4rem; font-weight:600; font-size:.9rem; }
        .badge--warning { display:inline-block; padding:.4rem .8rem; background:#FFF3CD; color:#856404; border-radius:.4rem; font-weight:600; font-size:.9rem; }
        .confirmacion-modal-fix .modal-fields  { display:flex !important; flex-direction:column !important; align-items:center !important; justify-content:center !important; width:100% !important; }
        .confirmacion-modal-fix .modal-field   { display:block !important; width:100% !important; text-align:center !important; }
        .confirmacion-modal-fix .modal-label   { display:block !important; text-align:center !important; width:100% !important; margin:0 auto !important; }
        .confirmacion-modal-fix .modal-input   { display:none !important; }
      `}</style>

      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu="Pupitres"
            setSelectedMenu={() => {}}
            user={{ nombre: userName, rol: rol }}
            logout={logout}
          />
        }
        actions={
          <div style={{ width:"100%", display:"flex", justifyContent:"flex-end", gap:"0.5rem", paddingRight:"1rem", marginTop:"0.4rem", paddingTop:"0.4rem" }}>
            <ActionButtons
              filaSeleccionada={fila}
              botones={[
                { label: "Validar Pago", onClick: handleValidarPago, disabled: !fila || fila?.estado === "visto", variante: "primary" },
              ]}
            />
          </div>
        }
      >
        <SearchBar
          loading={loading}
          fields={[
            { key: "documento", label: "Código",  type: "number", maxLength: 10 },
            { key: "nombre",    label: "Nombre",  type: "text" },
            { key: "Grado",     label: "Grado",   type: "select", options: Array.from(new Set(Object.values(salonesMap).map((s) => s.grado).filter(Boolean))) },
            { key: "Grupo",     label: "Grupo",   type: "select", options: Array.from(new Set(Object.values(salonesMap).map((s) => s.grupo).filter(Boolean))) },
            { key: "Periodo",   label: "Periodo", type: "select", options: Array.from(new Set(Object.values(periodosMap).map((p) => p.nombre).filter(Boolean))) },
          ]}
          onSearch={(f) => { FiltrarEstudiantes(f); console.log(f); }}
        />

        <div style={{ marginTop:"1rem", background:"#FFFFFF", borderRadius:"0.8rem", overflow:"hidden", border:"1px solid #D9D9D9" }}>
          <div style={{ padding:"0.5rem 1rem", background:"#f5f5f5", borderBottom:"1px solid #D9D9D9", fontSize:"0.9rem", fontWeight:"600" }}>
            {rowsFiltered.length} estudiantes
          </div>
          <DataTable columns={columns} rows={rowsFiltered} emptyText="No hay datos disponibles" onRowClick={handleRowClick} />
        </div>
      </ModuleLayout>

      <div className="confirmacion-modal-fix">
        <Modal
          title="CONFIRMACIÓN"
          isOpen={modal}
          values={{}}
          onChange={() => {}}
          onAccept={handleConfirmarPago}
          onCancel={cerrarModal}
          fields={[
            {
              key: "mensaje_alerta",
              label: (
                <div style={{ display:"block", textAlign:"center", padding:"1rem 0.5rem", fontSize:"1.15rem", fontWeight:"bold", color:"#000000", textTransform:"uppercase", lineHeight:"1.6", fontFamily:"inherit", width:"100%" }}>
                  ¿CONFIRMAS QUE EL ESTUDIANTE{" "}
                  <span style={{ color:"#1976D2", fontWeight:"bold" }}>
                    {fila?.nombre ? fila.nombre.toUpperCase() : "[NOMBRE]"}
                  </span>
                  , HA CUMPLIDO CON EL PAGO DEL CONCEPTO DE PUPITRES?
                </div>
              ),
              type: "text",
            },
          ]}
        />
      </div>
    </div>
  );
}