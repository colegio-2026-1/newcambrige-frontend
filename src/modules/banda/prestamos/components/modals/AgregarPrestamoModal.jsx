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
        <h2 style={{ marginBottom: "10px", color: "#1B3A5C" }}>
          Registrar préstamo
        </h2>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
          La fecha de asignación se registrará automáticamente con el día de hoy.
        </p>

        {/* Instrumento - Conexión con Código y Stock */}
        <div style={field}>
          <label style={labelStyle}>Instrumento (Código — Nombre — Stock)</label>
          <select
            value={form.id_instrumento}
            onChange={(e) =>
              setForm({
                ...form,
                id_instrumento: e.target.value,
              })
            }
            style={input}
          >
            <option value="">Seleccione un instrumento...</option>
            {instrumentos.map((inst) => (
              <option
                key={inst.id_instrumento}
                value={inst.id_instrumento}
                disabled={inst.cantidad_disponible <= 0}
              >
                {`[${inst.codigo}] — ${inst.nombre} — Disponibles: ${inst.cantidad_disponible}`}
              </option>
            ))}
          </select>
        </div>

        {/* Observacion */}
        <div style={field}>
          <label style={labelStyle}>Observación / Notas de entrega</label>
          <textarea
            value={form.observacion}
            placeholder="Ej: Se entrega con estuche y boquilla limpia..."
            onChange={(e) =>
              setForm({
                ...form,
                observacion: e.target.value,
              })
            }
            style={{
              ...input,
              height: "100px",
              paddingTop: "12px",
              resize: "none"
            }}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "30px",
          }}
        >
          <button style={cancelBtn} onClick={onClose}>
            Cancelar
          </button>

          <button 
            style={{
              ...saveBtn,
              opacity: !form.id_instrumento ? 0.6 : 1,
              cursor: !form.id_instrumento ? "not-allowed" : "pointer"
            }} 
            onClick={handleAgregar}
            disabled={!form.id_instrumento}
          >
            Confirmar Préstamo
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// STYLES (Mantenemos tu estructura pero con labels consistentes)
// =====================================================

const labelStyle = {
  fontSize: "11px",
  fontWeight: "800",
  textTransform: "uppercase",
  color: "#1B3A5C",
  marginBottom: "4px"
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  width: "500px",
  background: "#FFFFFF",
  borderRadius: "20px",
  padding: "30px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  marginTop: "20px",
};

const input = {
  width: "100%",
  height: "48px",
  borderRadius: "12px",
  border: "1px solid #D1D5DB",
  padding: "0 14px",
  boxSizing: "border-box",
  fontSize: "14px",
  fontFamily: "inherit"
};

const cancelBtn = {
  height: "46px",
  padding: "0 20px",
  border: "1px solid #D1D5DB",
  background: "white",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "600"
};

const saveBtn = {
  height: "46px",
  padding: "0 24px",
  border: "none",
  borderRadius: "12px",
  background: "#1B3A5C",
  color: "#FFFFFF",
  fontWeight: "700",
  transition: "all 0.2s"
};

export default AgregarPrestamoModal;