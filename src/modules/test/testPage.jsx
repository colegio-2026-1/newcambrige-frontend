import { useState } from "react";

import Header        from "../../components/layout/Header";
import ModuleLayout  from "../../components/layout/ModuleLayout";
import Sidebar       from "../../components/layout/Sidebar";
import SearchBar     from "../../components/shared/SearchBar";
import DataTable     from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal         from "../../components/shared/Modal";

const libros = [
  { id_libro: 1, nombre: "Matemáticas 6", autor: "Santillana", disponible: true },
  { id_libro: 2, nombre: "Lenguaje 7",    autor: "Norma",      disponible: false },
  { id_libro: 3, nombre: "Ciencias 8",    autor: "SM",         disponible: true },
];

export default function TestPage() {

  const [fila,       setFila]       = useState(null);
  const [modal,      setModal]      = useState(false);
  const [formValues, setFormValues] = useState({});

  return (
    <div>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            moduloActual="Inventario Libros"
            modulos={[
              { label: "Uniformes",    path: "/uniformes" },
              { label: "Instrumentos", path: "/instrumentos" },
            ]}
            usuario={{ nombre: "Juan Pérez", rol: "Titular" }}
            onLogout={() => console.log("logout")}
          />
        }
        actions={
          <ActionButtons
            filaSeleccionada={fila}
            botones={[
              { label: "Agregar Libro",  onClick: () => { setFormValues({}); setModal(true); }, siempreActivo: true, variante: "primary" },
              { label: "Editar Libro",   onClick: (f) => { setFormValues(f); setModal(true); },                      variante: "secondary" },
              { label: "Eliminar Libro", onClick: (f) => console.log("eliminar", f),                                variante: "danger" },
            ]}
          />
        }
      >
        <SearchBar
          fields={[
            { key: "documento", label: "Código",          type: "text" },
            { key: "nombre",    label: "Título del Libro",type: "text" },
            { key: "edicion",   label: "Edición",         type: "text" },
          ]}
          onSearch={(f) => console.log(f)}
        />

        <DataTable
          columns={[
            { key: "id_libro", label: "ID" },
            { key: "nombre",   label: "Título del Libro" },
            { key: "autor",    label: "Autor" },
            { key: "disponible", label: "Disponibilidad",
              render: (val) => (
                <span className={val ? "badge--ok" : "badge--no"}>
                  {val ? "Disponible" : "No disponible"}
                </span>
              )
            },
          ]}
          rows={libros}
          onRowClick={(f) => setFila(f)}
        />
      </ModuleLayout>

      <Modal
        title="ASIGNAR LIBRO"
        isOpen={modal}
        fields={[
          { key: "nombre",         label: "Título del Libro", type: "select", options: ["Matemáticas 6","Lenguaje 7","Ciencias 8"] },
          { key: "edicion",        label: "Edición",          type: "text" },
          { key: "fecha_prestamo", label: "Fecha de Entrega", type: "date" },
          { key: "estado",         label: "Estado del Libro", type: "text" },
          { key: "observacion",    label: "Observación",      type: "text" },
        ]}
        values={formValues}
        onChange={(key, val) => setFormValues(p => ({ ...p, [key]: val }))}
        onAccept={() => { console.log(formValues); setModal(false); }}
        onCancel={() => setModal(false)}
      />
    </div>
  );
}