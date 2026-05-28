import {
  modalOverlay,
  modalBox,
  btn,
} from "../../styles/inventarioStyles";

const EliminarInstrumentoModal = ({
  open,
  onClose,
  onConfirm,
  instrumento,
}) => {

  if (!open) return null;

  return (

    <div style={modalOverlay}>

      <div
        style={{
          ...modalBox,
          maxWidth: "420px",
        }}
      >

        <h2
          style={{
  textAlign: "center",
  color: "#111827",
  marginBottom: "24px",
  fontSize: "22px",
  fontWeight: "700",
}}
        >
          Eliminar instrumento
        </h2>

        <p
  style={{
    textAlign: "center",
    color: "#4B5563",
    lineHeight: "1.7",
    fontSize: "14px",
  }}
>
  Está a punto de eliminar el instrumento:

  <br />

  <strong
    style={{
      color: "#111827",
    }}
  >
    {instrumento?.nombre}
  </strong>

  <br /><br />

  Esta acción no se puede deshacer.
</p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "24px",
          }}
        >

          <button
            style={btn("#DC2626")}
            onClick={onConfirm}
          >
            Eliminar
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

export default EliminarInstrumentoModal;