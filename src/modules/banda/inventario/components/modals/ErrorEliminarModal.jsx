import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";
import "./BandModals.css"; 

const ErrorEliminarModal = ({ open, onClose }) => {

 const footer = (
  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
    <button className="band-btn-pill band-btn-aceptar" onClick={onClose}>
      Entendido
    </button>
  </div>
);

  return (
    <ModalBase open={open} onClose={onClose} width="450px" footer={footer}>
      <div className="band-modal-header-danger">
        <h2 className="band-modal-title">OPERACIÓN DENEGADA</h2>
      </div>

      <div className="band-modal-body-text">
        <span className="band-modal-icon">🚫</span>
        <p>
          No es posible eliminar este instrumento porque existen <strong>préstamos vigentes</strong> asociados a él.
        </p>
        <p style={{ marginTop: '10px', fontSize: '14px' }}>
          Debe registrar la devolución de todas las unidades antes de proceder.
        </p>
      </div>
    </ModalBase>
  );
};

export default ErrorEliminarModal;