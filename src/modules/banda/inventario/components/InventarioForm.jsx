import { inputStyle, errorMsg } from "../styles/inventarioStyles";

const fieldWrapper = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle = { fontSize: "11px", fontWeight: "800", color: "var(--color-primary)", fontFamily: "var(--font-body)", textTransform: "uppercase" };
const formGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" };

const customInput = (hasError) => ({
  ...inputStyle(hasError),
  height: "45px",
  borderRadius: "10px",
  fontSize: "14px",
});

const InventarioForm = ({ form, setForm, errores, categorias, ubicaciones }) => {
  return (
    <div style={formGrid}>
      {/* CÓDIGO (NUEVO - BR330) */}
      <div style={fieldWrapper}>
        <label style={labelStyle}>Código Institucional</label>
        <input
          type="number"
          style={customInput(!!errores.codigo)}
          value={form.codigo}
          placeholder="Ej: 1025"
          onChange={(e) => setForm({ ...form, codigo: e.target.value })}
        />
        {errores.codigo && <p style={errorMsg}>{errores.codigo}</p>}
      </div>

      {/* NOMBRE */}
      <div style={fieldWrapper}>
        <label style={labelStyle}>Nombre del instrumento</label>
        <input
          style={customInput(!!errores.nombre)}
          value={form.nombre}
          placeholder="Ej: Trompeta"
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        {errores.nombre && <p style={errorMsg}>{errores.nombre}</p>}
      </div>

      {/* CATEGORIA */}
      <div style={fieldWrapper}>
        <label style={labelStyle}>Categoría</label>
        <select
          style={customInput(!!errores.id_categoria)}
          value={form.id_categoria}
          onChange={(e) => setForm({ ...form, id_categoria: e.target.value })}
        >
          <option value="">Seleccionar...</option>
          {categorias.map((c) => (
            <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
          ))}
        </select>
        {errores.id_categoria && <p style={errorMsg}>{errores.id_categoria}</p>}
      </div>

      {/* CANTIDAD TOTAL (NUEVO - BR333) */}
      <div style={fieldWrapper}>
        <label style={labelStyle}>Cantidad Total</label>
        <input
          type="number"
          style={customInput(!!errores.cantidad_total)}
          value={form.cantidad_total}
          min="1"
          onChange={(e) => setForm({ ...form, cantidad_total: e.target.value })}
        />
        {errores.cantidad_total && <p style={errorMsg}>{errores.cantidad_total}</p>}
      </div>

      {/* UBICACION */}
      <div style={fieldWrapper}>
        <label style={labelStyle}>Ubicación</label>
        <select
          style={customInput()}
          value={form.id_ubicacion}
          onChange={(e) => setForm({ ...form, id_ubicacion: e.target.value })}
        >
          <option value="">Seleccionar...</option>
          {ubicaciones.map((u) => (
            <option key={u.id_ubicacion} value={u.id_ubicacion}>{u.nombre}</option>
          ))}
        </select>
      </div>

      {/* ESTADO (NUEVO - BR336) */}
      <div style={fieldWrapper}>
        <label style={labelStyle}>Estado Inicial</label>
        <select
          style={customInput()}
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          <option value="En mantenimiento">En mantenimiento</option>
        </select>
      </div>
    </div>
  );
};

export default InventarioForm;