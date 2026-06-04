import React from 'react';
import Modal from "../../../../../components/shared/Modal";

const AgregarPrestamoModal = ({
  open, onClose, form, setForm, instrumentos, handleAgregar
}) => {

  // 1. Adaptamos los instrumentos al formato { value, label }
  const opcionesInstrumentos = instrumentos?.map(inst => ({
    value: inst.id_instrumento,
    label: `[${inst.codigo}] — ${inst.nombre} — Disponibles: ${inst.cantidad_disponible}`,
    disabled: inst.cantidad_disponible <= 0 // Opcional: si el Modal global soporta 'disabled'
  })) || [];

  // 2. Definimos los campos
  const camposFormulario = [
    { key: 'id_instrumento', label: 'Instrumento (Código — Nombre — Stock)', type: 'select', options: opcionesInstrumentos },
    { key: 'observacion', label: 'Observación / Notas de entrega', type: 'text' },
  ];

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAccept = () => {
    if (form.id_instrumento) {
      handleAgregar();
    } else {
      alert("Por favor, seleccione un instrumento.");
    }
  };

  return (
    <Modal
      title="REGISTRAR PRÉSTAMO"
      isOpen={open}
      values={form}
      onChange={handleChange}
      onAccept={handleAccept}
      onCancel={onClose}
      fields={camposFormulario}
    />
  );
};

export default AgregarPrestamoModal;