import InventarioForm from "../InventarioForm";
import ValidationPanel from "../ValidationPanel";
import { modalOverlay, modalBox, btn } from "../../styles/inventarioStyles";

const AgregarInstrumentoModal = ({
  open, onClose, onSave, form, setForm, errores, categorias, ubicaciones, validaciones
}) => {
  if (!open) return null;

  return (
    <div style={modalOverlay}>
      <div style={{ ...modalBox, width: "850px", maxWidth: "95%", position: 'relative' }}>
        <button onClick={onClose} style={closeBtnStyle}>✕</button>

        <h2 style={modalTitleStyle}>AGREGAR INSTRUMENTO</h2>

        <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <InventarioForm
              form={form}
              setForm={setForm}
              errores={errores}
              categorias={categorias}
              ubicaciones={ubicaciones}
            />
          </div>
          <div style={{ width: "260px" }}>
            <ValidationPanel validaciones={validaciones} />
          </div>
        </div>

        <div style={modalActionsStyle}>
          <button
            style={{ 
              ...btn("#16A34A"), 
              opacity: validaciones.todoValido ? 1 : 0.5, 
              cursor: validaciones.todoValido ? "pointer" : "not-allowed" 
            }}
            onClick={onSave}
            disabled={!validaciones.todoValido}
          >
            Guardar Instrumento
          </button>
          <button style={btn("#6B7280")} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

const closeBtnStyle = { position: "absolute", top: "18px", right: "18px", width: "36px", height: "36px", borderRadius: "50%", border: "none", backgroundColor: "#F3F4F6", cursor: "pointer" };
const modalTitleStyle = { textAlign: "center", color: "#111827", marginBottom: "30px", fontSize: "22px", fontWeight: "800", fontFamily: "var(--font-display)" };
const modalActionsStyle = { display: "flex", justifyContent: "center", gap: "16px", marginTop: "40px" };

export default AgregarInstrumentoModal;