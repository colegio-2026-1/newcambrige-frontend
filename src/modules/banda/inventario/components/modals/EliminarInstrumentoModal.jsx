import React from 'react';
import Modal from "../../../../../components/shared/Modal";

const EliminarInstrumentoModal = ({ open, onClose, onConfirm, instrumento }) => {
  if (!open || !instrumento) return null;

  const camposFormulario = [
    { 
      key: 'mensaje', 
      label: `¿Estás seguro de que deseas eliminar el instrumento "${instrumento.nombre}" (Código: ${instrumento.id_instrumento})? Esta acción no se puede deshacer.`, 
      type: 'label' 
    }
  ];

  return (
    <Modal
      title="ELIMINAR INSTRUMENTO"
      isOpen={open}
      values={{}} 
      onChange={() => {}}
      onAccept={onConfirm}
      onCancel={onClose}
      fields={camposFormulario}
    />
  );
};

export default EliminarInstrumentoModal;