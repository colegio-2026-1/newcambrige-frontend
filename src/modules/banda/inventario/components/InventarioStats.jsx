import React, { useMemo } from "react";

const InventarioStats = ({ instrumentos = [] }) => {
  // Cálculo de métricas basado en el nuevo modelo de datos (Fase 4)
  const stats = useMemo(() => {
    const total = instrumentos.reduce((acc, i) => acc + (i.cantidad_total || 0), 0);
    const disponibles = instrumentos.reduce((acc, i) => acc + (i.cantidad_disponible || 0), 0);
    const ocupados = total - disponibles;

    return { total, disponibles, ocupados };
  }, [instrumentos]);

  return (
    <aside style={panelStyle}>
      <h3 style={titleStyle}>RESUMEN DE INVENTARIO</h3>
      
      <div style={statsContainer}>
        <div style={statCard}>
          <span style={statLabel}>Total Unidades</span>
          <span style={statValue}>{stats.total}</span>
        </div>

        <div style={statCard}>
          <span style={statLabel}>Disponibles</span>
          <span style={{ ...statValue, color: "var(--color-success)" }}>
            {stats.disponibles}
          </span>
        </div>

        <div style={statCard}>
          <span style={statLabel}>En Préstamo</span>
          <span style={{ ...statValue, color: "var(--color-primary)" }}>
            {stats.ocupados}
          </span>
        </div>
      </div>
    </aside>
  );
};

// ESTILOS USANDO VARIABLES GLOBALES DEL EQUIPO
const panelStyle = {
  width: "100%",
  background: "var(--color-white)",
  border: "1.5px solid var(--color-border-light)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-5)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-4)",
  boxShadow: "var(--shadow-sm)",
};

const titleStyle = {
  margin: 0,
  fontSize: "var(--text-xs)",
  fontWeight: "var(--font-bold)",
  color: "var(--color-secondary)",
  fontFamily: "var(--font-display)",
  letterSpacing: "var(--letter-wide)",
  borderBottom: "1px solid var(--color-border-light)",
  paddingBottom: "var(--space-2)",
};

const statsContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3)",
};

const statCard = {
  background: "var(--color-bg)",
  borderRadius: "var(--radius-md)",
  padding: "var(--space-4)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
};

const statLabel = {
  fontSize: "10px",
  fontWeight: "var(--font-bold)",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
};

const statValue = {
  fontSize: "var(--text-xl)",
  fontWeight: "800",
  color: "var(--color-text)",
};

export default InventarioStats;