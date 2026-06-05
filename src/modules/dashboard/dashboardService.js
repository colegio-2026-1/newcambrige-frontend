/**
 * Servicio exclusivo del módulo Dashboard.
 * Todos los endpoints apuntan al backend real (develop).
 * Usa dashboardClient — NO importa axiosClient de otros módulos.
 */
import dashboardClient from "../../api/dashboardClient";

// ─────────────────────────────────────────────
// PERÍODOS ACADÉMICOS
// GET /api/paz-salvo/periodos
// Acceso: admin | secretaria | rectoria
// ─────────────────────────────────────────────
export const getPeriodos = () =>
  dashboardClient.get("/api/paz-salvo/periodos");

// ─────────────────────────────────────────────
// ESTUDIANTES DEL PERÍODO
// GET /api/estudiantes/periodo/{id}
// Acceso: admin | titular | secretaria | banda | tesoreria | uniformes | rectoria
// ─────────────────────────────────────────────
export const getEstudiantesPorPeriodo = (periodoId) =>
  dashboardClient.get(`/api/estudiantes/periodo/${periodoId}`);

// ─────────────────────────────────────────────
// PENDIENTES DE PAZ Y SALVO
// GET /api/paz-salvo/pendientes?periodo_id=X
// Acceso: admin | secretaria | rectoria
// ─────────────────────────────────────────────
export const getPendientesPazSalvo = (periodoId) =>
  dashboardClient.get("/api/paz-salvo/pendientes", {
    params: periodoId ? { periodo_id: periodoId } : {},
  });

// ─────────────────────────────────────────────
// PAGOS PENDIENTES
// GET /api/tesoreria/pagos-pendientes?periodo_id=X
// Acceso: admin | tesoreria | secretaria
// ─────────────────────────────────────────────
export const getPagosPendientes = (periodoId) =>
  dashboardClient.get("/api/tesoreria/pagos-pendientes", {
    params: periodoId ? { periodo_id: periodoId } : {},
  });

// ─────────────────────────────────────────────
// PRÉSTAMOS ACTIVOS — BANDA
// GET /api/banda/prestamos/activos
// Acceso: admin | banda | secretaria
// ─────────────────────────────────────────────
export const getPrestamosBandaActivos = () =>
  dashboardClient.get("/api/banda/prestamos/activos");

// ─────────────────────────────────────────────
// PRÉSTAMOS ACTIVOS — UNIFORMES
// GET /api/uniformes/prestamos/activos
// Acceso: admin | uniformes
// ─────────────────────────────────────────────
export const getPrestamosUniformesActivos = () =>
  dashboardClient.get("/api/uniformes/prestamos/activos");

// ─────────────────────────────────────────────
// SALONES POR PERÍODO
// GET /api/salones/periodo/{id}
// Acceso: admin | secretaria | tesoreria
// ─────────────────────────────────────────────
export const getSalonesPorPeriodo = (periodoId) =>
  dashboardClient.get(`/api/salones/periodo/${periodoId}`);

// ─────────────────────────────────────────────
// TODOS LOS SALONES (fallback sin filtro de período)
// GET /api/salones/
// ─────────────────────────────────────────────
export const getSalones = () =>
  dashboardClient.get("/api/salones/");
