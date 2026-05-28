import { btn } from "../styles/inventarioStyles";

const labelStyle = {
  fontSize: "12px",

  fontWeight: "600",

  color: "#555",

  marginBottom: "6px",

  letterSpacing: "0.3px",
};

const inputStyle = {
  height: "42px",

  border: "1px solid #D6D6D6",

  borderRadius: "10px",

  padding: "0 14px",

  fontSize: "13px",

  outline: "none",

  backgroundColor: "#FFFFFF",

  color: "#333",

  width: "100%",

  boxSizing: "border-box",
};

const fieldContainer = {
  display: "flex",

  flexDirection: "column",

  minWidth: "220px",

  flex: 1,
};

const InventarioFiltros = ({
  filtroNombre,
  setFiltroNombre,

  filtroCategoria,
  setFiltroCategoria,

  categorias,

  handleBuscar,
  handleLimpiar,

  abrirAgregar,
}) => {

  return (

    <div
      style={{
        backgroundColor: "#FFFFFF",

        borderRadius: "18px",

        padding: "24px",

        marginBottom: "24px",

        boxShadow:
          "0 4px 18px rgba(0,0,0,0.08)",

        border:
          "1px solid #ECECEC",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "22px",
        }}
      >

        <div>

          <h2
            style={{
              margin: 0,

              color: "#333",

              fontSize: "22px",

              fontWeight: "700",
            }}
          >
            Inventario Banda
          </h2>

          <p
            style={{
              margin:
                "6px 0 0 0",

              color: "#777",

              fontSize: "13px",
            }}
          >
            Gestión y administración
            de instrumentos musicales
          </p>

        </div>

        <button
          style={{
            ...btn("#8E2A25"),

            height: "42px",

            borderRadius: "10px",

            padding:
              "0 20px",

            fontSize: "13px",
          }}
          onClick={abrirAgregar}
        >
          + Agregar instrumento
        </button>

      </div>

      {/* FILTROS */}

      <div
        style={{
          display: "flex",

          gap: "16px",

          alignItems: "flex-end",
        }}
      >

        {/* NOMBRE */}

        <div style={fieldContainer}>

          <label style={labelStyle}>
            Nombre
          </label>

          <input
            style={inputStyle}
            placeholder="Buscar instrumento..."
            value={filtroNombre}
            onChange={(e) =>
              setFiltroNombre(
                e.target.value
              )
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleBuscar()
            }
          />

        </div>

        {/* CATEGORIA */}

        <div style={fieldContainer}>

          <label style={labelStyle}>
            Categoría
          </label>

          <select
            style={inputStyle}
            value={filtroCategoria}
            onChange={(e) =>
              setFiltroCategoria(
                e.target.value
              )
            }
          >

            <option value="">
              Todas
            </option>

            {categorias.map((c) => (

              <option
                key={c.id_categoria}
                value={c.id_categoria}
              >
                {c.nombre}
              </option>

            ))}

          </select>

        </div>

        {/* BOTONES */}

        <div
          style={{
            display: "flex",

            gap: "10px",

            marginBottom: "1px",
          }}
        >

          <button
            style={{
              ...btn("#2E5FA7"),

              height: "42px",

              borderRadius: "10px",

              padding:
                "0 20px",
            }}
            onClick={handleBuscar}
          >
            Buscar
          </button>

          {(filtroNombre ||
            filtroCategoria) && (

            <button
              style={{
                ...btn("#6B7280"),

                height: "42px",

                borderRadius: "10px",

                padding:
                  "0 18px",
              }}
              onClick={handleLimpiar}
            >
              Limpiar
            </button>

          )}

        </div>

      </div>

    </div>
  );
};

export default InventarioFiltros;