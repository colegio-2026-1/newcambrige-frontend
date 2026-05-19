// por favor, revisa esta pagina de prueba, aqui se detalla como debe ser la base de tu moduloPage, como se llaman los componentes y como funciona cada uno
// esto se hacer para reutilizacion y estandarizacion de codigo, si tu moduloPage no usa los componentes establecidos y no sigue la estructura aqui establecida
// será devuelto para correcion


import { useState } from "react";

import Header from "../../components/layout/header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import SearchBar from "../../components/shared/searchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";
import { useAuth } from "../../api/useAuth";

const libros = [
  { id_libro: 1, nombre: "Matemáticas 6", autor: "Santillana", disponible: true },
  { id_libro: 2, nombre: "Lenguaje 7", autor: "Norma", disponible: false },
  { id_libro: 3, nombre: "Ciencias 8", autor: "SM", disponible: true },
];

export default function TestPage() {
  const { user, logout } = useAuth();

  const [selectedMenu, setSelectedMenu] = useState("Inventario Libros");
  const [fila, setFila] = useState(null);
  const [modal, setModal] = useState(false);
  const [formValues, setFormValues] = useState({});

  const menuItems = [
    "Inventario Libros",
    "Uniformes",
    "Instrumentos",
  ];

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <Header title="ESTO ES UNA PRUEBA BBCITA" />

      {/* Layout base con sidebar, actions y contenido central */}
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            user={user?.nombre || "Usuario"}
            logout={logout}
          />
        }
        actions={
          <ActionButtons
            filaSeleccionada={fila}
            botones={[
              {
                label: "Agregar Libro",
                onClick: () => {
                  setFormValues({});
                  setModal(true);
                },
                siempreActivo: true,
                variante: "primary",
              },
              {
                label: "Editar Libro",
                onClick: (f) => {
                  setFormValues(f);
                  setModal(true);
                },
                variante: "secondary",
              },
              {
                label: "Eliminar Libro",
                onClick: (f) => console.log("eliminar", f),
                variante: "danger",
              },
            ]}
          />
        }
      >
        {/* Contenido principal: SearchBar + DataTable */}
        <SearchBar
          fields={[
            { key: "documento", label: "Código", type: "text" },
            { key: "nombre", label: "Título del Libro", type: "text" },
            { key: "edicion", label: "Edición", type: "text" },
          ]}
          onSearch={(f) => console.log(f)}
        />

        <DataTable
          columns={[
            { key: "id_libro", label: "ID" },
            { key: "nombre", label: "Título del Libro" },
            { key: "autor", label: "Autor" },
            {
              key: "disponible",
              label: "Disponibilidad",
              render: (val) => (
                <span className={val ? "badge--ok" : "badge--no"}>
                  {val ? "Disponible" : "No disponible"}
                </span>
              ),
            },
          ]}
          rows={libros}
          onRowClick={(f) => setFila(f)}
        />
      </ModuleLayout>

      {/* Modal */}
      {modal && (
        <Modal
          title={formValues.id_libro ? "Editar Libro" : "Agregar Libro"}
          onClose={() => setModal(false)}
          onSave={(data) => {
            console.log("Guardar", data);
            setModal(false);
          }}
        >
          {/* Aquí dentro podrías poner un formulario con los campos (solo es un ejemplo bro recuerda) */}
          <div>Formulario para {formValues.id_libro ? "editar" : "nuevo"} libro</div>
        </Modal>
      )}
    </div>
  );
}