import EstadoBadge from "./EstadoBadge";

const tableContainer = { width: "100%", overflowX: "auto", background: "#F8F7F3", border: "1px solid #D8D2C4", borderRadius: "14px" };
const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: "900px" };
const thStyle = { background: "#D9D1BD", color: "#1E1E1E", fontSize: "12px", fontWeight: "700", padding: "16px", textAlign: "left", textTransform: "uppercase" };
const tdStyle = { padding: "14px", fontSize: "13px", color: "#333", borderBottom: "1px solid #E5DED0" };
const actionBtn = (bg) => ({ border: "none", background: bg, color: "#FFF", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" });

const InventarioTable = ({ paginados, abrirEditar, abrirEliminar }) => {
  return (
    <div style={tableContainer}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {["CÓDIGO", "NOMBRE", "CATEGORÍA", "STOCK (T/D)", "ESTADO", "ACCIONES"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginados.length === 0 ? (
            <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", padding: "40px" }}>No hay instrumentos.</td></tr>
          ) : (
            paginados.map((inst, idx) => (
              <tr key={inst.id_instrumento} style={{ background: idx % 2 === 0 ? "#F8F7F3" : "#F3F0E8" }}>
                <td style={tdStyle}><strong>{inst.codigo}</strong></td>
                <td style={tdStyle}>{inst.nombre}</td>
                <td style={tdStyle}>{inst.categoria_nombre ?? "—"}</td>
                {/* STOCK: Muestra Total / Disponible */}
                <td style={tdStyle}>
                  {inst.cantidad_total} / <span style={{ color: inst.cantidad_disponible > 0 ? "#15803D" : "#B91C1C", fontWeight: "bold" }}>
                    {inst.cantidad_disponible}
                  </span>
                </td>
                <td style={tdStyle}>
                  <EstadoBadge estado={inst.estado} disponible={inst.cantidad_disponible > 0} />
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={actionBtn("#2E5FA7")} onClick={() => abrirEditar(inst)}>Editar</button>
                    <button style={actionBtn("#8E2A25")} onClick={() => abrirEliminar(inst)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioTable;