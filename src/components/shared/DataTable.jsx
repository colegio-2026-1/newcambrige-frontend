import { useState } from "react";
import "./DataTable.css";

/**
 * DataTable — componente reutilizable para todos los módulos
 *
 * Props:
 *  columns  {Array}  — definición de columnas
 *             { key, label, render?: (value, row) => JSX }
 *  rows     {Array}  — datos a mostrar (array de objetos)
 *  onRowClick {Function} — opcional, se llama con la fila al hacer click
 *  emptyText {String} — texto cuando no hay resultados
 *
 * Ejemplo — Inventario Libros:
 *  <DataTable
 *    columns={[
 *      { key: 'id_libro',   label: 'ID' },
 *      { key: 'nombre',     label: 'Título del Libro' },
 *      { key: 'autor',      label: 'Autor' },
 *      { key: 'disponible', label: 'Disponibilidad',
 *          render: (val) => <span className={val ? 'badge--ok' : 'badge--no'}>{val ? 'Disponible' : 'No disponible'}</span> },
 *    ]}
 *    rows={libros}
 *    onRowClick={(fila) => abrirModal(fila)}
 *  />
 *
 * Ejemplo — Inventario Instrumentos:
 *    columns={[
 *      { key: 'id_instrumento', label: 'ID' },
 *      { key: 'nombre',         label: 'Instrumento' },
 *      { key: 'categoria',      label: 'Tipo' },
 *      { key: 'ubicacion',      label: 'Ubicación' },
 *      { key: 'disponible',     label: 'Disponibilidad' },
 *    ]}
 *
 * Ejemplo — Estudiantes:
 *    columns={[
 *      { key: 'documento', label: 'Código' },
 *      { key: 'nombre',    label: 'Nombre' },
 *      { key: 'grado',     label: 'Grado' },
 *      { key: 'grupo',     label: 'Grupo' },
 *    ]}
 */

export default function DataTable({
  columns = [],
  rows = [],
  onRowClick,
  emptyText = "No se encontraron resultados",
  
}) {
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  const handleClick = (row) => {
    const nueva = filaSeleccionada === row ? null : row;
    setFilaSeleccionada(nueva);
    onRowClick?.(nueva);
  };

  return (
    <div className="datatable-wrapper">

      {/* TABLA */}
      <div className="datatable-scroll">
        <table className="datatable">

          <thead>
            <tr>
              <th className="datatable-th-check"></th>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="datatable-empty"
                  colSpan={columns.length + 1}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => {
                const seleccionada = filaSeleccionada === row;
                return (
                  <tr
                    key={row.id ?? i}
                    className={`
                      ${onRowClick ? "datatable-row--clickable" : ""}
                      ${seleccionada ? "datatable-row--selected" : ""}
                    `}
                    onClick={() => handleClick(row)}
                  >
                    <td className="datatable-td-check">
                      {seleccionada && <span className="datatable-check">✓</span>}
                    </td>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}