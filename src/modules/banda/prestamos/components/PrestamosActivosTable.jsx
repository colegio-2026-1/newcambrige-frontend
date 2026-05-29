const PrestamosActivosTable = ({
  prestamos,
  devolverInstrumento,
}) => {

  return (

    <div
      style={{
        background: "#FFFFFF",
        borderRadius: "18px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
      }}
    >

      <div
        style={{
          padding: "24px",
          borderBottom:
            "1px solid #E5E7EB",
        }}
      >

        <h3
          style={{
            margin: 0,
          }}
        >
          Préstamos activos
        </h3>

      </div>

      <table
        style={{
          width: "100%",
          borderCollapse:
            "collapse",
        }}
      >

        <thead>

          <tr
            style={{
              background:
                "#F9FAFB",
            }}
          >

            <th style={th}>
              Instrumento
            </th>

            <th style={th}>
              Estudiante
            </th>

            <th style={th}>
              Fecha
            </th>

            <th style={th}>
              Estado
            </th>

            <th style={th}>
              Acción
            </th>

          </tr>

        </thead>

        <tbody>

          {
            prestamos.map((p) => (

              <tr
                key={p.id_prestamo}
              >

                <td style={td}>
                  {p.instrumento_nombre}
                </td>

                <td style={td}>
                  {p.estudiante_nombre}
                </td>

                <td style={td}>
                  {p.fecha_prestamo}
                </td>

                <td style={td}>

                  <span
                    style={{
                      background:
                        p.estado_entrega ===
                        "prestado"
                          ? "#DCFCE7"
                          : "#E5E7EB",

                      color: "#111827",

                      padding: "6px 10px",

                      borderRadius:
                        "999px",

                      fontSize: "12px",

                      fontWeight: "700",
                    }}
                  >
                    {p.estado_entrega}
                  </span>

                </td>

                <td style={td}>

                  {
                    p.estado_entrega ===
                      "prestado" && (

                      <button
                        style={btn("#166534")}
                        onClick={() =>
                          devolverInstrumento(
                            p.id_prestamo
                          )
                        }
                      >
                        Devolver
                      </button>
                    )
                  }

                </td>

              </tr>
            ))
          }

        </tbody>

      </table>

    </div>
  );
};

const th = {

  textAlign: "left",

  padding: "16px",

  fontSize: "13px",

  borderBottom:
    "1px solid #E5E7EB",
};

const td = {

  padding: "16px",

  borderBottom:
    "1px solid #F3F4F6",
};

const btn = (bg) => ({

  background: bg,

  color: "#FFFFFF",

  border: "none",

  borderRadius: "8px",

  padding: "10px 14px",

  cursor: "pointer",

  fontWeight: "700",
});

export default PrestamosActivosTable;