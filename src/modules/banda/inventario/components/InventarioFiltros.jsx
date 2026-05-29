import "./InventarioFiltros.css";

import {
  btn,
  COLORS,
} from "../styles/inventarioStyles";

const fieldContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  minWidth: 0,
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: "var(--color-primary)",
  fontFamily: "var(--font-body)",
};

const inputStyle = {
  height: "46px",

  border:
    "1px solid rgba(214,211,209,0.9)",

  borderRadius: "12px",

  padding: "0 14px",

  fontSize: "13px",

  outline: "none",

  backgroundColor: "#FFFFFF",

  color: "#444",

  width: "100%",

  boxSizing: "border-box",

  fontFamily: "var(--font-body)",
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
        background: "#d8d2c3",

        borderRadius: "20px",

        padding: "22px",

        border:
          "1px solid rgba(0,0,0,0.08)",

        boxShadow:
          "0 8px 24px rgba(0,0,0,0.05)",
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

          gap: "20px",

          flexWrap: "wrap",
        }}
      >

        <div>

          <h2
            style={{
              margin: 0,

              fontSize: "28px",

              fontWeight: "800",

              color:
                "var(--color-primary)",

              fontFamily:
                "var(--font-display)",
            }}
          >
            Sistema de Inventario
          </h2>

          <p
            style={{
              margin:
                "6px 0 0 0",

              color: "#666",

              fontSize: "14px",
            }}
          >
            Gestión institucional de instrumentos musicales
          </p>

        </div>

        <button
          style={{
            ...btn(COLORS.primary),

            height: "46px",

            borderRadius: "12px",

            padding:
              "0 20px",

            fontWeight: "700",
          }}
          onClick={abrirAgregar}
        >
          + Agregar instrumento
        </button>

      </div>

      {/* FILTROS */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "120px 1.5fr 120px 120px 120px auto",

          gap: "14px",

          alignItems: "end",
        }}
      >

        {/* CODIGO */}

        <div style={fieldContainer}>

          <label style={labelStyle}>
            Código
          </label>

          <input
            style={inputStyle}
            placeholder="Código"
          />

        </div>

        {/* NOMBRE */}

        <div style={fieldContainer}>

          <label style={labelStyle}>
            Nombre
          </label>

          <input
            style={inputStyle}
            placeholder="Nombre"
            value={filtroNombre}
            onChange={(e) =>
              setFiltroNombre(
                e.target.value
              )
            }
          />

        </div>

        {/* GRADO */}

        <div style={fieldContainer}>

          <label style={labelStyle}>
            Grado
          </label>

          <select style={inputStyle}>
            <option>Grado</option>
          </select>

        </div>

        {/* GRUPO */}

        <div style={fieldContainer}>

          <label style={labelStyle}>
            Grupo
          </label>

          <select style={inputStyle}>
            <option>Grupo</option>
          </select>

        </div>

        {/* AÑO */}

        <div style={fieldContainer}>

          <label style={labelStyle}>
            Año
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
              Año
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

        {/* BOTON */}

        <button
          style={{
            ...btn(COLORS.primary),

            height: "46px",

            borderRadius: "12px",

            fontWeight: "700",
          }}
          onClick={handleBuscar}
        >
          Buscar
        </button>

      </div>

    </div>

  );
};

export default InventarioFiltros;