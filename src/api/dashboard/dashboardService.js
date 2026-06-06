// src/api/dashboard/dashboardService.js
// Endpoints exclusivos del módulo Dashboard
// Solo consume rutas que existen en el backend (app/routers.py)
import dashboardClient from "./dashboardClient";

// ── ROLES DEL USUARIO ──────────────────────────────────────────────────────
// GET /api/usuarios/{id_usuario}/roles
// Devuelve array de strings: ["admin", "secretaria", ...]
// Roles permitidos: todos los roles registrados del sistema
export const getRolesUsuario = (idUsuario) =>
  dashboardClient.get(`/api/usuarios/${idUsuario}/roles`);

// ── PERÍODO ACADÉMICO ────────────────────────────────────────────────
// GET /api/paz-salvo/periodos
// Roles: admin, secretaria, rectoria
export const getPeriodos = () =>
  dashboardClient.get("/api/paz-salvo/periodos");

// ── ESTUDIANTES ─────────────────────────────────────────────────────
// GET /api/estudiantes/periodo/{id_periodo}
export const getEstudiantesPorPeriodo = (idPeriodo) =>
  dashboardClient.get(`/api/estudiantes/periodo/${idPeriodo}`);

// ── PAZ Y SALVO ────────────────────────────────────────────────────
// GET /api/paz-salvo/pendientes?periodo_id={id}
// El backend recibe periodo_id como query param, NO como path param
// Roles: admin, secretaria, rectoria
export const getPendientesPazSalvo = (idPeriodo) =>
  dashboardClient.get("/api/paz-salvo/pendientes", {
    params: { periodo_id: idPeriodo },
  });

// ── SECRETARÍA — MATRÍCULAS PENDIENTES ───────────────────────────
// GET /api/secretaria/matriculas/periodo/{id_periodo}
// Roles: admin, secretaria, titular, tesoreria
export const getMatriculasPorPeriodo = (idPeriodo) =>
  dashboardClient.get(`/api/secretaria/matriculas/periodo/${idPeriodo}`);

// ── BANDA ───────────────────────────────────────────────────────────────
// GET /api/banda/prestamos/activos
// Roles: admin, banda, secretaria
export const getPrestamosActivosBanda = () =>
  dashboardClient.get("/api/banda/prestamos/activos");

// GET /api/banda/estadisticas
// Roles: admin, banda
export const getEstadisticasBanda = () =>
  dashboardClient.get("/api/banda/estadisticas");

// ── UNIFORMES ───────────────────────────────────────────────────────────
// GET /api/uniformes/prestamos/activos
// Roles: admin, uniformes
export const getPrestamosActivosUniformes = () =>
  dashboardClient.get("/api/uniformes/prestamos/activos");

// ── SALONES ──────────────────────────────────────────────────────────────
// GET /api/salones/periodo/{id_periodo}
export const getSalonesPorPeriodo = (idPeriodo) =>
  dashboardClient.get(`/api/salones/periodo/${idPeriodo}`);
