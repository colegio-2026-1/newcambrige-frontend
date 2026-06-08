import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";
import "./BandModals.css"; 

const AgregarInstrumentoModal = ({ open, onClose, onSave, form, setForm, categorias, ubicaciones }) => {

  const footer = (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center", width: "100%" }}>
      <button className="band-btn-pill band-btn-aceptar" onClick={onSave}>Aceptar</button>
      <button className="band-btn-pill band-btn-cancelar" onClick={onClose}>Cancelar</button>
    </div>
  );

  return (
    <ModalBase open={open} onClose={onClose} footer={footer} width="600px">
      <div className="band-modal-header">
        <h2 className="band-modal-title">INSTRUMENTO</h2>
      </div>

      <div className="band-modal-grid">
        <div className="band-field-group">
          <label className="band-label">Nombre</label>
          <input 
            className="band-input" 
            value={form.nombre} 
            onChange={(e) => setForm({...form, nombre: e.target.value})} 
          />
        </div>

        <div className="band-field-group">
          <label className="band-label">Categoría</label>
          <select 
            className="band-input" 
            value={form.id_categoria} 
            onChange={(e) => setForm({...form, id_categoria: e.target.value})}
          >
            <option value=""></option>
            {categorias?.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="band-field-group">
          <label className="band-label">Cantidad</label>
          <input 
            className="band-input" 
            type="number"
            value={form.cantidad_total} 
            onChange={(e) => setForm({...form, cantidad_total: e.target.value})} 
          />
        </div>

        <div className="band-field-group">
          <label className="band-label">Ubicación</label>
          <select 
            className="band-input" 
            value={form.id_ubicacion} 
            onChange={(e) => setForm({...form, id_ubicacion: e.target.value})}
          >
            <option value=""></option>
            {ubicaciones?.map(u => <option key={u.id_ubicacion} value={u.id_ubicacion}>{u.nombre}</option>)}
          </select>
        </div>
      </div>
    </ModalBase>
  );
};

export default AgregarInstrumentoModal;