import { useEffect, useState, useMemo } from "react";
import Modal from "../../../components/shared/Modal";
import { getObjetosDisponiblesRequest, registrarPrestamoRequest } from "../../../api/uniformesService";

export default function AsignarPrendaModal({ isOpen, onClose, estudianteSeleccionado, onSuccess }) {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_objeto: "",
    talla: "",
    fecha_prestamo: "", // Solo Visual
    estado: "bueno",
    observacion: ""
  });

  const fechaVisual = new Date().toLocaleDateString("es-CO");

  // Cargar prendas y resetear formulario al abrir el modal
  useEffect(() => {
    const cargarPrendas = async () => {
      try {
        const response = await getObjetosDisponiblesRequest();
        setPrendas(response.data);
      } catch (error) {
        console.error("Error cargando prendas:", error);
      }
    };

    if (isOpen) {
      cargarPrendas();
      setFormData({
        id_objeto: "",
        talla: "",
        fecha_prestamo: fechaVisual,
        estado: "bueno",
        observacion: ""
      });
    }
  }, [isOpen, fechaVisual]);

  // Memorizar las opciones de prendas para evitar mapeos costosos en cada render
  const opcionesPrendas = useMemo(() => {
    return prendas.map((item) => ({
      value: item.id_objeto,
      label: item.nombre
    }));
  }, [prendas]);

  const prendaSeleccionada = prendas.find(
    (p) => p.id_objeto === Number(formData.id_objeto)
  );

  const handleSubmit = async () => {
    if (loading) return; // Previene ejecuciones duplicadas por doble click

    // Validar Prenda
    if (!formData.id_objeto) {
      alert("Seleccione una prenda");
      return;
    }

    // Validar Talla
    if (
      prendaSeleccionada?.tipo === "vestimenta" &&
      !formData.talla
    ) {
      alert("Seleccione una talla");
      return;
    }

    // Validar Estudiante
    if (!estudianteSeleccionado?.id_estudiante) {
      alert("Debe seleccionar un estudiante");
      return;
    }

    let data = {
      id_objeto: parseInt(formData.id_objeto),
      id_estudiante: estudianteSeleccionado.id_estudiante,
      talla:
        prendaSeleccionada?.tipo === "vestimenta"
          ? formData.talla
          : null,
      estado: formData.estado,
      cantidad_prestada: 1
    };

    try {
      setLoading(true);

      await registrarPrestamoRequest(data);
      alert("Prenda asignada correctamente");

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("ERROR BACKEND:", error.response?.data);
      alert(error.response?.data?.detail || "Error al registrar préstamo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="ASIGNAR PRENDA"
      isOpen={isOpen}
      onCancel={onClose}
      onAccept={handleSubmit}
      values={formData}
      disabled={loading} 
      onChange={(key, value) => {
        if (key === "fecha_prestamo" || loading) return; // Bloquear edición de fecha y cambios en loading

        setFormData((prev) => {
          const nuevo = {
            ...prev,
            [key]: value
          };
          
          // Cambiado según requerimiento 2
          if (key === "id_objeto") {
            const objeto = prendas.find(
              (p) => p.id_objeto === Number(value)
            );

            nuevo.talla =
              objeto?.tipo === "objeto"
                ? "No aplica"
                : "";
          }
          return nuevo;
        });
      }}
      fields={[
        {
          key: "id_objeto",
          label: "Prenda",
          type: "select",
          options: opcionesPrendas
        },
        // Cambiado según requerimiento 1 (Mantiene el orden original que tenías)
        {
          key: "talla",
          label: "Talla",
          type: "select",
          options:
            prendaSeleccionada?.tipo === "objeto"
              ? ["No aplica"]
              : ["S", "M", "L", "XL"]
        },
        {
          key: "fecha_prestamo",
          label: "Fecha de Entrega",
          type: "text"
        },
        {
          key: "estado",
          label: "Estado de la prenda",
          type: "select",
          options: [
            { value: "bueno", label: "Bueno" },
            { value: "regular", label: "Regular" },
            { value: "malo", label: "Malo" }
          ]
        },
        {
          key: "observacion",
          label: "Observación",
          type: "text"
        }
      ]}
    />
  );
}