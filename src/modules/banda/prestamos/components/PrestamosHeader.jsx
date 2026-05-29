const PrestamosHeader = ({
  filtroNombre,
  setFiltroNombre,
}) => {

  return (

    <div
      style={{
        background: "#FFFFFF",
        padding: "24px",
        borderRadius: "18px",
        border: "1px solid #E5E7EB",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >

        <h2
          style={{
            margin: 0,
          }}
        >
          Estudiantes Banda
        </h2>

      </div>

      <input
        type="text"
        placeholder="Buscar estudiante..."
        value={filtroNombre}
        onChange={(e) =>
          setFiltroNombre(
            e.target.value
          )
        }
        style={{
          width: "100%",
          height: "44px",
          borderRadius: "10px",
          border: "1px solid #D1D5DB",
          padding: "0 14px",
          boxSizing: "border-box",
        }}
      />

    </div>
  );
};

export default PrestamosHeader;