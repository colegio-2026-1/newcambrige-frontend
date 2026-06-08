import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";
import "./BandModals.css";

const AdvertenciaModal = ({ open, onClose, onConfirm }) => {

  const footer = (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center", width: "100%" }}>
      <button className="band-btn-pill band-btn-aceptar" onClick={onConfirm}>
        Sí, continuar
      </button>
      <button className="band-btn-pill band-btn-cancelar" onClick={onClose}>
        No, volver
      </button>
    </div>
  );

  return (
    <ModalBase open={open} onClose={onClose} width="480px" footer={footer}>
      <div className="band-modal-header">
        <h2 className="band-modal-title">ADVERTENCIA</h2>
      </div>

      <div className="band-modal-body-text">
        <span className="band-modal-icon"></span>
        <p><strong>Este instrumento tiene asignaciones activas.</strong></p>
        <p style={{ marginTop: '10px' }}>
          Cambiar el estado o reducir el stock total puede afectar los registros de paz y salvo. 
          ¿Desea aplicar los cambios de todos modos?
        </p>
      </div>
    </ModalBase>
  );
};

export default AdvertenciaModal;