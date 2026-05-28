const cardStyle = (borderColor) => ({
  flex: 1,

  minWidth: "220px",

  backgroundColor: "#FFFFFF",

  borderRadius: "16px",

  padding: "22px",

  borderTop: `5px solid ${borderColor}`,

  boxShadow:
    "0 4px 18px rgba(0,0,0,0.08)",

  display: "flex",

  flexDirection: "column",

  gap: "10px",

  transition: "0.2s",
});

const titleStyle = {
  fontSize: "13px",

  fontWeight: "600",

  color: "#666",

  letterSpacing: "0.5px",

  textTransform: "uppercase",
};

const valueStyle = {
  fontSize: "34px",

  fontWeight: "700",

  color: "#333",
};

const barContainer = {
  width: "100%",

  height: "8px",

  borderRadius: "20px",

  backgroundColor: "#ECECEC",

  overflow: "hidden",
};

const InventarioStats = ({
  instrumentos,
}) => {

  const total =
    instrumentos.length;

  const disponibles =
    instrumentos.reduce(
      (acc, i) =>
        acc +
        Number(
          i.disponible ??
          i.cantidad_disponible ??
          0
        ),
      0
    );

  const asignados =
    instrumentos.reduce(
      (acc, i) => {

        const total =
          Number(
            i.total ??
            i.cantidad_total ??
            0
          );

        const disponibles =
          Number(
            i.disponible ??
            i.cantidad_disponible ??
            0
          );

        return (
          acc +
          (total - disponibles)
        );
      },
      0
    );

  const mantenimiento =
    instrumentos.filter(
      (i) =>
        i.estado ===
        "En mantenimiento"
    ).length;

  const disponiblesPercent =
    total > 0
      ? (disponibles / total) * 100
      : 0;

  const asignadosPercent =
    total > 0
      ? (asignados / total) * 100
      : 0;

  const mantenimientoPercent =
    total > 0
      ? (mantenimiento / total) * 100
      : 0;

  return (

    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(4, 1fr)",

        gap: "18px",

        marginBottom: "26px",
      }}
    >

      {/* TOTAL */}

      <div
        style={cardStyle("#8E2A25")}
      >

        <div style={titleStyle}>
          Total instrumentos
        </div>

        <div style={valueStyle}>
          {total}
        </div>

        <div style={barContainer}>

          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#8E2A25",
            }}
          />

        </div>

      </div>

      {/* DISPONIBLES */}

      <div
        style={cardStyle("#15803D")}
      >

        <div style={titleStyle}>
          Disponibles
        </div>

        <div style={valueStyle}>
          {disponibles}
        </div>

        <div style={barContainer}>

          <div
            style={{
              width:
                `${disponiblesPercent}%`,
              height: "100%",
              backgroundColor: "#15803D",
            }}
          />

        </div>

      </div>

      {/* ASIGNADOS */}

      <div
        style={cardStyle("#2E5FA7")}
      >

        <div style={titleStyle}>
          Asignados
        </div>

        <div style={valueStyle}>
          {asignados}
        </div>

        <div style={barContainer}>

          <div
            style={{
              width:
                `${asignadosPercent}%`,
              height: "100%",
              backgroundColor: "#2E5FA7",
            }}
          />

        </div>

      </div>

      {/* MANTENIMIENTO */}

      <div
        style={cardStyle("#CA8A04")}
      >

        <div style={titleStyle}>
          Mantenimiento
        </div>

        <div style={valueStyle}>
          {mantenimiento}
        </div>

        <div style={barContainer}>

          <div
            style={{
              width:
                `${mantenimientoPercent}%`,
              height: "100%",
              backgroundColor: "#CA8A04",
            }}
          />

        </div>

      </div>

    </div>
  );
};

export default InventarioStats;