import { useState } from "react";
import "./searchBar.css";

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
            onChange={(e) => { 
                const valor = e.target.value;
                if (field.maxLength && valor.length > field.maxLength) {
                    return; 
                };
                handleChange(field.key, e.target.value); 
                }}
            onKeyDown={handleKeyDown}
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