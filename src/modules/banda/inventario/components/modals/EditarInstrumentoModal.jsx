import InventarioForm from "../InventarioForm";

import {
  modalOverlay,
  modalBox,
  btn,
} from "../../styles/inventarioStyles";

const EditarInstrumentoModal = ({
  open,
  onClose,
  onSave,

  form,
  setForm,

  errores,

  categorias,
  ubicaciones,
}) => {

  if (!open) return null;

  return (

    <div style={modalOverlay}>

      <div style={modalBox}>

        <button
  onClick={onClose}
  style={{
    position: "absolute",
    top: "18px",
    right: "18px",

    width: "36px",
    height: "36px",

    borderRadius: "50%",

    border: "none",

    backgroundColor: "#F3F4F6",

    cursor: "pointer",

    fontSize: "16px",

    color: "#6B7280",

    transition: "0.2s",
  }}
>
  ✕
</button>

        <h2
          style={{
  textAlign: "center",
  color: "#111827",
  marginBottom: "24px",
  fontSize: "22px",
  fontWeight: "700",
}}
        >
          EDITAR INSTRUMENTO
        </h2>

        <InventarioForm
          esEdicion={true}
          form={form}
          setForm={setForm}
          errores={errores}
          categorias={categorias}
          ubicaciones={ubicaciones}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "34px",
          }}
        >

          <button
            style={btn("#2E5FA7")}
            onClick={onSave}
          >
            Guardar cambios
          </button>

          <button
            style={btn("#6B7280")}
            onClick={onClose}
          >
            Cancelar
          </button>

        </div>

      </div>

    </div>
  );
};

export default EditarInstrumentoModal;