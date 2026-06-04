import React from 'react';
import Modal from "../../../../../components/shared/Modal"; // ✅ USAMOS EL MODAL GLOBAL DEL EQUIPO

const AgregarInstrumentoModal = ({
  open, onClose, onSave, form, setForm, categorias, ubicaciones, validaciones
}) => {

  // 1. Adaptamos los datos al formato { value, label } que exige el Modal.jsx global
  const opcionesCategorias = categorias?.map(c => ({ value: c.id_categoria, label: c.nombre })) || [];
  const opcionesUbicaciones = ubicaciones?.map(u => ({ value: u.id_ubicacion, label: u.nombre })) || [];

  // 2. Definimos los campos exactamente como en la imagen guía
  const camposFormulario = [
    { key: 'codigo', label: 'Código', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'id_categoria', label: 'Categoría', type: 'select', options: opcionesCategorias },
    { key: 'cantidad_total', label: 'Cantidad Total', type: 'text' },
    { key: 'id_ubicacion', label: 'Ubicación', type: 'select', options: opcionesUbicaciones },
    { key: 'estado', label: 'Estado Inicial', type: 'select', options: ['Activo', 'Inactivo', 'En mantenimiento'] },
  ];

  // 3. Manejador de cambios que actualiza tu estado 'form' intacto
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // 4. Interceptamos el guardado para mantener la validación lógica
  const handleAccept = () => {
    if (validaciones?.todoValido) {
      onSave();
    } else {
      // Como ya no tenemos el panel visual, usamos una alerta nativa para avisar al usuario
      alert("Por favor, verifique los datos:\n- El código y nombre deben ser únicos.\n- La cantidad debe ser mayor a 0.\n- Seleccione una categoría.");
    }
  };

  return (
    <Modal
      title="AGREGAR INSTRUMENTO"
      isOpen={open}
      values={form}
      onChange={handleChange}
      onAccept={handleAccept}
      onCancel={onClose}
      fields={camposFormulario}
    />
  );
};

export default AgregarInstrumentoModal;