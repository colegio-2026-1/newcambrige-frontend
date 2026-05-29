import {
  btn,
} from "../styles/inventarioStyles";

const baseBtn = (
  active = false
) => ({
  minWidth: "42px",
  height: "42px",
  borderRadius: "12px",
  border: active
    ? "1px solid var(--color-primary)"
    : "1px solid rgba(214,211,209,0.9)",
  background: active
    ? "var(--color-primary)"
    : "#FFFFFF",
  color: active
    ? "#FFFFFF"
    : "#444",
  fontWeight: active ? "700" : "600",
  cursor: "pointer",
  transition: "all .2s ease",
  fontSize: "13px",
  boxShadow:
    active
      ? "0 8px 18px rgba(142,42,37,0.18)"
      : "none",
});

const navBtn = (
  disabled = false
) => ({
  ...btn(
    "var(--color-primary)",
    disabled
  ),

  minWidth: "42px",

  height: "42px",

  borderRadius: "12px",

  fontWeight: "700",
});

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
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "28px",
      }}
    >

      <button
        style={navBtn(
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
        style={navBtn(
          paginaActual === 1
        )}
        disabled={
          paginaActual === 1
        }
        onClick={() =>
          setPagina((p) => p - 1)
        }
      >
        ‹
      </button>

      {Array.from(
        {
          length: totalPaginas,
        },
        (_, i) => i + 1
      ).map((p) => (

        <button
          key={p}
          onClick={() =>
            setPagina(p)
          }
          style={baseBtn(
            p === paginaActual
          )}
        >
          {p}
        </button>

      ))}

      <button
        style={navBtn(
          paginaActual ===
            totalPaginas
        )}
        disabled={
          paginaActual ===
          totalPaginas
        }
        onClick={() =>
          setPagina((p) => p + 1)
        }
      >
        ›
      </button>

      <button
        style={navBtn(
          paginaActual ===
            totalPaginas
        )}
        disabled={
          paginaActual ===
          totalPaginas
        }
        onClick={() =>
          setPagina(totalPaginas)
        }
      >
        »
      </button>

    </div>
  );
};

export default InventarioPagination;