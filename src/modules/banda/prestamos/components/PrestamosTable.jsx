const PrestamosTable = ({
  estudiantes,
  setForm,
  form,
  setModalAgregar,
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

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >

        <thead>

          <tr
            style={{
              background: "#F3F4F6",
            }}
          >

            <th style={th}>
              Estudiante
            </th>

            <th style={th}>
              Documento
            </th>

            <th style={th}>
              Acciones
            </th>

          </tr>

        </thead>

        <tbody>

          {
            estudiantes.map((estudiante) => (

              <tr
                key={
                  estudiante.id_estudiante
                }
              >

                <td style={td}>
                  {estudiante.nombre}
                </td>

                <td style={td}>
                  {estudiante.documento}
                </td>

                <td style={td}>

                  <button
                    style={btn("#1B3A5C")}
                    onClick={() => {

                      setForm({

                        ...form,

                        id_estudiante:
                          estudiante.id_estudiante,
                      });

                      setModalAgregar(true);
                    }}
                  >
                    Asignar Instrumento
                  </button>

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

export default PrestamosTable;