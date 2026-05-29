import { useNavigate } from "react-router-dom";

const panelStyle = {
  width: "100%",

  position: "sticky",

  top: "24px",

  background: "#F4F1EA",

  border: "1px solid #DDD6C8",

  borderRadius: "18px",

  padding: "20px",

  display: "flex",

  flexDirection: "column",

  gap: "22px",

  boxSizing: "border-box",

  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const titleStyle = {
  margin: 0,

  fontSize: "16px",

  fontWeight: "700",

  color: "#222",

  fontFamily: "var(--font-body)",
};

const buttonContainer = {
  display: "flex",

  flexDirection: "column",

  gap: "12px",
};

const getButtonStyle = (active) => ({
  height: "48px",

  borderRadius: "10px",

  border: "none",

  cursor: "pointer",

  fontWeight: "700",

  fontSize: "14px",

  transition: "all 0.2s ease",

  background: active
    ? "#1E3A5F"
    : "#D8D2C4",

  color: active
    ? "#FFFFFF"
    : "#222",
});

const statsContainer = {
  display: "grid",

  gridTemplateColumns: "1fr",

  gap: "12px",
};

const statCard = {
  background: "#E9E4D8",

  borderRadius: "12px",

  padding: "16px",

  display: "flex",

  flexDirection: "column",

  gap: "8px",
};

const statLabel = {
  fontSize: "12px",

  fontWeight: "700",

  color: "#555",

  textTransform: "uppercase",
};

const statValue = {
  fontSize: "28px",

  fontWeight: "800",

  color: "#111",
};

const InventarioStats = ({
  instrumentos,
}) => {

  const navigate = useNavigate();

  const total =
    instrumentos.length;

  const disponibles =
    instrumentos.filter(
      (i) => i.disponible === true
    ).length;

  const prestados =
    instrumentos.filter(
      (i) => i.disponible === false
    ).length;

  return (

    <aside style={panelStyle}>

      {/* NAVEGACION */}

      <div style={buttonContainer}>

        <button
          style={getButtonStyle(false)}
          onClick={() =>
            navigate("/banda/prestamos")
          }
        >
          Préstamos Banda
        </button>

        <button
          style={getButtonStyle(true)}
        >
          Inventario Banda
        </button>

      </div>

      {/* TITULO */}

      <h3 style={titleStyle}>
        Estadísticas rápidas
      </h3>

      {/* STATS */}

      <div style={statsContainer}>

        <div style={statCard}>

          <span style={statLabel}>
            Total instrumentos
          </span>

          <span style={statValue}>
            {total}
          </span>

        </div>

        <div style={statCard}>

          <span style={statLabel}>
            Disponibles
          </span>

          <span style={statValue}>
            {disponibles}
          </span>

        </div>

        <div style={statCard}>

          <span style={statLabel}>
            Prestados
          </span>

          <span style={statValue}>
            {prestados}
          </span>

        </div>

      </div>

    </aside>
  );
};

export default InventarioStats;