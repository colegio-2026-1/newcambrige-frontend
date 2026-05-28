import {
  modalOverlay,
  modalBox,
  btn,
} from "../../styles/inventarioStyles";

const AdvertenciaModal = ({
  open,
  onClose,
  onConfirm,
}) => {

  if (!open) return null;

  return (

    <div style={modalOverlay}>

      <div
        style={{
          ...modalBox,
          maxWidth: "460px",
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
          Advertencia
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#444",
            lineHeight: "1.6",
          }}
        >
          Este instrumento tiene asignaciones
          activas.
          <br />
          Cambiar el estado puede afectar
          préstamos actuales.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "26px",
          }}
        >

          <button
            style={btn("#D97706")}
            onClick={onConfirm}
          >
            Continuar
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

export default AdvertenciaModal;