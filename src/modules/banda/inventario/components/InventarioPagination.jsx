import React from 'react';

const navBtn = (disabled = false) => ({
  width: "38px",
  height: "38px",
  borderRadius: "50%", /* Círculo perfecto como en la imagen */
  border: "none",
  background: disabled ? "#9CA3AF" : "#335C8E", /* Azul oscuro institucional */
  color: "#FFFFFF",
  fontWeight: "bold",
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "18px",
  boxShadow: disabled ? "none" : "0 4px 6px rgba(0,0,0,0.15)",
  transition: "all 0.2s ease"
});

const InventarioPagination = ({ paginaActual, totalPaginas, setPagina }) => {
  if (totalPaginas <= 1) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "20px" }}>
      
      {/* Botón Atrás */}
      <button 
        style={navBtn(paginaActual === 1)} 
        disabled={paginaActual === 1} 
        onClick={() => setPagina((p) => p - 1)}
        title="Página anterior"
      >
        &#10094; {/* Símbolo de flecha izquierda */}
      </button>

      {/* Botón Adelante */}
      <button 
        style={navBtn(paginaActual === totalPaginas)} 
        disabled={paginaActual === totalPaginas} 
        onClick={() => setPagina((p) => p + 1)}
        title="Página siguiente"
      >
        &#10095; {/* Símbolo de flecha derecha */}
      </button>

    </div>
  );
};

export default InventarioPagination;