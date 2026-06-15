import React from 'react';
import Modal from "../../../../../components/shared/Modal";

const DevolverInstrumentoModal = ({ open, onClose, onConfirm, prestamo, form, setForm }) => {
  if (!open || !prestamo) return null;

  const camposFormulario = [
    // Usamos type: 'label' para mostrar información estática según el estándar del equipo
    { key: 'info_inst', label: `Instrumento: ${prestamo.instrumento_nombre}`, type: 'label' },
    { key: 'info_est', label: `Estudiante: ${prestamo.estudiante_nombre}`, type: 'label' },
    { 
      key: 'estado_al_devolver', 
      label: 'Estado de recepción', 
      type: 'select', 
      options: [
        { value: 'Bueno', label: 'Bueno (Reingresa al Stock)' },
        { value: 'Malo', label: 'Malo (Requiere Mantenimiento)' }
      ]
    },
    { key: 'observaciones', label: 'Observaciones (Obligatorio si es Malo)', type: 'text' },
  ];

  return (
    <Modal
      title="DEVOLUCIÓN"
      isOpen={open}
      values={form}
      onChange={(key, val) => setForm(prev => ({ ...prev, [key]: val }))}
      onAccept={onConfirm}
      onCancel={onClose}
      fields={camposFormulario}
    />
  );
};

export default DevolverInstrumentoModal;