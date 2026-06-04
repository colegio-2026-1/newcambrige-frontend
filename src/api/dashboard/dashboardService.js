// src/api/dashboard/dashboardService.js
// Endpoints exclusivos del módulo Dashboard
import dashboardClient from "./dashboardClient";

// ── PERÍODO ACADÉMICO ───────────────────────────────────────────
export const getPeriodos = () =>
  dashboardClient.get("/api/paz-salvo/periodos");

// ── ESTUDIANTES ─────────────────────────────────────────────
export const getEstudiantesPorPeriodo = (idPeriodo) =>
  dashboardClient.get(`/api/estudiantes/periodo/${idPeriodo}`);

// ── PAZ Y SALVO ───────────────────────────────────────────
export const getPendientesPazSalvo = () =>
  dashboardClient.get("/api/paz-salvo/pendientes");

// ── TESORERÍA ───────────────────────────────────────────────
export const getPagosPendientes = () =>
  dashboardClient.get("/api/tesoreria/pagos-pendientes");

// ── BANDA ─────────────────────────────────────────────────────
export const getEstadisticasBanda = () =>
  dashboardClient.get("/api/banda/estadisticas");

export const getPrestamosActivosBanda = () =>
  dashboardClient.get("/api/banda/prestamos/activos");

// ── UNIFORMES ────────────────────────────────────────────────
export const getPrestamosActivosUniformes = () =>
  dashboardClient.get("/api/uniformes/prestamos/activos");

// ── SALONES ──────────────────────────────────────────────────
export const getSalonesPorPeriodo = (idPeriodo) =>
  dashboardClient.get(`/api/salones/periodo/${idPeriodo}`);
