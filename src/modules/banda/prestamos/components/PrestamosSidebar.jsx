import React from "react";

const PrestamosSidebar = ({ estudiantes = [], instrumentos = [], estadisticas = {} }) => {
  return (
    <aside style={panelStyle}>
      <h3 style={titleStyle}>RESUMEN DE ASIGNACIONES</h3>
      
      <div style={statsContainer}>
        <div style={statCard}>
          <span style={statLabel}>Estudiantes Banda</span>
          <span style={statValue}>{estudiantes.length}</span>
        </div>

        <div style={statCard}>
          <span style={statLabel}>Préstamos Activos</span>
          <span style={{ ...statValue, color: "var(--color-secondary)" }}>
            {estadisticas.activos || 0}
          </span>
        </div>

        <div style={statCard}>
          <span style={statLabel}>Instrumentos Libres</span>
          <span style={{ ...statValue, color: "var(--color-success)" }}>
            {instrumentos.length}
          </span>
        </div>
      </div>
    </aside>
  );
};

// MISMOS ESTILOS PARA CONSISTENCIA
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

export default PrestamosSidebar;