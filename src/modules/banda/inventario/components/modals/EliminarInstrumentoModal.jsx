import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";

const EliminarInstrumentoModal = ({ open, onClose, onConfirm, instrumento }) => {
  
  const footer = (
    <>
      <button style={btnStyle("#DC2626")} onClick={onConfirm}>
        Eliminar
      </button>
      <button style={btnStyle("#6B7280")} onClick={onClose}>
        Cancelar
      </button>
    </>
  );

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="ELIMINAR INSTRUMENTO"
      width="450px"
      footer={footer}
    >
      <p style={textStyle}>
        Está a punto de eliminar el instrumento:
        <br /><br />
        <strong style={{ color: "#111827", fontSize: "16px" }}>
          {instrumento?.nombre}
        </strong>
        <br /><br />
        Esta acción no se puede deshacer.
      </p>
    </ModalBase>
  );
};

// Estilos locales para mantener la consistencia
const textStyle = { textAlign: "center", color: "#4B5563", lineHeight: "1.7", fontSize: "14px", margin: "10px 0" };
const btnStyle = (bg) => ({ height: "40px", padding: "0 24px", border: "none", borderRadius: "50px", background: bg, color: "#FFF", fontWeight: "bold", cursor: "pointer", transition: "transform 0.2s" });

export default EliminarInstrumentoModal;