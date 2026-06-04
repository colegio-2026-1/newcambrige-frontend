import React from 'react';
import Modal from "../../../../../components/shared/Modal"; // ✅ USAMOS EL MODAL GLOBAL DEL EQUIPO

const EditarInstrumentoModal = ({
  open, onClose, onSave, form, setForm, categorias, ubicaciones, validaciones
}) => {

  const opcionesCategorias = categorias?.map(c => ({ value: c.id_categoria, label: c.nombre })) || [];
  const opcionesUbicaciones = ubicaciones?.map(u => ({ value: u.id_ubicacion, label: u.nombre })) || [];

  const camposFormulario = [
    { key: 'codigo', label: 'Código', type: 'text' }, // El hook ya ignora cambios en el código al editar
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'id_categoria', label: 'Categoría', type: 'select', options: opcionesCategorias },
    { key: 'cantidad_total', label: 'Cantidad Total', type: 'text' },
    { key: 'id_ubicacion', label: 'Ubicación', type: 'select', options: opcionesUbicaciones },
    { key: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo', 'En mantenimiento'] },
  ];

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAccept = () => {
    if (validaciones?.todoValido) {
      onSave();
    } else {
      alert("Por favor, verifique los datos:\n- El nombre debe ser único.\n- La cantidad debe ser mayor a 0.");
    }
  };

  return (
    <Modal
      title="EDITAR INSTRUMENTO"
      isOpen={open}
      values={form}
      onChange={handleChange}
      onAccept={handleAccept}
      onCancel={onClose}
      fields={camposFormulario}
    />
  );
};

export default EditarInstrumentoModal;