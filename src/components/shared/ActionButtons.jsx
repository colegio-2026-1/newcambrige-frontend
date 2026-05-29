import "./ActionButtons.css";

/**
 * ActionButtons — botones de acción reutilizables para todos los módulos
 *
 * Props:
 *  botones          {Array}   — lista de botones a renderizar
 *                    { label, onClick, siempreActivo?: bool, variante?: 'primary'|'secondary'|'danger' }
 *  filaSeleccionada {Object}  — fila activa de la tabla (null si no hay ninguna)
 *
 * - Si siempreActivo es true  → el botón funciona aunque no haya fila seleccionada
 * - Si siempreActivo es false → el botón se desactiva si no hay fila seleccionada
 *
 * Ejemplo — Inventario Libros:
 *  <ActionButtons
 *    filaSeleccionada={filaActiva}
 *    botones={[
 *      { label: "Agregar Libro",  onClick: abrirModalAgregar, siempreActivo: true,  variante: "primary" },
 *      { label: "Editar Libro",   onClick: abrirModalEditar,                        variante: "secondary" },
 *      { label: "Eliminar Libro", onClick: eliminarLibro,                           variante: "danger" },
 *    ]}
 *  />
 *
 * Ejemplo — Inventario Instrumentos:
 *    botones={[
 *      { label: "Asignar Instrumento", onClick: abrirModal,    siempreActivo: true, variante: "primary" },
 *      { label: "Devolver",            onClick: devolverItem,                       variante: "secondary" },
 *      { label: "Eliminar",            onClick: eliminar,                           variante: "danger" },
 *    ]}
 */

export default function ActionButtons({
  botones = [],
  filaSeleccionada = null,
}) {
  return (
    <div className="action-buttons">
      {botones.map((btn, i) => {
        const desactivado = (!btn.siempreActivo && !filaSeleccionada) || btn.disabled;

        return (
          <button
            key={i}
            className={`action-btn action-btn--${btn.variante ?? "primary"} ${desactivado ? "action-btn--disabled" : ""}`}
            onClick={() => !desactivado && btn.onClick?.(filaSeleccionada)}
            disabled={desactivado }
            title={desactivado ? "Selecciona una fila primero" : btn.label}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
}