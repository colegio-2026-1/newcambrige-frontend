import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";
import "./BandModals.css";

const EliminarInstrumentoModal = ({ open, onClose, onConfirm, instrumento }) => {
  
  const footer = (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center", width: "100%" }}>
      <button className="band-btn-pill band-btn-danger" onClick={onConfirm}>
        Confirmar Eliminación
      </button>
      <button className="band-btn-pill band-btn-cancelar" onClick={onClose}>
        Cancelar
      </button>
    </div>
  );

  return (
    <ModalBase open={open} onClose={onClose} width="450px" footer={footer}>
      <div className="band-modal-header-danger">
        <h2 className="band-modal-title">ELIMINAR REGISTRO</h2>
      </div>

      <div className="band-modal-body-text">
        <p>¿Está seguro de que desea eliminar permanentemente este instrumento?</p>
        
        <div style={{ background: "#F3F4F6", padding: "15px", borderRadius: "12px", margin: "15px 0", border: "1px solid #E5E7EB" }}>
          <p style={{ margin: 0 }}><strong>ID:</strong> {instrumento?.id_instrumento}</p>
          <p style={{ margin: "5px 0 0 0" }}><strong>Nombre:</strong> {instrumento?.nombre}</p>
        </div>

        <p style={{ color: "#DC2626", fontWeight: "bold" }}>
          Esta acción no se puede deshacer.
        </p>
      </div>
    </ModalBase>
  );
};

export default EliminarInstrumentoModal;