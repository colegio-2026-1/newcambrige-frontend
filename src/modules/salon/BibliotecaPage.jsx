import { useState, useEffect } from "react";
import { Home, BookOpen } from "lucide-react";

import {
  getLibrosRequest,
  getPrestamosRequest,
} from "../../api/endpoints";

import Header from "../../components/layout/Header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import SearchBar from "../../components/shared/SearchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";

export default function BibliotecaPage() {

  const [pestanaActiva, setPestanaActiva] = useState("inicio");

  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  const [modal, setModal] = useState(false);

  const [modalTipo, setModalTipo] = useState("agregar");

  const [formValues, setFormValues] = useState({});

  const [loading, setLoading] = useState(true);

  const [modalAsignar, setModalAsignar] = useState(false);

  const [modalDevolver, setModalDevolver] = useState(false);

  const [libros, setLibros] = useState([]);

  const [prestamos, setPrestamos] = useState([]);

  // =========================
  // SIDEBAR
  // =========================

  const menuItems = [
    {
      label: "Inicio",
      icon: <Home />,
      onClick: () => {
        setPestanaActiva("inicio");
        setFilaSeleccionada(null);
      },
    },

    {
      label: "Inventario",
      icon: <BookOpen />,
      onClick: () => {
        setPestanaActiva("libros");
        setFilaSeleccionada(null);
      },
    },
  ];

  // =========================
  // TRAER DATOS
  // =========================

  useEffect(() => {

    const cargarDatos = async () => {

      try {

        setLoading(true);

        // =========================
        // PRÉSTAMOS
        // =========================

        const responsePrestamos =
          await getPrestamosRequest();

        const prestamosFormateados =
          Array.isArray(responsePrestamos.data)

            ? responsePrestamos.data.map((p) => ({
                id: p.id_prestamo,

                codigo: p.codigo || "",

                nombre: p.nombre || "",

                grado: p.grado || "",

                grupo: p.grupo || "",

                titulo_libro: p.libro || "",

                fecha_entrega:
                  p.fecha_devolucion || "",

                estado: p.estado
                  ? "Entregado"
                  : "Pendiente",
              }))

            : [];

        setPrestamos(prestamosFormateados);

      } catch (error) {

        console.error(
          "ERROR PRESTAMOS:",
          error
        );

        setPrestamos([]);

      }

      try {

        // =========================
        // LIBROS
        // =========================

        const responseLibros =
          await getLibrosRequest();

        const librosFormateados =
          Array.isArray(responseLibros.data)

            ? responseLibros.data.map((l) => ({
                id: l.id_libro,

                nombre: l.nombre || "",

                autor: l.autor || "",

                edicion: l.edicion || "",

                disponible: l.disponible
                  ? "Disponible"
                  : "No disponible",

                estado_fisico:
                  l.estado_fisico || "Bueno",
              }))

            : [];

        setLibros(librosFormateados);

      } catch (error) {

        console.error(
          "ERROR LIBROS:",
          error
        );

        setLibros([]);

      } finally {

        setLoading(false);

      }

    };

    cargarDatos();

  }, []);

  // =========================
  // COLUMNAS INICIO
  // =========================

  const columnasInicio = [
    { key: "codigo", label: "CÓDIGO" },

    { key: "nombre", label: "NOMBRE COMPLETO" },

    { key: "grado", label: "GRADO" },

    { key: "grupo", label: "GRUPO" },

    {
      key: "titulo_libro",
      label: "TÍTULO DEL LIBRO",
    },

    {
      key: "fecha_entrega",
      label: "FECHA DE ENTREGA",
    },

    {
      key: "estado",

      label: "ESTADO",

      render: (val) => {

        let className = "badge--ok";

        if (val === "Pendiente") {
          className = "badge--warning";
        }

        if (val === "No asignado") {
          className = "badge--no";
        }

        return (
          <span className={className}>
            {val}
          </span>
        );
      },
    },
  ];

  // =========================
  // COLUMNAS LIBROS
  // =========================

  const columnasLibros = [
    { key: "id", label: "ID" },

    {
      key: "nombre",
      label: "TÍTULO DEL LIBRO",
    },

    { key: "autor", label: "AUTOR" },

    { key: "edicion", label: "EDICIÓN" },

    {
      key: "disponible",

      label: "DISPONIBILIDAD",

      render: (val) => (
        <span
          className={
            val === "Disponible"
              ? "badge--ok"
              : "badge--no"
          }
        >
          {val}
        </span>
      ),
    },

    {
      key: "estado_fisico",
      label: "ESTADO FÍSICO",
    },
  ];

  // =========================
  // CAMPOS MODAL
  // =========================

  const camposModal = [
    {
      key: "nombre",
      label: "Título del Libro",
      type: "text",
    },

    {
      key: "autor",
      label: "Autor",
      type: "text",
    },

    {
      key: "edicion",
      label: "Edición",
      type: "text",
    },

    {
      key: "disponible",

      label: "Disponibilidad",

      type: "select",

      options: [
        "Disponible",
        "No disponible",
      ],
    },

    {
      key: "estado_fisico",

      label: "Estado Físico",

      type: "select",

      options: [
        "Bueno",
        "Regular",
        "Dañado",
        "Muy dañado",
      ],
    },
  ];

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (filtros) => {

    console.log("Filtros:", filtros);

  };

  // =========================
  // MODALES
  // =========================

  const abrirModalAgregar = () => {

    setModalTipo("agregar");

    setFormValues({});

    setModal(true);

  };

  const abrirModalEditar = (fila) => {

    if (!fila) {

      alert(
        "Debes seleccionar un libro"
      );

      return;

    }

    setModalTipo("editar");

    setFormValues(fila);

    setModal(true);

  };

  const cerrarModal = () => {

    setModal(false);

    setFormValues({});

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div>
        Cargando biblioteca...
      </div>
    );

  }

  return (

    <div>

      <style>
        {`
          .badge--ok {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            background: #D4EDDA;
            color: #155724;
            border-radius: 0.4rem;
            font-weight: 600;
            font-size: 0.9rem;
          }

          .badge--warning {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            background: #FFF3CD;
            color: #856404;
            border-radius: 0.4rem;
            font-weight: 600;
            font-size: 0.9rem;
          }

          .badge--no {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            background: #F8D7DA;
            color: #721C24;
            border-radius: 0.4rem;
            font-weight: 600;
            font-size: 0.9rem;
          }
        `}
      </style>

      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout

        sidebar={

          <Sidebar
            menuItems={menuItems}

            selectedMenu={
              pestanaActiva === "inicio"
                ? "Inicio"
                : "Inventario"
            }

            setSelectedMenu={(menu) => {

              if (menu === "Inicio") {
                setPestanaActiva("inicio");
              }

              if (menu === "Inventario") {
                setPestanaActiva("libros");
              }

              setFilaSeleccionada(null);

            }}

            user="Nombre usuario"

            logout={() =>
              console.log("logout")
            }
          />

        }

        actions={

          <ActionButtons

            filaSeleccionada={
              filaSeleccionada
            }

            botones={
              pestanaActiva === "inicio"

                ? [

                    {
                      label:
                        "Asignar Libro",

                      onClick: () =>
                        setModalAsignar(true),

                      variante:
                        "primary",
                    },

                    {
                      label:
                        "Devolver Libro",

                      onClick: () =>
                        setModalDevolver(true),

                      variante:
                        "secondary",
                    },
                  ]

                : [

                    {
                      label:
                        "Agregar Libro",

                      onClick:
                        abrirModalAgregar,

                      siempreActivo: true,

                      variante:
                        "primary",
                    },

                    {
                      label:
                        "Editar Libro",

                      onClick: () =>
                        abrirModalEditar(
                          filaSeleccionada
                        ),

                      variante:
                        "secondary",
                    },

                    {
                      label:
                        "Eliminar Libro",

                      onClick: () => {

                        if (
                          !filaSeleccionada
                        ) {

                          alert(
                            "Debes seleccionar un libro"
                          );

                          return;

                        }

                        alert(
                          "Libro eliminado"
                        );

                      },

                      variante:
                        "danger",
                    },
                  ]
            }

          />

        }

      >

        {/* ========================= */}
        {/* PESTAÑA INICIO */}
        {/* ========================= */}

        {pestanaActiva === "inicio" && (

          <div>

            <SearchBar

              loading={loading}

              onSearch={handleSearch}

              fields={[

                {
                  key: "codigo",
                  label: "Código",
                  type: "text",
                },

                {
                  key: "nombre",
                  label: "Nombre",
                  type: "text",
                },

                {
                  key: "grado",
                  label: "Grado",
                  type: "select",

                  options: [
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                  ],
                },

                {
                  key: "grupo",
                  label: "Grupo",
                  type: "select",

                  options: [
                    "A",
                    "B",
                    "C",
                  ],
                },

                {
                  key: "anio",
                  label: "Año",
                  type: "select",

                  options: [
                    "2023",
                    "2024",
                    "2025",
                    "2026",
                  ],
                },
              ]}
            />

            <div
              style={{
                marginTop: "1rem",

                background: "#FFFFFF",

                borderRadius: "0.8rem",

                overflow: "hidden",

                border:
                  "1px solid #D9D9D9",
              }}
            >

              <DataTable
                columns={columnasInicio}

                rows={prestamos}

                emptyText="No hay préstamos"

                onRowClick={(f) =>
                  setFilaSeleccionada(f)
                }
              />

            </div>

          </div>

        )}

        {/* ========================= */}
        {/* PESTAÑA LIBROS */}
        {/* ========================= */}

        {pestanaActiva === "libros" && (

          <div>

            <SearchBar

              loading={loading}

              onSearch={handleSearch}

              fields={[

                {
                  key: "nombre",
                  label:
                    "Título del Libro",

                  type: "text",
                },

                {
                  key: "autor",
                  label: "Autor",
                  type: "text",
                },

                {
                  key: "edicion",
                  label: "Edición",
                  type: "text",
                },
              ]}
            />

            <div
              style={{
                marginTop: "1rem",

                background: "#FFFFFF",

                borderRadius: "0.8rem",

                overflow: "hidden",

                border:
                  "1px solid #D9D9D9",
              }}
            >

              <DataTable
                columns={columnasLibros}

                rows={libros}

                emptyText="No hay libros"

                onRowClick={(f) =>
                  setFilaSeleccionada(f)
                }
              />

            </div>

          </div>

        )}

      </ModuleLayout>

      {/* ========================= */}
      {/* MODAL */}
      {/* ========================= */}

      <Modal
        title={
          modalTipo === "agregar"
            ? "AGREGAR LIBRO"
            : "EDITAR LIBRO"
        }

        isOpen={modal}

        fields={camposModal}

        values={formValues}

        onChange={(key, val) =>
          setFormValues((p) => ({
            ...p,
            [key]: val,
          }))
        }

        onAccept={() => {

          console.log(formValues);

          cerrarModal();

        }}

        onCancel={cerrarModal}
      />

    </div>

  );

}