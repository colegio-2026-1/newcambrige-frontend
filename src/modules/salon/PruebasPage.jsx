import { useState, useEffect } from "react";
import { useAuth } from "../../api/useAuth";
import { Home } from "lucide-react";
import {
  getPruebasRequest,
  updateEstadoPruebaRequest,
  allsalonesRequest,
} from "../../api/endpointsSalon";
import { allrolesuserRequest, allaniosacademicosRequest } from "../../api/endpoints";

import PupitresIcon   from "../../assets/Salon/pupitres.svg";
import BibliotecaIcon from "../../assets/Salon/biblioteca.svg";

import Header        from "../../components/layout/header";
import ModuleLayout  from "../../components/layout/ModuleLayout";
import Sidebar       from "../../components/layout/Sidebar";
import SearchBar     from "../../components/shared/searchBar";
import DataTable     from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal         from "../../components/shared/Modal";

export default function PruebasPage() {
  const { user, logout } = useAuth();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const userName = user?.nombre || "Usuario";
  const idUser   = user?.id_usuario;
  const [roles, setRoles]             = useState([]);
  const [cargandoRol, setCargandoRol] = useState(true);
  const rol = roles[0] || "Rol Desconocido";

  // ── UI ────────────────────────────────────────────────────────────────────
  const [fila, setFila]   = useState(null);
  const [modal, setModal] = useState(false);

  // ── Datos ─────────────────────────────────────────────────────────────────
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [rows, setRows]                 = useState([]);
  const [rowsFiltered, setRowsFiltered] = useState([]);
  const [salones, setSalones]           = useState([]);
  const [periodos, setPeriodos]         = useState([]);

  // ── Maps auxiliares ───────────────────────────────────────────────────────
  const salonesMap  = {};
  salones.forEach((s)  => { salonesMap[s.id_salon]    = s; });
  const periodosMap = {};
  periodos.forEach((p) => { periodosMap[p.id_periodo] = p; });

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const menuItems = [
    { label: "Inicio",     icon: <Home size={18} />, path: "/salon" },
    { label: "Biblioteca", icon: BibliotecaIcon,      path: "/salon/biblioteca/inicio" },
    { label: "Pupitres",   icon: PupitresIcon,        path: "/salon/pupitre" },
  ];

  // ── Columnas ──────────────────────────────────────────────────────────────
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
    { key: "tipo_prueba", label: "TIPO DE PRUEBA" },
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

  // ── Carga de roles ────────────────────────────────────────────────────────
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

  // ── Carga de datos ────────────────────────────────────────────────────────
  const cargarPruebas = async () => {
    try {
      const response = await getPruebasRequest();
      const data = response.data || [];
      setRows(data);
      setRowsFiltered(data);
    } catch (error) {
      console.error("Error cargando pruebas:", error);
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
        await Promise.all([cargarPruebas(), cargarSalones(), cargarPeriodos()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    cargarTodo();
  }, []);

  // ── Filtros ───────────────────────────────────────────────────────────────
  const FiltrarEstudiantes = (filtros) => {
    let filtered = rows;
    if (filtros.documento) filtered = filtered.filter((r) => r.codigo?.toString().includes(filtros.documento));
    if (filtros.nombre)    filtered = filtered.filter((r) => r.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase()));
    if (filtros.Grado)     filtered = filtered.filter((r) => (salonesMap[r.id_salon]?.grado || r.grado)?.toString() === filtros.Grado.toString());
    if (filtros.Grupo)     filtered = filtered.filter((r) => (salonesMap[r.id_salon]?.grupo || r.grupo)?.toString() === filtros.Grupo.toString());
    if (filtros.Periodo) {
      filtered = filtered.filter((r) => {
        const salon   = salonesMap[r.id_salon];
        const periodo = periodosMap[salon?.id_periodo];
        return periodo?.nombre?.toString() === filtros.Periodo.toString();
      });
    }
    setRowsFiltered(filtered);
  };

  // ── Acciones ──────────────────────────────────────────────────────────────
  const handleRowClick = (f) => setFila(f);

  const handleValidarPago = () => {
    if (!fila) { alert("Debes seleccionar una fila"); return; }
    if (fila.estado === "visto") { alert(`EL ESTUDIANTE [${fila.nombre}] YA TIENE PAGO REGISTRADO.`); return; }
    setModal(true);
  };

  const handleConfirmarPago = async () => {
    try {
      if (!fila) return;
      const nuevoEstado = "visto";
      const fechaActual = new Date().toISOString().split("T")[0];
      await updateEstadoPruebaRequest(fila.id_prueba, nuevoEstado);
      const actualizados = rows.map((r) =>
        r.id_prueba === fila.id_prueba ? { ...r, estado: nuevoEstado, fecha_pago: fechaActual } : r
      );
      setRows(actualizados);
      setRowsFiltered(actualizados);
      setFila(null);
      setModal(false);
    } catch (error) {
      console.error("Error al validar pago:", error.response?.data || error);
      alert("Error al validar el pago");
    }
  };

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) return <div>Cargando pruebas...</div>;
  if (error)   return <div>Error cargando datos: {error}</div>;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <style>{`
        .badge--ok      { display:inline-block; padding:.4rem .8rem; background:#D4EDDA; color:#155724; border-radius:.4rem; font-weight:600; font-size:.9rem; }
        .badge--warning { display:inline-block; padding:.4rem .8rem; background:#FFF3CD; color:#856404; border-radius:.4rem; font-weight:600; font-size:.9rem; }
      `}</style>

      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu="Pruebas"
            setSelectedMenu={() => {}}
            user={{ nombre: userName, rol: rol }}
            logout={logout}
          />
        }
        actions={
          <ActionButtons
            filaSeleccionada={fila}
            botones={[
              {
                label: "Validar Pago",
                onClick: handleValidarPago,
                disabled: !fila || fila?.estado === "visto",
                variante: "primary",
              },
            ]}
          />
        }
      >
        <div>
          <SearchBar
            fields={[
              { key: "documento", label: "Código",  type: "number", maxLength: 10 },
              { key: "nombre",    label: "Nombre",  type: "text" },
              {
                key: "Grado", label: "Grado", type: "select",
                options: Array.from(new Set(Object.values(salonesMap).map((s) => s.grado).filter(Boolean))),
              },
              {
                key: "Grupo", label: "Grupo", type: "select",
                options: Array.from(new Set(Object.values(salonesMap).map((s) => s.grupo).filter(Boolean))),
              },
              {
                key: "Periodo", label: "Periodo", type: "select",
                options: Array.from(new Set(Object.values(periodosMap).map((p) => p.nombre).filter(Boolean))),
              },
            ]}
            onSearch={(f) => FiltrarEstudiantes(f)}
          />

          <DataTable
            columns={columns}
            rows={rowsFiltered}
            emptyText="No hay datos disponibles"
            onRowClick={handleRowClick}
          />
        </div>
      </ModuleLayout>

      <Modal
        title={`¿CONFIRMAS QUE EL ESTUDIANTE ${fila?.nombre ? fila.nombre.toUpperCase() : "[NOMBRE]"} HA CUMPLIDO CON EL PAGO DE LA PRUEBA?`}
        isOpen={modal}
        onAccept={handleConfirmarPago}
        onCancel={() => { setModal(false); setFila(null); }}
      />
    </div>
  );
}