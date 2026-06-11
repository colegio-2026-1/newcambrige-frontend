import { useEffect } from "react";
import "./Modal.css";

/**
 * Modal — componente reutilizable para asignar libro, instrumento u objeto
 *
 * Props:
 *  title      {String}   — título del modal ej: "ASIGNAR LIBRO"
 *  fields     {Array}    — campos del formulario
 *               { key, label, type: 'text'|'select'|'date', options?: [] }
 *  values     {Object}   — estado del formulario manejado por el padre
 *  onChange   {Function} — (key, value) => void
 *  onAccept   {Function} — se llama al presionar Aceptar
 *  onCancel   {Function} — se llama al presionar Cancelar o X
 *  isOpen     {Boolean}  — controla si el modal se muestra
 *
 * Ejemplo — Asignar Libro:
 *  <Modal
 *    title="ASIGNAR LIBRO"
 *    isOpen={modalAbierto}
 *    values={formValues}
 *    onChange={(key, val) => setFormValues(p => ({...p, [key]: val}))}
 *    onAccept={handleAsignar}
 *    onCancel={() => setModalAbierto(false)}
 *    fields={[
 *      { key: 'id_libro',        label: 'Título del Libro', type: 'select', options: libros },
 *      { key: 'edicion',         label: 'Edición',          type: 'text' },
 *      { key: 'fecha_prestamo',  label: 'Fecha de Entrega', type: 'date' },
 *      { key: 'estado',          label: 'Estado del Libro', type: 'text' },
 *      { key: 'observacion',     label: 'Observación',      type: 'text' },
 *    ]}
 *  />
 *
 * Ejemplo — Asignar Instrumento:
 *    fields={[
 *      { key: 'id_instrumento',  label: 'Instrumento',           type: 'select', options: instrumentos },
 *      { key: 'id_categoria',    label: 'Tipo',                  type: 'select', options: categorias },
 *      { key: 'fecha_prestamo',  label: 'Fecha de Entrega',      type: 'date' },
 *      { key: 'observacion',     label: 'Observación',           type: 'text' },
 *      { key: 'estado_entrega',  label: 'Estado del Instrumento',type: 'text' },
 *    ]}
 *
 * Ejemplo — Asignar Objeto/Uniforme:
 *    fields={[
 *      { key: 'id_objeto',        label: 'Objeto',           type: 'select', options: objetos },
 *      { key: 'talla',            label: 'Talla',            type: 'select', options: ['XS','S','M','L','XL'] },
 *      { key: 'cantidad_prestada',label: 'Cantidad',         type: 'text' },
 *      { key: 'fecha_prestamo',   label: 'Fecha de Entrega', type: 'date' },
 *      { key: 'estado_entrega',   label: 'Estado',           type: 'text' },
 *      { key: 'observacion',      label: 'Observación',      type: 'text' },
 *    ]}
 */

export default function Modal({
    title = "",
    fields = [],
    values = {},
    onChange,
    onAccept,
    onCancel,
    isOpen = false,
}) {

  // Cierra con Escape
    useEffect(() => {
    const handleKey = (e) => {
        if (e.key === "Escape" && isOpen) onCancel?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
}, [isOpen, onCancel]);

if (!isOpen) return null;

return (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {/* CERRAR */}
        <button className="modal-close" onClick={onCancel} aria-label="Cerrar">
        ✕
        </button>

        {/* TÍTULO */}
        <h2 className="modal-title">{title}</h2>

        {/* CAMPOS */}
        <div className="modal-fields">
            {fields.map((field) => (
            <div
                key={field.key}
                className={`modal-field ${
                    field.type === "label" ? "modal-field--full" : ""
                }`}
            >
                <label className="modal-label">{(field.type == "label" || field.type ==" card")? "" : field.label }</label>

                {field.type === "select" ? (
                <select
                    className="modal-input modal-select"
                    value={values[field.key] ?? ""}
                    onChange={(e) => onChange?.(field.key, e.target.value)}
                >
                    <option value=""></option>
                    {field.options?.map((opt) => (
                    <option
                        key={typeof opt === "object" ? opt.value : opt}
                        value={typeof opt === "object" ? opt.value : opt}
                    >
                        {typeof opt === "object" ? opt.label : opt}
                    </option>
                    ))}
                </select>
            ) : field.type === "date" ? (
                <input
                    type="date"
                    className="modal-input"
                    value={values[field.key] ?? ""}
                    onChange={(e) => onChange?.(field.key, e.target.value)}
                />
            ) : field.type == "label" ? (

                <div className={`modal-label ${field.className || ""}`}>
                    {field.label}
                </div>

            ) : field.type == "card" ? (
                <div className="cards-container">
                    {field.values.map( (m) =>
                        <span key={m} 
                        className={`cards-item ${field.validatevalues?.includes(m.toLowerCase()) ? 'is-paid' : ''}`}>
                            {m}</span>
                    )}        
                </div>
            ) : (
                <input
                    type="text"
                    className="modal-input"
                    value={values[field.key] ?? ""}
                    onChange={(e) => onChange?.(field.key, e.target.value)}
                />
            )}
        </div>
        ))}
    </div>

        {/* BOTONES */}
        <div className="modal-actions">
            <button className="modal-btn modal-btn--accept" onClick={onAccept}>
                Aceptar
            </button>
            <button className="modal-btn modal-btn--cancel" onClick={onCancel}>
                Cancelar
            </button>
        </div>
    </div>
</div>
);
}