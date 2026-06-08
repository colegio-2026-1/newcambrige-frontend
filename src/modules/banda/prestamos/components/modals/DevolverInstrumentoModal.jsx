import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";
import "../../../inventario/components/modals/BandModals.css";

const DevolverInstrumentoModal = ({ open, onClose, onConfirm, prestamo, form, setForm, errores }) => {
  if (!open || !prestamo) return null;

  const footer = (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center", width: "100%" }}>
      <button className="band-btn-pill band-btn-aceptar" onClick={onConfirm}>Aceptar</button>
      <button className="band-btn-pill band-btn-cancelar" onClick={onClose}>Cancelar</button>
    </div>
  );

  return (
    <ModalBase open={open} onClose={onClose} width="550px" footer={footer}>
      <div className="band-modal-header">
        <h2 className="band-modal-title">DEVOLUCIÓN</h2>
      </div>
      <div className="band-modal-body-text">
         Instrumento: <b>{prestamo.instrumento_nombre}</b> <br/>
         Estudiante: <b>{prestamo.estudiante_nombre}</b>
      </div>
      <div className="band-modal-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="band-field-group">
          <label className="band-label">Estado de recepción</label>
          <select 
            className="band-input"
            value={form?.estado_al_devolver}
            onChange={(e) => setForm({ ...form, estado_al_devolver: e.target.value })}
          >
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>
        <div className="band-field-group" style={{ marginTop: "15px" }}>
          <label className="band-label">Observaciones</label>
          <textarea 
            className="band-textarea"
            value={form?.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
          />
          {errores?.observaciones && <p className="band-error-text">{errores.observaciones}</p>}
        </div>
      </div>
    </ModalBase>
  );
};
export default DevolverInstrumentoModal;