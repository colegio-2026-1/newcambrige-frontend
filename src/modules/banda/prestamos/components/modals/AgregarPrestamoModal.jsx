import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";
import "../../../inventario/components/modals/BandModals.css"; 

const AgregarPrestamoModal = ({ open, onClose, form, setForm, instrumentos, handleAgregar }) => {
  const footer = (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center", width: "100%" }}>
      <button className="band-btn-pill band-btn-aceptar" onClick={handleAgregar}>Aceptar</button>
      <button className="band-btn-pill band-btn-cancelar" onClick={onClose}>Cancelar</button>
    </div>
  );

  return (
    <ModalBase open={open} onClose={onClose} footer={footer} width="600px">
      <div className="band-modal-header">
        <h2 className="band-modal-title">ASIGNAR INSTRUMENTO</h2>
      </div>
      <div className="band-modal-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="band-field-group">
          <label className="band-label">Seleccionar Instrumento</label>
          <select 
            className="band-input" 
            value={form.id_instrumento} 
            onChange={(e) => setForm({...form, id_instrumento: e.target.value})}
          >
            <option value="">— Seleccione de la lista —</option>
            {instrumentos?.map(inst => (
              <option key={inst.id_instrumento} value={inst.id_instrumento}>
                {`ID: ${inst.id_instrumento} | ${inst.nombre} (${inst.cantidad_disponible} disp.)`}
              </option>
            ))}
          </select>
        </div>
        <div className="band-field-group" style={{ marginTop: "15px" }}>
          <label className="band-label">Observaciones de Entrega</label>
          <textarea 
            className="band-textarea"
            placeholder="Notas sobre el estado de entrega..."
            value={form.observacion}
            onChange={(e) => setForm({...form, observacion: e.target.value})}
          />
        </div>
      </div>
    </ModalBase>
  );
};
export default AgregarPrestamoModal;