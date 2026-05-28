import {
  ESTADOS_INSTRUMENTO,
} from "../utils/inventarioConstants";

import {
  inputStyle,
  readonlyInput,
  errorMsg,
} from "../styles/inventarioStyles";

const InventarioForm = ({
  esEdicion,

  form,
  setForm,

  errores,

  categorias,
  ubicaciones,
}) => {

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
      }}
    >

      {/* CODIGO */}

      <div>

        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Código del instrumento
        </label>

        {esEdicion ? (

          <input
            style={readonlyInput}
            value={form.codigo}
            readOnly
          />

        ) : (

          <>

            <input
              style={inputStyle(
                !!errores.codigo
              )}
              value={form.codigo}
              placeholder="Ej: 1, 25, 100"
              onChange={(e) =>
                setForm({
                  ...form,
                  codigo:
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6),
                })
              }
            />

            {errores.codigo && (

              <p style={errorMsg}>
                {errores.codigo}
              </p>

            )}

          </>

        )}

      </div>

      {/* NOMBRE */}

      <div>

        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Nombre del instrumento
        </label>

        <input
          style={inputStyle(
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

      <div>

        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Tipo / Categoría
        </label>

        <select
          style={inputStyle(
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

      {/* CANTIDAD */}

      <div>

        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Cantidad total
        </label>

        <input
          type="number"
          min="1"
          style={inputStyle(
            !!errores.cantidad_total
          )}
          value={form.cantidad_total}
          placeholder="Ej: 5"
          onChange={(e) =>
            setForm({
              ...form,
              cantidad_total:
                e.target.value,
            })
          }
        />

        {errores.cantidad_total && (

          <p style={errorMsg}>
            {errores.cantidad_total}
          </p>

        )}

      </div>

      {/* UBICACION */}

      <div>

        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Ubicación
        </label>

        <select
          style={inputStyle()}
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

      {/* ESTADO */}

      <div>

        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            display: "block",
            marginBottom: "4px",
          }}
        >
          Estado
        </label>

        <select
          style={inputStyle()}
          value={form.estado}
          onChange={(e) =>
            setForm({
              ...form,
              estado: e.target.value,
            })
          }
        >

          {ESTADOS_INSTRUMENTO.map((e) => (

            <option
              key={e}
              value={e}
            >
              {e}
            </option>

          ))}

        </select>

      </div>

    </div>
  );
};

export default InventarioForm;