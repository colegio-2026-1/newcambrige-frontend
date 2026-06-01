import ModalBase from "../../../../../components/shared/ModalBase";
import InventarioForm from "../InventarioForm";
import ValidationPanel from "../ValidationPanel";
import { btn } from "../../styles/inventarioStyles";

const AgregarInstrumentoModal = ({
  open, onClose, onSave, form, setForm, errores, categorias, ubicaciones, validaciones
}) => {

    const esValido = validaciones?.todoValido || false; 

  const footer = (
    <>
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
      <button style={btn("#6B7280")} onClick={onClose}>
        Cancelar
      </button>
    </>
  );

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="AGREGAR NUEVO INSTRUMENTO"
      width="850px"
      footer={footer}
    >
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
          <ValidationPanel validaciones={validaciones || {}} />
        </div>
      </div>
    </ModalBase>
  );
};

export default AgregarInstrumentoModal;