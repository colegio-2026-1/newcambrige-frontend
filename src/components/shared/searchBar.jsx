import { useState } from "react";
import "./searchBar.css";

/**
 * SearchBar — componente reutilizable para todos los módulos
 *
 * Props:
 *  fields   {Array}    — lista de campos a renderizar
 *             cada campo: { key, label, type: 'text'|'select', options?: [] }
 *  onSearch {Function} — callback con el objeto de filtros { key: value }
 *  loading  {Boolean}  — deshabilita el botón mientras carga
 *
 * Ejemplo de uso — Estudiantes:
 *  <SearchBar
 *    fields={[
 *      { key: 'documento', label: 'Código',  type: 'text' },
 *      { key: 'nombre',    label: 'Nombre',  type: 'text' },
 *      { key: 'grado',     label: 'Grado',   type: 'select', options: ['6','7','8','9','10','11'] },
 *      { key: 'grupo',     label: 'Grupo',   type: 'select', options: ['1','2','3'] },
 *      { key: 'anio',      label: 'Año',     type: 'select', options: ['2024','2025'] },
 *    ]}
 *    onSearch={(filtros) => console.log(filtros)}
 *  />
 *
 * Ejemplo de uso — Inventario Libros:
 *  <SearchBar
 *    fields={[
 *      { key: 'nombre',     label: 'Título',      type: 'text' },
 *      { key: 'autor',      label: 'Autor',       type: 'text' },
 *      { key: 'disponible', label: 'Disponible',  type: 'select', options: ['Sí','No'] },
 *    ]}
 *    onSearch={(filtros) => console.log(filtros)}
 *  />
 */

export default function SearchBar({ fields = [], onSearch, loading = false, initialValues = {}, onChange, cleanFilter }) {

const initialState = fields.reduce((acc, f) => {
    acc[f.key] = initialValues[f.key] || "";

    return acc;
}, {});

const [values, setValues] = useState(initialState);

const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (onChange) onChange(key, value);
};

const handleSearch = () => {
    if (onSearch){
        onSearch(values);
        //limpiar filtros después de la búsqueda
        if(cleanFilter){
            setValues(cleanFilter);
        }
    }
         
};

const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
};

return (
    <div className="searchbar-wrapper">
    {fields.map((field) => (
        <div key={field.key} className="searchbar-field">

        <label className="searchbar-label">
            {field.label}
        </label>

        {field.type === "select" ? (
            <select
            className="searchbar-input searchbar-select"
            value={values[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
            >
            <option value=""></option>
            {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                {opt}
                </option>
            ))}
            </select>
        ) : (
            <input
            type={field.type === "number" ? "number" : "text"}
            className="searchbar-input"
            value={values[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={field.maxLength}
            />
        )}

        </div>
    ))}

    <button
        className="searchbar-btn"
        onClick={handleSearch}
        disabled={loading}
    >
        {loading ? "Buscando..." : "Buscar"}
    </button>
    </div>
);
}