/**
 * DashboardPage — módulo Dashboard, New Cambridge School.
 * - Usa useAuth() para obtener el usuario y sus roles reales.
 * - Llama a dashboardService.js con los endpoints reales del backend.
 * - Filtra KPIs y gráficas según el rol del usuario autenticado.
 * - Usa ModuleLayout y Sidebar del equipo.
 * - main.jsx NO se toca.
 */
import { useEffect, useState } from "react";
import { Home, LayoutDashboard } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";

import Header        from "../../components/layout/header";
import ModuleLayout  from "../../components/layout/ModuleLayout";
import Sidebar       from "../../components/layout/Sidebar";
import { useAuth }   from "../../api/useAuth";

import {
  getPeriodos,
  getEstudiantesPorPeriodo,
  getPendientesPazSalvo,
  getPagosPendientes,
  getPrestamosBandaActivos,
  getPrestamosUniformesActivos,
  getSalonesPorPeriodo,
} from "../../api/dashboard/dashboardService";

import "./DashboardPage.css";

// ── Paleta institucional ──────────────────────────────────────────
const C_RED   = "#8E2A25";
const C_BLUE  = "#1B3A5C";
const C_GREEN = "#2E7D4F";
const C_WARN  = "#A06000";
const DONUT_COLORS = [C_GREEN, C_RED];
const BAR_COLORS   = [C_RED, C_BLUE, C_GREEN, C_WARN];

// ── Permisos por rol ─────────────────────────────────────────────
const PERMISOS = {
  admin:      { kpiEstudiantes: true,  kpiPaz: true,  kpiPendientes: true,  kpiPagos: true,  grafPaz: true,  grafPrestamos: true,  grafSalones: true,  grafPagos: true  },
  secretaria: { kpiEstudiantes: true,  kpiPaz: true,  kpiPendientes: true,  kpiPagos: false, grafPaz: true,  grafPrestamos: false, grafSalones: true,  grafPagos: false },
  rectoria:   { kpiEstudiantes: true,  kpiPaz: true,  kpiPendientes: true,  kpiPagos: false, grafPaz: true,  grafPrestamos: false, grafSalones: false, grafPagos: false },
  tesoreria:  { kpiEstudiantes: false, kpiPaz: false, kpiPendientes: false, kpiPagos: true,  grafPaz: false, grafPrestamos: false, grafSalones: true,  grafPagos: true  },
  banda:      { kpiEstudiantes: false, kpiPaz: false, kpiPendientes: false, kpiPagos: false, grafPaz: false, grafPrestamos: true,  grafSalones: false, grafPagos: false },
  uniformes:  { kpiEstudiantes: false, kpiPaz: false, kpiPendientes: false, kpiPagos: false, grafPaz: false, grafPrestamos: true,  grafSalones: false, grafPagos: false },
  titular:    { kpiEstudiantes: true,  kpiPaz: false, kpiPendientes: false, kpiPagos: false, grafPaz: false, grafPrestamos: false, grafSalones: true,  grafPagos: false },
};

const getPermisos = (roles = []) => {
  for (const r of roles) {
    if (PERMISOS[r]) return PERMISOS[r];
  }
  return PERMISOS.admin;
};

// ── Subcomponentes ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dash-tooltip">
      {label && <p className="dash-tooltip-label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

const KpiCard = ({ title, value, sub, color, loading }) => (
  <div className="dash-kpi-card" style={{ borderTopColor: color }}>
    <span className="dash-kpi-title">{title}</span>
    {loading
      ? <span className="dash-kpi-skeleton" />
      : <span className="dash-kpi-value" style={{ color }}>{value ?? "—"}</span>
    }
    {sub && <span className="dash-kpi-sub">{sub}</span>}
  </div>
);

const ChartSwitch = ({ options, value, onChange }) => (
  <div className="dash-switch">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        className={`dash-switch-btn ${value === o.value ? "active" : ""}`}
        onClick={() => onChange(o.value)}
      >
        {o.label}
      </button>
    ))}
  </div>
);

