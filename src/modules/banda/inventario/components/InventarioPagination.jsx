import {
  btn,
} from "../styles/inventarioStyles";

const InventarioPagination = ({
  paginaActual,
  totalPaginas,
  setPagina,
}) => {

  if (totalPaginas <= 1)
    return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        gap: "8px",
        marginTop: "20px",
      }}
    >

      <button
        style={btn(
          "#8E2A25",
          paginaActual === 1
        )}
        disabled={
          paginaActual === 1
        }
        onClick={() =>
          setPagina(1)
        }
      >
        «
      </button>

      <button
        style={btn(
          "#8E2A25",
          paginaActual === 1
        )}
        disabled={
          paginaActual === 1
        }
        onClick={() =>
          setPagina(
            (p) => p - 1
          )
        }
      >
        ‹
      </button>

      {Array.from(
        {
          length:
            totalPaginas,
        },
        (_, i) => i + 1
      ).map((p) => (
        <button
          key={p}
          onClick={() =>
            setPagina(p)
          }
          style={{
            padding:
              "6px 12px",
            borderRadius: "4px",
            fontSize: "13px",
            border:
              p === paginaActual
                ? "2px solid #8E2A25"
                : "1px solid #ccc",
            backgroundColor:
              p === paginaActual
                ? "#8E2A25"
                : "#fff",
            color:
              p === paginaActual
                ? "#fff"
                : "#333",
            cursor: "pointer",
            fontWeight:
              p === paginaActual
                ? "700"
                : "400",
          }}
        >
          {p}
        </button>
      ))}

      <button
        style={btn(
          "#8E2A25",
          paginaActual ===
            totalPaginas
        )}
        disabled={
          paginaActual ===
          totalPaginas
        }
        onClick={() =>
          setPagina(
            (p) => p + 1
          )
        }
      >
        ›
      </button>

      <button
        style={btn(
          "#8E2A25",
          paginaActual ===
            totalPaginas
        )}
        disabled={
          paginaActual ===
          totalPaginas
        }
        onClick={() =>
          setPagina(
            totalPaginas
          )
        }
      >
        »
      </button>
    </div>
  );
};

export default InventarioPagination;