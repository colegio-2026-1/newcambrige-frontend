import React from 'react';
import Modal from "../../../../../components/shared/Modal"; 

const EditarInstrumentoModal = ({ open, onClose, onSave, form, setForm, categorias }) => {
  const opcionesCategorias = categorias?.map(c => ({ value: c.id_categoria, label: c.nombre })) || [];

  const camposFormulario = [
    { key: 'nombre', label: 'Nombre del Instrumento', type: 'text' },
    { key: 'id_categoria', label: 'Tipo de Instrumento', type: 'select', options: opcionesCategorias },
    //{ key: 'cantidad_total', label: 'Cantidad Total', type: 'text' },
    { key: 'estado', label: 'Estado', type: 'select', options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' },
        { value: 'En mantenimiento', label: 'En mantenimiento' }
    ]},
  ];

  return (
    <Modal
      title="EDITAR INSTRUMENTO"
      isOpen={open}
      values={form}
      onChange={(key, val) => setForm(prev => ({ ...prev, [key]: val }))}
      onAccept={onSave}
      onCancel={onClose}
      fields={camposFormulario}
    />
  );
};

export default EditarInstrumentoModal;