import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";

const AdvertenciaModal = ({ open, onClose, onConfirm }) => {

  const footer = (
    <>
      <button style={btnStyle("#D97706")} onClick={onConfirm}>
        Continuar
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
      title="ADVERTENCIA"
      width="450px"
      footer={footer}
    >
      <p style={textStyle}>
        Este instrumento tiene asignaciones activas.
        <br /><br />
        Cambiar el estado a "Inactivo" o "Mantenimiento" puede afectar los préstamos actuales. ¿Desea continuar?
      </p>
    </ModalBase>
  );
};

const textStyle = { textAlign: "center", color: "#4B5563", lineHeight: "1.7", fontSize: "14px", margin: "10px 0" };
const btnStyle = (bg) => ({ height: "40px", padding: "0 24px", border: "none", borderRadius: "50px", background: bg, color: "#FFF", fontWeight: "bold", cursor: "pointer", transition: "transform 0.2s" });

export default AdvertenciaModal;