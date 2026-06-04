import React from 'react';

const baseBtn = (active = false) => ({
  minWidth: "36px",
  height: "36px",
  borderRadius: "8px",
  border: active ? "1px solid var(--color-primary)" : "1px solid #D1D5DB",
  background: active ? "var(--color-primary)" : "#FFFFFF",
  color: active ? "#FFFFFF" : "#4B5563",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontSize: "13px",
});

const navBtn = (disabled = false) => ({
  minWidth: "36px",
  height: "36px",
  borderRadius: "8px",
  border: "1px solid #D1D5DB",
  background: disabled ? "#F3F4F6" : "#FFFFFF",
  color: disabled ? "#9CA3AF" : "#4B5563",
  fontWeight: "bold",
  cursor: disabled ? "not-allowed" : "pointer",
});

const InventarioPagination = ({ paginaActual, totalPaginas, setPagina }) => {
  if (totalPaginas <= 1) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
      <button style={navBtn(paginaActual === 1)} disabled={paginaActual === 1} onClick={() => setPagina(1)}>
        «
      </button>
      <button style={navBtn(paginaActual === 1)} disabled={paginaActual === 1} onClick={() => setPagina((p) => p - 1)}>
        ‹
      </button>

      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => setPagina(p)} style={baseBtn(p === paginaActual)}>
          {p}
        </button>
      ))}

      <button style={navBtn(paginaActual === totalPaginas)} disabled={paginaActual === totalPaginas} onClick={() => setPagina((p) => p + 1)}>
        ›
      </button>
      <button style={navBtn(paginaActual === totalPaginas)} disabled={paginaActual === totalPaginas} onClick={() => setPagina(totalPaginas)}>
        »
      </button>
    </div>
  );
};

export default InventarioPagination;