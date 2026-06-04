import React from 'react';
import ModalBase from "../../../../../components/shared/ModalBase";

const DevolverInstrumentoModal = ({ open, onClose, onConfirm, prestamo, form, setForm, errores }) => {
  if (!open || !prestamo || !form) return null;

  const footer = (
    <>
      <button style={btnStyle("var(--color-secondary)")} onClick={onConfirm}>
        Confirmar Devolución
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
      title="REGISTRAR DEVOLUCIÓN DE INSTRUMENTO"
      width="500px"
      footer={footer}
    >
      <div style={{ padding: '10px 0' }}>
        <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '20px' }}>
          Registrando devolución para: <br />
          <b style={{color: 'var(--color-text)'}}>{prestamo.instrumento_nombre}</b> — Estudiante: <b style={{color: 'var(--color-text)'}}>{prestamo.estudiante_nombre}</b>
        </p>

        <div style={fieldGroup}>
          <label style={labelStyle}>ESTADO DEL INSTRUMENTO</label>
          <select 
            style={inputStyle}
            value={form?.estado_al_devolver || "Bueno"}
            onChange={(e) => setForm({ ...form, estado_al_devolver: e.target.value })}
          >
            <option value="Bueno">Bueno (Reingresa al inventario)</option>
            <option value="Malo">Malo (Pasa a mantenimiento)</option>
          </select>
        </div>

        <div style={{ ...fieldGroup, marginTop: '20px' }}>
          <label style={labelStyle}>OBSERVACIONES {form?.estado_al_devolver === 'Malo' && '(OBLIGATORIO)'}</label>
          <textarea 
            style={{ ...inputStyle, height: '100px', paddingTop: '10px', resize: 'none' }}
            placeholder="Describa el estado en que se recibe el instrumento..."
            value={form?.observaciones || ""}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
          />
          {errores?.observaciones && <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '5px' }}>{errores.observaciones}</p>}
        </div>
      </div>
    </ModalBase>
  );
};

const fieldGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '11px', fontWeight: '800', color: 'var(--color-secondary)' };
const inputStyle = { width: '100%', height: '45px', borderRadius: '10px', border: '1px solid #D1D5DB', padding: '0 12px', fontFamily: 'var(--font-body)' };
const btnStyle = (bg) => ({ height: "40px", padding: "0 24px", border: "none", borderRadius: "50px", background: bg, color: "#FFF", fontWeight: "bold", cursor: "pointer", transition: "transform 0.2s" });

export default DevolverInstrumentoModal;