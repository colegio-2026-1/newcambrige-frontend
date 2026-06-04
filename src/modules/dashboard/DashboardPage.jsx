// src/modules/dashboard/DashboardPage.jsx
import { useEffect, useState, useCallback } from "react";
import { Home, LayoutDashboard } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";

import Header       from "../../components/layout/header";
import Sidebar      from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import "./DashboardPage.css";

// ── Paleta institucional ─────────────────────────────────────────
const C_RED   = "#8E2A25";
const C_BLUE  = "#1B3A5C";
const C_GREEN = "#2E7D4F";
const C_WARN  = "#A06000";
const DONUT_COLORS = [C_GREEN, C_RED];
const BAR_COLORS   = [C_RED, C_BLUE, C_GREEN, C_WARN, "#5C3A8E", "#1A7A7A"];

// ── MOCK DATA (reemplazar con API cuando el backend esté activo) ────────
const MOCK_PERIODOS = [
  { id: 1, nombre: "2026 — Primer Período" },
  { id: 2, nombre: "2026 — Segundo Período" },
  { id: 3, nombre: "2025 — Primer Período" },
];

const MOCK_KPI = { estudiantes: 312, pazOk: 278, pendientes: 34, pagosPend: 12 };

const MOCK_PAZ = [
  { name: "Al día",    value: 278 },
  { name: "Pendiente", value: 34  },
];

const MOCK_PREST = [
  { modulo: "Banda",     activos: 48 },
  { modulo: "Uniformes", activos: 31 },
];

const MOCK_SALONES = [
  { nombre: "6°A",  estudiantes: 32 },
  { nombre: "6°B",  estudiantes: 30 },
  { nombre: "7°A",  estudiantes: 28 },
  { nombre: "7°B",  estudiantes: 29 },
  { nombre: "8°A",  estudiantes: 27 },
  { nombre: "8°B",  estudiantes: 25 },
  { nombre: "9°A",  estudiantes: 26 },
  { nombre: "10°A", estudiantes: 33 },
  { nombre: "11°A", estudiantes: 31 },
  { nombre: "11°B", estudiantes: 28 },
];

const MOCK_PAGOS = [
  { nombre_estudiante: "Andres Pérez",   concepto: "Pensión marzo" },
  { nombre_estudiante: "María Gutiérrez", concepto: "Matrícula" },
  { nombre_estudiante: "Carlos López",   concepto: "Papelería" },
  { nombre_estudiante: "Laura Jiménez",  concepto: "Pensión abril" },
  { nombre_estudiante: "Diego Torres",   concepto: "Pensión febrero" },
];

// ── Tooltip personalizado ──────────────────────────────────────
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

// ── KPI Card ─────────────────────────────────────────────────────
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

// ── Switch tipo gráfica ───────────────────────────────────────────
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

// ══════════════════════════════════════════════════════════
export default function DashboardPage() {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [periodos,    setPeriodos]    = useState(MOCK_PERIODOS);
  const [periodoId,   setPeriodoId]   = useState("1");
  const [loading,     setLoading]     = useState(false);
  const [kpi,         setKpi]         = useState(MOCK_KPI);
  const [salonesData, setSalonesData] = useState(MOCK_SALONES);
  const [pazData,     setPazData]     = useState(MOCK_PAZ);
  const [prestData,   setPrestData]   = useState(MOCK_PREST);
  const [pagos,       setPagos]       = useState(MOCK_PAGOS);
  const [pazChart,    setPazChart]    = useState("donut");

  const menuItems = [
    { label: "Inicio",    path: "/home",      icon: <Home size={18} /> },
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
  ];

  const mockUser = { nombre: "Administrador", rol: "Admin" };

  const periodoLabel = periodos.find((p) => String(p.id) === periodoId)?.nombre ?? "";

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO — NEW CAMBRIDGE SCHOOL" />

      <div className="dash-body">
        <Sidebar
          menuItems={menuItems}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          user={mockUser}
        />

        <main className="dash-main">
          <div className="dash-wrapper">

            {/* ── FILTRO PERÍODO ── */}
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
                {periodos.map((p) => (
                  <option key={p.id} value={String(p.id)}>{p.nombre}</option>
                ))}
              </select>
              {periodoLabel && (
                <span className="dash-filter-badge">{periodoLabel}</span>
              )}
            </div>

            {/* ── KPI CARDS ── */}
            <div className="dash-kpi-grid">
              <KpiCard title="Estudiantes"      value={kpi.estudiantes} sub="en el período"         color={C_BLUE}  loading={loading} />
              <KpiCard title="Paz y Salvo OK"   value={kpi.pazOk}       sub="sin pendientes"         color={C_GREEN} loading={loading} />
              <KpiCard title="Con Pendientes"   value={kpi.pendientes}  sub="paz y salvo incompleto" color={C_RED}   loading={loading} />
              <KpiCard title="Pagos Pendientes" value={kpi.pagosPend}   sub="por regularizar"        color={C_WARN}  loading={loading} />
            </div>

            {/* ── FILA 1: Paz y Salvo + Préstamos ── */}
            <div className="dash-row">

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

                {pazChart === "donut" ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={pazData}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pazData.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={pazData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B6560" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#6B6560" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Estudiantes" radius={[4, 4, 0, 0]}>
                        {pazData.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h3 className="dash-card-title">Préstamos Activos</h3>
                  <span className="dash-card-sub">Banda vs Uniformes</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={prestData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" />
                    <XAxis dataKey="modulo" tick={{ fontSize: 12, fill: "#6B6560" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#6B6560" }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="activos" name="Activos" radius={[4, 4, 0, 0]}>
                      {prestData.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ── FILA 2: Salones + Pagos ── */}
            <div className="dash-row">

              <div className="dash-card">
                <div className="dash-card-header">
                  <h3 className="dash-card-title">Estudiantes por Salón</h3>
                  <span className="dash-card-sub">Período actual · Top 10</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={salonesData}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 30, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0d8cc" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#6B6560" }} allowDecimals={false} />
                    <YAxis type="category" dataKey="nombre" tick={{ fontSize: 11, fill: "#1A1A1A" }} width={45} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="estudiantes" name="Estudiantes" fill={C_BLUE} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h3 className="dash-card-title">Pagos Pendientes</h3>
                  <span className="dash-card-sub">Top 5</span>
                </div>
                <ul className="dash-pagos-list">
                  {pagos.map((pago, i) => (
                    <li key={i} className="dash-pagos-item">
                      <span className="dash-pagos-num">{i + 1}</span>
                      <div className="dash-pagos-info">
                        <span className="dash-pagos-nombre">{pago.nombre_estudiante}</span>
                        <span className="dash-pagos-concepto">{pago.concepto}</span>
                      </div>
                      <span className="dash-pagos-badge">Pendiente</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