// ── Componente principal ─────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();

  const roles = user?.roles?.map((r) => r.nombre ?? r) ?? [];
  const can   = getPermisos(roles);

  const menuItems = [
    { label: "Inicio",    path: "/home",      icon: <Home size={18} /> },
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
  ];

  // ── Estado ────────────────────────────────────────────────────
  const [selectedMenu,      setSelectedMenu]      = useState("Dashboard");
  const [periodos,          setPeriodos]          = useState([]);
  const [periodoId,         setPeriodoId]         = useState("");
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState(null);

  // KPIs
  const [totalEstudiantes,  setTotalEstudiantes]  = useState(null);
  const [totalPazOk,        setTotalPazOk]        = useState(null);
  const [totalPendientes,   setTotalPendientes]   = useState(null);
  const [totalPagos,        setTotalPagos]        = useState(null);

  // Gráficas
  const [pazData,           setPazData]           = useState([]);
  const [prestData,         setPrestData]         = useState([]);
  const [salonesData,       setSalonesData]       = useState([]);
  const [pagosData,         setPagosData]         = useState([]);
  const [pazChart,          setPazChart]          = useState("donut");

  // ── Cargar períodos al montar ────────────────────────────────
  useEffect(() => {
    getPeriodos()
      .then((res) => {
        const data = res.data ?? [];
        setPeriodos(data);
        if (data.length > 0) setPeriodoId(String(data[0].id_periodo));
      })
      .catch(() => setError("No se pudieron cargar los períodos."));
  }, []);

  // ── Cargar datos cuando cambia el período ────────────────────
  useEffect(() => {
    if (!periodoId) return;
    const id = Number(periodoId);
    setLoading(true);
    setError(null);

    const tareas = [];

    if (can.kpiEstudiantes || can.grafSalones) {
      tareas.push(
        getEstudiantesPorPeriodo(id)
          .then((r) => setTotalEstudiantes(r.data?.length ?? 0))
          .catch(() => {})
      );
    }

    if (can.kpiPendientes || can.kpiPaz || can.grafPaz) {
      tareas.push(
        getPendientesPazSalvo(id)
          .then((r) => {
            const pendientes = r.data ?? [];
            setTotalPendientes(pendientes.length);
            setTotalPazOk(
              totalEstudiantes !== null
                ? totalEstudiantes - pendientes.length
                : null
            );
            setPazData([
              { name: "Al día",    value: totalEstudiantes ? totalEstudiantes - pendientes.length : 0 },
              { name: "Pendiente", value: pendientes.length },
            ]);
          })
          .catch(() => {})
      );
    }

    if (can.kpiPagos || can.grafPagos) {
      tareas.push(
        getPagosPendientes(id)
          .then((r) => {
            const pagos = r.data ?? [];
            setTotalPagos(pagos.length);
            setPagosData(pagos.slice(0, 5));
          })
          .catch(() => {})
      );
    }

    if (can.grafPrestamos) {
      tareas.push(
        Promise.allSettled([
          getPrestamosBandaActivos(),
          getPrestamosUniformesActivos(),
        ]).then(([banda, uniformes]) => {
          setPrestData([
            { modulo: "Banda",     activos: banda.status === "fulfilled" ? (banda.value.data?.length ?? 0) : 0 },
            { modulo: "Uniformes", activos: uniformes.status === "fulfilled" ? (uniformes.value.data?.length ?? 0) : 0 },
          ]);
        })
      );
    }

    if (can.grafSalones) {
      tareas.push(
        getSalonesPorPeriodo(id)
          .then((r) => {
            const salones = r.data ?? [];
            setSalonesData(
              salones
                .map((s) => ({ nombre: s.nombre ?? `${s.grado}°${s.grupo}`, estudiantes: s.num_estudiantes ?? 0 }))
                .sort((a, b) => b.estudiantes - a.estudiantes)
                .slice(0, 10)
            );
          })
          .catch(() => {})
      );
    }

    Promise.allSettled(tareas).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodoId]);

  // ── Render ───────────────────────────────────────────────────
  const periodoLabel = periodos.find((p) => String(p.id_periodo) === periodoId)?.nombre ?? "";

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO — NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            user={user}
          />
        }
      >
        <div className="dash-wrapper">

          {/* ERROR GLOBAL */}
          {error && <p className="dash-error">{error}</p>}

          {/* FILTRO PERÍODO */}
          <div className="dash-filter-bar">
            <label className="dash-filter-label" htmlFor="periodo-select">
              Período académico
            </label>
            <select
              id="periodo-select"
              className="dash-filter-select"
              value={periodoId}
              onChange={(e) => setPeriodoId(e.target.value)}
            >
              {periodos.length === 0 && (
                <option value="">Cargando...</option>
              )}
              {periodos.map((p) => (
                <option key={p.id_periodo} value={String(p.id_periodo)}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {periodoLabel && (
              <span className="dash-filter-badge">{periodoLabel}</span>
            )}
          </div>

          {/* KPI CARDS */}
          <div className="dash-kpi-grid">
            {can.kpiEstudiantes && (
              <KpiCard title="Estudiantes"      value={totalEstudiantes} sub="en el período"          color={C_BLUE}  loading={loading} />
            )}
            {can.kpiPaz && (
              <KpiCard title="Paz y Salvo OK"   value={totalPazOk}       sub="sin pendientes"          color={C_GREEN} loading={loading} />
            )}
            {can.kpiPendientes && (
              <KpiCard title="Con Pendientes"   value={totalPendientes}  sub="paz y salvo incompleto"  color={C_RED}   loading={loading} />
            )}
            {can.kpiPagos && (
              <KpiCard title="Pagos Pendientes" value={totalPagos}       sub="por regularizar"         color={C_WARN}  loading={loading} />
            )}
          </div>

          {/* FILA 1: Paz y Salvo + Préstamos */}
          {(can.grafPaz || can.grafPrestamos) && (
            <div className="dash-row">

              {can.grafPaz && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3 className="dash-card-title">Estado Paz y Salvo</h3>
                    <ChartSwitch
                      options={[
                        { label: "Donut",  value: "donut" },
                        { label: "Barras", value: "bar"   },
                      ]}
                      value={pazChart}
                      onChange={setPazChart}
                    />
                  </div>

                  {pazData.length === 0 && !loading
                    ? <p className="dash-empty">Sin datos para este período</p>
                    : pazChart === "donut" ? (
                        <ResponsiveContainer width="100%" height={240}>
                          <PieChart>
                            <Pie data={pazData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                              {pazData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={pazData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" name="Estudiantes" radius={[4, 4, 0, 0]}>
                              {pazData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      )
                  }
                </div>
              )}

              {can.grafPrestamos && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3 className="dash-card-title">Préstamos Activos</h3>
                    <span className="dash-card-sub">Banda vs Uniformes</span>
                  </div>
                  {prestData.length === 0 && !loading
                    ? <p className="dash-empty">Sin datos disponibles</p>
                    : (
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={prestData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
                          <XAxis dataKey="modulo" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="activos" name="Activos" radius={[4, 4, 0, 0]}>
                            {prestData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )
                  }
                </div>
              )}
            </div>
          )}

          {/* FILA 2: Salones + Pagos */}
          {(can.grafSalones || can.grafPagos) && (
            <div className="dash-row">

              {can.grafSalones && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3 className="dash-card-title">Estudiantes por Salón</h3>
                    <span className="dash-card-sub">Período actual · Top 10</span>
                  </div>
                  {salonesData.length === 0 && !loading
                    ? <p className="dash-empty">Sin datos para este período</p>
                    : (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={salonesData} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                          <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11 }} width={45} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="estudiantes" name="Estudiantes" fill={C_BLUE} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )
                  }
                </div>
              )}

              {can.grafPagos && (
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h3 className="dash-card-title">Pagos Pendientes</h3>
                    <span className="dash-card-sub">Top 5</span>
                  </div>
                  {pagosData.length === 0 && !loading
                    ? <p className="dash-empty">Sin pagos pendientes</p>
                    : (
                      <ul className="dash-pagos-list">
                        {pagosData.map((pago, i) => (
                          <li key={i} className="dash-pagos-item">
                            <span className="dash-pagos-num">{i + 1}</span>
                            <div className="dash-pagos-info">
                              <span className="dash-pagos-nombre">
                                {pago.nombre_estudiante ?? pago.estudiante ?? "Estudiante"}
                              </span>
                              <span className="dash-pagos-concepto">
                                {pago.concepto ?? pago.detalle ?? "Pendiente"}
                              </span>
                            </div>
                            <span className="dash-pagos-badge">Pendiente</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                </div>
              )}
            </div>
          )}

        </div>
      </ModuleLayout>
    </div>
  );
}
