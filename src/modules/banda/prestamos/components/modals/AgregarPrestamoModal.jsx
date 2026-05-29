const AgregarPrestamoModal = ({
  open,
  onClose,
  form,
  setForm,
  instrumentos,
  handleAgregar,
}) => {

  if (!open) return null;

  return (

    <div style={overlay}>

      <div style={modal}>

        <h2>
          Registrar préstamo
        </h2>

        {/* Instrumento */}

        <div style={field}>

          <label>
            Instrumento
          </label>

          <select
            value={
              form.id_instrumento
            }
            onChange={(e) =>
              setForm({
                ...form,
                id_instrumento:
                  e.target.value,
              })
            }
            style={input}
          >

            <option value="">
              Seleccione
            </option>

            {
              instrumentos.map(
                (instrumento) => (

                  <option
                    key={
                      instrumento.id_instrumento
                    }
                    value={
                      instrumento.id_instrumento
                    }
                  >
                    {
                      instrumento.nombre
                    }
                  </option>
                )
              )
            }

          </select>

        </div>

        {/* Fecha */}

        <div style={field}>

          <label>
            Fecha préstamo
          </label>

          <input
            type="date"
            value={
              form.fecha_prestamo
            }
            onChange={(e) =>
              setForm({
                ...form,
                fecha_prestamo:
                  e.target.value,
              })
            }
            style={input}
          />

        </div>

        {/* Observacion */}

        <div style={field}>

          <label>
            Observación
          </label>

          <textarea
            value={
              form.observacion
            }
            onChange={(e) =>
              setForm({
                ...form,
                observacion:
                  e.target.value,
              })
            }
            style={{
              ...input,
              height: "90px",
              paddingTop: "12px",
            }}
          />

        </div>

        {/* Buttons */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: "12px",
            marginTop: "24px",
          }}
        >

          <button
            style={cancelBtn}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            style={saveBtn}
            onClick={handleAgregar}
          >
            Guardar
          </button>

        </div>

      </div>

    </div>

  );
};

// =====================================================
// STYLES
// =====================================================

const overlay = {

  position: "fixed",

  inset: 0,

  background:
    "rgba(0,0,0,0.45)",

  display: "flex",

  justifyContent:
    "center",

  alignItems: "center",

  zIndex: 999,
};

const modal = {

  width: "520px",

  background: "#FFFFFF",

  borderRadius: "18px",

  padding: "28px",
};

const field = {

  display: "flex",

  flexDirection: "column",

  gap: "8px",

  marginTop: "18px",
};

const input = {

  width: "100%",

  height: "46px",

  borderRadius: "10px",

  border:
    "1px solid #D1D5DB",

  padding: "0 14px",

  boxSizing: "border-box",
};

const cancelBtn = {

  height: "44px",

  padding: "0 18px",

  border: "none",

  borderRadius: "10px",

  cursor: "pointer",
};

const saveBtn = {

  height: "44px",

  padding: "0 18px",

  border: "none",

  borderRadius: "10px",

  cursor: "pointer",

  background: "#1B3A5C",

  color: "#FFFFFF",

  fontWeight: "700",
};

export default AgregarPrestamoModal;