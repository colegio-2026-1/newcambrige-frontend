import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";
import "../../../inventario/components/modals/BandModals.css"; // Reutilizamos estilos de modales del inventario

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
        <h2 className="band-modal-title">REGISTRAR ASIGNACIÓN</h2>
      </div>

      <div className="band-modal-grid" style={{gridTemplateColumns: "1fr"}}>
        <div className="band-field-group" style={{flexDirection: "column", alignItems: "flex-start"}}>
          <label className="band-label">Instrumento Disponible</label>
          <select 
            className="band-input" 
            style={{width: "100%"}}
            value={form.id_instrumento} 
            onChange={(e) => setForm({...form, id_instrumento: e.target.value})}
          >
            <option value="">Seleccione un instrumento...</option>
            {instrumentos?.map(inst => (
              <option key={inst.id_instrumento} value={inst.id_instrumento}>
                {`[ID: ${inst.id_instrumento}] — ${inst.nombre} (${inst.cantidad_disponible} disp.)`}
              </option>
            ))}
          </select>
        </div>

        <div className="band-field-group" style={{flexDirection: "column", alignItems: "flex-start", marginTop: "10px"}}>
          <label className="band-label">Observaciones de Entrega</label>
          <textarea 
            className="band-textarea"
            placeholder="Ej: Se entrega con estuche y boquilla..."
            value={form.observacion}
            onChange={(e) => setForm({...form, observacion: e.target.value})}
          />
        </div>
      </div>
    </ModalBase>
  );
};

export default AgregarPrestamoModal;