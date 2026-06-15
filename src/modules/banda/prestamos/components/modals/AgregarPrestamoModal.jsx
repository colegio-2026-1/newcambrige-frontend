import React from 'react';
import Modal from "../../../../../components/shared/Modal";

const AgregarPrestamoModal = ({ open, onClose, form, setForm, instrumentos, handleAgregar }) => {

  const opcionesInstrumentos = instrumentos?.map(inst => ({
    value: inst.id_instrumento,
    label: `ID: ${inst.id_instrumento} | ${inst.nombre} (${inst.cantidad_disponible} disp.)`
  })) || [];

  const camposFormulario = [
    { key: 'id_instrumento', label: 'Seleccionar Instrumento', type: 'select', options: opcionesInstrumentos },
    { key: 'observacion', label: 'Observaciones de Entrega', type: 'text' },
  ];

  return (
    <Modal
      title="ASIGNAR INSTRUMENTO"
      isOpen={open}
      values={form}
      onChange={(key, val) => setForm(prev => ({ ...prev, [key]: val }))}
      onAccept={handleAgregar}
      onCancel={onClose}
      fields={camposFormulario}
    />
  );
};

export default AgregarPrestamoModal;