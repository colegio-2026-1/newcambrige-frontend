const PrestamosSidebar = ({
  estudiantes,
  instrumentos,
  estadisticas,
}) => {

  return (

    <aside
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >

      <div
        style={{
          background: "#FFFFFF",
          padding: "24px",
          borderRadius: "18px",
          border: "1px solid #E5E7EB",
        }}
      >

        <h3>
          Resumen
        </h3>

        <p>
          Estudiantes:
          {" "}
          {estudiantes.length}
        </p>

        <p>
          Instrumentos disponibles:
          {" "}
          {instrumentos.length}
        </p>

        <p>
          Préstamos activos:
          {" "}
          {estadisticas.activos}
        </p>

      </div>

    </aside>
  );
};

export default PrestamosSidebar;