import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";

const ErrorEliminarModal = ({ open, onClose }) => {

  const footer = (
    <button style={btnStyle("#8E2A25")} onClick={onClose}>
      Entendido
    </button>
  );

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="NO SE PUEDE ELIMINAR"
      width="450px"
      footer={footer}
    >
      <p style={textStyle}>
        El instrumento posee asignaciones activas o registros vinculados.
        <br /><br />
        Debe registrar la devolución o eliminar primero las relaciones existentes.
      </p>
    </ModalBase>
  );
};

const textStyle = { textAlign: "center", color: "#4B5563", lineHeight: "1.7", fontSize: "14px", margin: "10px 0" };
const btnStyle = (bg) => ({ height: "40px", padding: "0 24px", border: "none", borderRadius: "50px", background: bg, color: "#FFF", fontWeight: "bold", cursor: "pointer", transition: "transform 0.2s" });

export default ErrorEliminarModal;