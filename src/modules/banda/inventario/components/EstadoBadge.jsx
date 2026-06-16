const EstadoBadge = ({ estado, disponible }) => {

  const statusMap = {
    "Activo": {
      bg: disponible ? "#DCFCE7" : "#FEE2E2", 
      color: disponible ? "#15803D" : "#B91C1C",
      text: disponible ? "Disponible" : "Asignado",
    },
    "Inactivo": {
      bg: "#F3F4F6",
      color: "#374151",
      text: "Inactivo",
    },
    "En mantenimiento": {
      bg: "#FEE2E2",
      color: "#854D0E",
      text: "Mantenimiento",
    },
    "Pendiente": { bg: "#FEF9C3", color: "#854D0E", text: "Pendiente" },
    "Disponible": { bg: "#DCFCE7", color: "#15803D", text: "Disponible" },
  };

  const styles = statusMap[estado] || {
    bg: "#E5E7EB",
    color: "#6B7280",
    text: estado || "Desconocido",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "130px",
        padding: "8px 14px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "0.4px",
        backgroundColor: styles.bg,
        color: styles.color,
        border: "1px solid rgba(0,0,0,0.04)",
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        fontFamily: "var(--font-body)",
      }}
    >
      {styles.text}
    </span>
  );
};

export default EstadoBadge;