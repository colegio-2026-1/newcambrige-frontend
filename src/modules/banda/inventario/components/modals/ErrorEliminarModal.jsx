import {
  modalOverlay,
  modalBox,
  btn,
} from "../../styles/inventarioStyles";

const ErrorEliminarModal = ({
  open,
  onClose,
}) => {

  if (!open) return null;

  return (

    <div style={modalOverlay}>

      <div
        style={{
          ...modalBox,
          maxWidth: "430px",
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
          No se puede eliminar
        </h2>

        <p
  style={{
    textAlign: "center",
    color: "#4B5563",
    lineHeight: "1.7",
    fontSize: "14px",
  }}
>
  El instrumento posee
  asignaciones activas o
  registros vinculados.

  <br /><br />

  Debe eliminar primero
  las relaciones existentes.
</p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >

          <button
            style={btn("#8E2A25")}
            onClick={onClose}
          >
            Entendido
          </button>

        </div>

      </div>

    </div>
  );
};

export default ErrorEliminarModal;