import React, { useEffect, useState } from 'react';
import { bandaService } from "../../../../api/bandaService";
import { useAuth } from "../../../../api/useAuth";
import ModuleLayout from "../../../../components/layout/ModuleLayout";
import Sidebar from "../../../../components/layout/Sidebar";
import Header from "../../../../components/layout/Header";
import DataTable from "../../../../components/shared/DataTable";
import Toast from "../components/Toast";

const AuditoriaBandaPage = () => {
  const [logs, setLogs] = useState([]); // ✅ Siempre inicializado como array
  const [loading, setLoading] = useState(true);
  const [mensajeError, setMensajeError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await bandaService.getAuditoria();
        // ✅ Forzamos que si no es array, use una lista vacía
        setLogs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error cargando auditoría", error);
        setLogs([]); // Evita el crash
        setMensajeError("No se pudo cargar el historial o no tienes permisos.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columnas = [
    { key: "fecha", label: "FECHA" },
    { key: "nombre_usuario", label: "USUARIO" },
    { key: "modulo_origen", label: "MÓDULO" },
    { key: "tipo_accion", label: "ACCIÓN" },
    { key: "entidad_afectada", label: "ENTIDAD" },
    { 
      key: "resultado", 
      label: "RESULTADO",
      render: (val) => (
        <span style={{ color: val === "EXITOSO" ? "var(--color-success)" : "var(--color-danger)", fontWeight: "bold" }}>
          {val}
        </span>
      )
    },
  ];

  const menuBanda = [
    { label: "Inicio", path: "/banda" },
    { label: "Inventario Banda", path: "/banda/inventario" },
    { label: "Préstamos", path: "/banda/prestamos" },
  ];

  if (user?.roles?.includes("admin") || user?.rol === "admin") {
    menuBanda.push({ label: "Auditoría", path: "/banda/auditoria" });
  }

  if (loading) return <div className="inventario-loading">Cargando historial...</div>;

  return (
    <div className='banda-module-container'>
      <Header title="AUDITORÍA DE MOVIMIENTOS - BANDA" />
      <Toast message={mensajeError} />
      <ModuleLayout
        sidebar={
          <Sidebar
            moduloActual="Auditoría"
            menuItems={menuBanda}
            user={user}
          />
        }
      >
        <div style={{ padding: '20px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', marginBottom: '20px' }}>
            HISTORIAL INMUTABLE DE ACCIONES
          </h2>
          <div className="inventario-table-card">
            <DataTable columns={columnas} rows={logs} emptyText="No hay registros de auditoría aún." />
          </div>
        </div>
      </ModuleLayout>
    </div>
  );
};

export default AuditoriaBandaPage;