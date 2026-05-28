import EstadoBadge from "./EstadoBadge";

const actionBtn = (bg) => ({
  border: "none",

  backgroundColor: bg,

  color: "#fff",

  padding: "7px 14px",

  borderRadius: "8px",

  fontSize: "12px",

  fontWeight: "600",

  cursor: "pointer",

  transition: "0.2s",
});

const thStyle = {
  padding: "16px 14px",

  textAlign: "left",

  fontSize: "12px",

  fontWeight: "700",

  color: "#666",

  letterSpacing: "0.5px",

  textTransform: "uppercase",

  borderBottom:
    "1px solid #E5E7EB",

  backgroundColor: "#F8F8F8",

  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "16px 14px",

  fontSize: "13px",

  color: "#333",

  borderBottom:
    "1px solid #F1F1F1",

  verticalAlign: "middle",
};

const InventarioTable = ({
  paginados,
  abrirEditar,
  abrirEliminar,
}) => {

  return (

    <div
      style={{
        backgroundColor: "#FFFFFF",

        borderRadius: "18px",

        overflow: "hidden",

        boxShadow:
          "0 4px 18px rgba(0,0,0,0.08)",

        border:
          "1px solid #ECECEC",
      }}
    >

      <table
        style={{
          width: "100%",

          borderCollapse:
            "collapse",

          fontFamily:
            "sans-serif",
        }}
      >

        <thead>

          <tr>

            {[
              "Código",
              "Nombre",
              "Tipo / Categoría",
              "Total",
              "Disponible",
              "Asignados",
              "Estado",
              "Acciones",
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
                colSpan={8}
                style={{
                  padding:
                    "50px 20px",

                  textAlign:
                    "center",

                  color: "#999",

                  fontSize: "14px",
                }}
              >
                No se encontraron
                instrumentos.
              </td>

            </tr>

          ) : (

            paginados.map(
              (inst, idx) => {

                const disponible =
                  inst.disponible ??
                  inst.cantidad_disponible ??
                  0;

                const total =
                  inst.total ??
                  inst.cantidad_total ??
                  0;

                const asignados =
                  inst.asignados ??
                  (total -
                    disponible) ??
                  0;

                return (

                  <tr
                    key={
                      inst.id_instrumento
                    }
                    style={{
                      backgroundColor:
                        idx % 2 === 0
                          ? "#FFFFFF"
                          : "#FAFAFA",

                      transition:
                        "0.2s",
                    }}
                  >

                    {/* CODIGO */}

                    <td style={tdStyle}>

                      <span
                        style={{
                          fontWeight:
                            "700",

                          color:
                            "#8E2A25",
                        }}
                      >
                        #
                        {inst.codigo ??
                          inst.id_instrumento}
                      </span>

                    </td>

                    {/* NOMBRE */}

                    <td style={tdStyle}>

                      <div
                        style={{
                          fontWeight:
                            "600",

                          color:
                            "#333",
                        }}
                      >
                        {inst.nombre}
                      </div>

                    </td>

                    {/* CATEGORIA */}

                    <td style={tdStyle}>
                      {inst.categoria_nombre ??
                        "—"}
                    </td>

                    {/* TOTAL */}

                    <td
                      style={{
                        ...tdStyle,

                        textAlign:
                          "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight:
                            "700",
                        }}
                      >
                        {total}
                      </span>
                    </td>

                    {/* DISPONIBLES */}

                    <td
                      style={{
                        ...tdStyle,

                        textAlign:
                          "center",
                      }}
                    >

                      <span
                        style={{
                          fontWeight:
                            "700",

                          color:
                            disponible >
                            0
                              ? "#15803D"
                              : "#DC2626",
                        }}
                      >
                        {disponible}
                      </span>

                      {disponible ===
                        0 && (

                        <div
                          style={{
                            marginTop:
                              "4px",

                            fontSize:
                              "10px",

                            color:
                              "#DC2626",

                            fontWeight:
                              "600",
                          }}
                        >
                          Sin stock
                        </div>

                      )}

                    </td>

                    {/* ASIGNADOS */}

                    <td
                      style={{
                        ...tdStyle,

                        textAlign:
                          "center",
                      }}
                    >

                      <span
                        style={{
                          fontWeight:
                            "700",

                          color:
                            "#2E5FA7",
                        }}
                      >
                        {asignados}
                      </span>

                    </td>

                    {/* ESTADO */}

                    <td style={tdStyle}>

                      <EstadoBadge
                        estado={
                          inst.estado
                        }
                      />

                    </td>

                    {/* ACCIONES */}

                    <td style={tdStyle}>

                      <div
                        style={{
                          display:
                            "flex",

                          gap: "8px",
                        }}
                      >

                        <button
                          style={actionBtn(
                            "#2E5FA7"
                          )}
                          onClick={() =>
                            abrirEditar(
                              inst
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          style={actionBtn(
                            "#8E2A25"
                          )}
                          onClick={() =>
                            abrirEliminar(
                              inst
                            )
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </td>

                  </tr>

                );
              }
            )

          )}

        </tbody>

      </table>

    </div>
  );
};

export default InventarioTable;