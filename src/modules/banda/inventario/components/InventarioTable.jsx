import EstadoBadge from "./EstadoBadge";

const tableContainer = {
  width: "100%",

  overflowX: "auto",

  background: "#F8F7F3",

  border: "1px solid #D8D2C4",

  borderRadius: "14px",

  overflow: "hidden",
};

const tableStyle = {
  width: "100%",

  borderCollapse: "collapse",

  minWidth: "900px",

  fontFamily: "var(--font-body)",
};

const thStyle = {
  background: "#D9D1BD",

  color: "#1E1E1E",

  fontSize: "13px",

  fontWeight: "700",

  padding: "16px 14px",

  textAlign: "left",

  borderBottom: "1px solid #CFC6B2",

  whiteSpace: "nowrap",

  textTransform: "uppercase",

  letterSpacing: "0.4px",
};

const tdStyle = {
  padding: "14px",

  fontSize: "13px",

  color: "#333",

  borderBottom: "1px solid #E5DED0",

  verticalAlign: "middle",
};

const actionBtn = (bg) => ({
  border: "none",

  background: bg,

  color: "#FFFFFF",

  padding: "8px 14px",

  borderRadius: "8px",

  fontSize: "12px",

  fontWeight: "700",

  cursor: "pointer",

  transition: "0.2s ease",

  fontFamily: "var(--font-body)",
});

const InventarioTable = ({
  paginados,
  abrirEditar,
  abrirEliminar,
}) => {

  return (

    <div style={tableContainer}>

      <table style={tableStyle}>

        <thead>

          <tr>

            {[
              "ID",
              "NOMBRE",
              "CATEGORÍA",
              "UBICACIÓN",
              "DISPONIBILIDAD",
              "ACCIONES",
            ].map((h) => (

              <th
                key={h}
                style={thStyle}
              >
                {h}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {paginados.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                style={{
                  ...tdStyle,

                  textAlign: "center",

                  padding: "40px",

                  color: "#777",
                }}
              >
                No se encontraron instrumentos.
              </td>

            </tr>

          ) : (

            paginados.map(
              (inst, idx) => (

                <tr
                  key={inst.id_instrumento}
                  style={{
                    background:
                      idx % 2 === 0
                        ? "#F8F7F3"
                        : "#F3F0E8",
                  }}
                >

                  {/* ID */}

                  <td style={tdStyle}>

                    <strong>
                      #{inst.id_instrumento}
                    </strong>

                  </td>

                  {/* NOMBRE */}

                  <td style={tdStyle}>
                    {inst.nombre}
                  </td>

                  {/* CATEGORIA */}

                  <td style={tdStyle}>
                    {inst.categoria_nombre ?? "—"}
                  </td>

                  {/* UBICACION */}

                  <td style={tdStyle}>
                    {inst.ubicacion_nombre ?? "—"}
                  </td>

                  {/* DISPONIBILIDAD */}

                  <td style={tdStyle}>

                    <EstadoBadge
                      disponible={inst.disponible}
                    />

                  </td>

                  {/* ACCIONES */}

                  <td style={tdStyle}>

                    <div
                      style={{
                        display: "flex",

                        gap: "8px",

                        flexWrap: "wrap",
                      }}
                    >

                      <button
                        style={actionBtn("#2E5FA7")}
                        onClick={() =>
                          abrirEditar(inst)
                        }
                      >
                        Editar
                      </button>

                      <button
                        style={actionBtn("#8E2A25")}
                        onClick={() =>
                          abrirEliminar(inst)
                        }
                      >
                        Eliminar
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )

          )}

        </tbody>

      </table>

    </div>
  );
};

export default InventarioTable;