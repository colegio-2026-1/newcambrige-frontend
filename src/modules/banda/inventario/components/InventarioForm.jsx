import {
  inputStyle,
  errorMsg,
} from "../styles/inventarioStyles";

const fieldWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "11px",
  fontWeight: "800",
  letterSpacing: "0.7px",
  textTransform: "uppercase",
  color: "var(--color-primary)",
  fontFamily: "var(--font-body)",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "22px",
};

const customInput = (hasError) => ({
  ...inputStyle(hasError),

  height: "50px",

  borderRadius: "14px",

  border: hasError
    ? "1px solid #DC2626"
    : "1px solid rgba(214,211,209,0.9)",

  background: "#FFFFFF",

  boxShadow:
    "inset 0 1px 2px rgba(0,0,0,0.03)",

  fontSize: "14px",

  transition: "all .2s ease",
});

const InventarioForm = ({
  form,
  setForm,
  errores,
  categorias,
  ubicaciones,
}) => {

  return (

    <div style={formGrid}>

      {/* NOMBRE */}

      <div style={fieldWrapper}>

        <label style={labelStyle}>
          Nombre del instrumento
        </label>

        <input
          style={customInput(
            !!errores.nombre
          )}
          value={form.nombre}
          placeholder="Ej: Trompeta"
          onChange={(e) =>
            setForm({
              ...form,
              nombre: e.target.value,
            })
          }
        />

        {errores.nombre && (
          <p style={errorMsg}>
            {errores.nombre}
          </p>
        )}

      </div>

      {/* CATEGORIA */}

      <div style={fieldWrapper}>

        <label style={labelStyle}>
          Categoría
        </label>

        <select
          style={customInput(
            !!errores.id_categoria
          )}
          value={form.id_categoria}
          onChange={(e) =>
            setForm({
              ...form,
              id_categoria:
                e.target.value,
            })
          }
        >

          <option value="">
            Seleccionar...
          </option>

          {categorias.map((c) => (

            <option
              key={c.id_categoria}
              value={c.id_categoria}
            >
              {c.nombre}
            </option>

          ))}

        </select>

        {errores.id_categoria && (
          <p style={errorMsg}>
            {errores.id_categoria}
          </p>
        )}

      </div>

      {/* UBICACION */}

      <div style={fieldWrapper}>

        <label style={labelStyle}>
          Ubicación
        </label>

        <select
          style={customInput()}
          value={form.id_ubicacion}
          onChange={(e) =>
            setForm({
              ...form,
              id_ubicacion:
                e.target.value,
            })
          }
        >

          <option value="">
            Seleccionar...
          </option>

          {ubicaciones.map((u) => (

            <option
              key={u.id_ubicacion}
              value={u.id_ubicacion}
            >
              {u.nombre}
            </option>

          ))}

        </select>

      </div>

      {/* DISPONIBILIDAD */}

      <div style={fieldWrapper}>

        <label style={labelStyle}>
          Disponibilidad
        </label>

        <select
          style={customInput()}
          value={String(form.disponible)}
          onChange={(e) =>
            setForm({
              ...form,
              disponible:
                e.target.value === "true",
            })
          }
        >

          <option value="true">
            Disponible
          </option>

          <option value="false">
            Prestado
          </option>

        </select>

      </div>

    </div>

  );
};

export default InventarioForm;