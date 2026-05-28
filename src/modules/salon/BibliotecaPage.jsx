import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";

import {
  getLibrosRequest,
  getPrestamosRequest,
  createLibroRequest,
  updateLibroRequest,
  deleteLibroRequest,
  allsalonesRequest,
  allaniosacademicosRequest,
} from "../../api/endpoints";

import Header from "../../components/layout/Header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import SearchBar from "../../components/shared/SearchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";

export default function BibliotecaPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [pestanaActiva, setPestanaActiva] = useState("inicio");

  const [selectedMenu, setSelectedMenu] = useState("Inicio");

  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  const [modal, setModal] = useState(false);

  const [modalTipo, setModalTipo] = useState("agregar");

  const [formValues, setFormValues] = useState({});

  const [loading, setLoading] = useState(true);

  const [libros, setLibros] = useState([]);

  const [librosFiltered, setLibrosFiltered] = useState([]);

  const [prestamos, setPrestamos] = useState([]);

  const [prestamosFiltered, setPrestamosFiltered] = useState([]);

  const [salones, setSalones] = useState([]);

  const [periodos, setPeriodos] = useState([]);

  const [error, setError] = useState(null);

  // =========================
  // MAPS
  // =========================

  const salonesMap = {};

  salones.forEach((s) => {
    salonesMap[s.id_salon] = s;
  });

  const periodosMap = {};

  periodos.forEach((p) => {
    periodosMap[p.id_periodo] = p;
  });

  // =========================
  // SIDEBAR
  // =========================

  const menuItems = [
    {
      label: "Inicio",
      icon: <Home />,
      path: "/biblioteca/inicio",
    },
    {
      label: "Inventario",
      icon: <BookOpen />,
      path: "/biblioteca/inventario",
    },
  ];

  // =========================
  // SINCRONIZAR RUTA
  // =========================

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.includes("inventario")) {
      setPestanaActiva("libros");
      setSelectedMenu("Inventario");
    } else {
      setPestanaActiva("inicio");
      setSelectedMenu("Inicio");
    }

    setFilaSeleccionada(null);
  }, [location.pathname]);

  // =========================
  // CARGAR DATOS
  // =========================

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setLoading(true);

        await Promise.all([
          cargarPrestamos(),
          cargarLibros(),
          cargarSalones(),
          cargarPeriodos(),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, []);

  // =========================
  // CARGAR PRÉSTAMOS
  // =========================

  const cargarPrestamos = async () => {
    try {
      const response = await getPrestamosRequest();

      const prestamosFormateados = Array.isArray(response.data)
        ? response.data.map((p) => ({
            id_prestamo: p.id_prestamo,
            codigo: p.codigo || "",
            nombre: p.nombre || "",
            grado: p.grado || "",
            grupo: p.grupo || "",
            titulo_libro: p.libro || "",
            fecha_prestamo: p.fecha_prestamo || "",
            fecha_entrega: p.fecha_devolucion || "",
            estado: p.estado ? "Devuelto" : "Prestado",
          }))
        : [];

      setPrestamos(prestamosFormateados);

      setPrestamosFiltered(prestamosFormateados);
    } catch (error) {
      console.error("ERROR PRESTAMOS:", error);

      setPrestamos([]);

      setPrestamosFiltered([]);
    }
  };

  // =========================
  // CARGAR LIBROS
  // =========================

  const cargarLibros = async () => {
    try {
      const response = await getLibrosRequest();

      const librosFormateados = Array.isArray(response.data)
        ? response.data.map((l) => ({
            id: l.id_libro,
            nombre: l.nombre || "",
            autor: l.autor || "",
            edicion: l.edicion || "",
            disponible: l.disponible
              ? "Disponible"
              : "Prestado",
            estado_fisico:
              l.estado_fisico || "Excelente",
          }))
        : [];

      setLibros(librosFormateados);

      setLibrosFiltered(librosFormateados);
    } catch (error) {
      console.error("ERROR LIBROS:", error);

      setLibros([]);

      setLibrosFiltered([]);
    }
  };

  // =========================
  // CARGAR SALONES
  // =========================

  const cargarSalones = async () => {
    try {
      const response = await allsalonesRequest();

      setSalones(response.data || []);
    } catch (error) {
      console.error(
        "Error cargando salones:",
        error
      );
    }
  };

  // =========================
  // CARGAR PERIODOS
  // =========================

  const cargarPeriodos = async () => {
    try {
      const response =
        await allaniosacademicosRequest();

      setPeriodos(response.data || []);
    } catch (error) {
      console.error(
        "Error cargando periodos:",
        error
      );
    }
  };

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

        if (val === "Prestado") {
          className = "badge--warning";
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
  // FILTRAR PRÉSTAMOS
  // =========================

  const FiltrarPrestamos = (filtros) => {
    let filtered = prestamos;

    // CÓDIGO
    if (filtros.codigo) {
      filtered = filtered.filter((r) =>
        r.codigo
          ?.toString()
          .includes(filtros.codigo)
      );
    }

    // NOMBRE
    if (filtros.nombre) {
      filtered = filtered.filter((r) =>
        r.nombre
          ?.toLowerCase()
          .includes(
            filtros.nombre.toLowerCase()
          )
      );
    }

    // GRADO
    if (filtros.grado) {
      filtered = filtered.filter(
        (r) =>
          r.grado?.toString() ===
          filtros.grado.toString()
      );
    }

    // GRUPO
    if (filtros.grupo) {
      filtered = filtered.filter(
        (r) =>
          r.grupo?.toString() ===
          filtros.grupo.toString()
      );
    }

    // PERIODO
    if (filtros.periodo) {
      filtered = filtered.filter((r) => {
        const salon = Object.values(
          salonesMap
        ).find(
          (s) =>
            s.grado?.toString() ===
              r.grado?.toString() &&
            s.grupo?.toString() ===
              r.grupo?.toString()
        );

        const periodo =
          periodosMap[salon?.id_periodo];

        return (
          periodo?.nombre?.toString() ===
          filtros.periodo.toString()
        );
      });
    }

    setPrestamosFiltered(filtered);
  };

  // =========================
  // FILTRAR LIBROS
  // =========================

  const FiltrarLibros = (filtros) => {
    let filtered = libros;

    // NOMBRE
    if (filtros.nombre) {
      filtered = filtered.filter((l) =>
        l.nombre
          ?.toLowerCase()
          .includes(
            filtros.nombre.toLowerCase()
          )
      );
    }

    // AUTOR
    if (filtros.autor) {
      filtered = filtered.filter((l) =>
        l.autor
          ?.toLowerCase()
          .includes(
            filtros.autor.toLowerCase()
          )
      );
    }

    // EDICIÓN
    if (filtros.edicion) {
      filtered = filtered.filter((l) =>
        l.edicion
          ?.toString()
          .includes(filtros.edicion)
      );
    }

    setLibrosFiltered(filtered);
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
      alert("Debes seleccionar un libro");
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
  // GUARDAR LIBRO
  // =========================

  const handleGuardarLibro = async () => {
    try {
      if (modalTipo === "agregar") {
        await createLibroRequest({
          nombre: formValues.nombre,
          autor: formValues.autor,
          edicion: formValues.edicion,
          disponible:
            formValues.disponible ===
            "Disponible",
          estado_fisico:
            formValues.estado_fisico,
        });
      } else {
        await updateLibroRequest(
          formValues.id,
          {
            nombre: formValues.nombre,
            autor: formValues.autor,
            edicion: formValues.edicion,
            disponible:
              formValues.disponible ===
              "Disponible",
            estado_fisico:
              formValues.estado_fisico,
          }
        );
      }

      await cargarLibros();

      cerrarModal();
    } catch (error) {
      console.error(
        "Error guardando libro:",
        error
      );

      alert(
        "Error guardando libro"
      );
    }
  };

  // =========================
  // ELIMINAR LIBRO
  // =========================

  const handleEliminarLibro = async () => {
    try {
      if (!filaSeleccionada) {
        alert(
          "Debes seleccionar un libro"
        );

        return;
      }

      await deleteLibroRequest(
        filaSeleccionada.id
      );

      await cargarLibros();

      setFilaSeleccionada(null);
    } catch (error) {
      console.error(
        "Error eliminando libro:",
        error
      );

      alert(
        "Error eliminando libro"
      );
    }
  };

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
        "Prestado",
      ],
    },

    {
      key: "estado_fisico",
      label: "Estado Físico",
      type: "select",

      options: [
        "Excelente",
        "Regular",
        "Malo",
      ],
    },
  ];

  // =========================
  // LOADING / ERROR
  // =========================

  if (loading) {
    return (
      <div>
        Cargando biblioteca...
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Error cargando datos:
        {error}
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

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
            selectedMenu={selectedMenu}
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
              pestanaActiva ===
              "inicio"
                ? [
                    {
                      label:
                        "Asignar Libro",
                      onClick: () =>
                        console.log(
                          "Asignar"
                        ),
                      variante:
                        "primary",
                    },
                    {
                      label:
                        "Devolver Libro",
                      onClick: () =>
                        console.log(
                          "Devolver"
                        ),
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
                      onClick:
                        handleEliminarLibro,
                      variante:
                        "danger",
                    },
                  ]
            }
          />
        }
      >
        {/* ========================= */}
        {/* INICIO */}
        {/* ========================= */}

        {pestanaActiva ===
          "inicio" && (
          <div>
            <SearchBar
              loading={loading}
              onSearch={
                FiltrarPrestamos
              }
              fields={[
                {
                  key: "codigo",
                  label: "Código",
                  type: "text",

                  onInput: (e) => {
                    e.target.value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );
                  },
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

                  options: Array.from(
                    new Set(
                      Object.values(
                        salonesMap
                      )
                        .map(
                          (s) =>
                            s.grado
                        )
                        .filter(
                          Boolean
                        )
                    )
                  ),
                },

                {
                  key: "grupo",
                  label: "Grupo",
                  type: "select",

                  options: Array.from(
                    new Set(
                      Object.values(
                        salonesMap
                      )
                        .map(
                          (s) =>
                            s.grupo
                        )
                        .filter(
                          Boolean
                        )
                    )
                  ),
                },

                {
                  key: "periodo",
                  label: "Periodo",
                  type: "select",

                  options: Array.from(
                    new Set(
                      Object.values(
                        periodosMap
                      )
                        .map(
                          (p) =>
                            p.nombre
                        )
                        .filter(
                          Boolean
                        )
                    )
                  ),
                },
              ]}
            />

            <div
              style={{
                marginTop: "1rem",
                background:
                  "#FFFFFF",
                borderRadius:
                  "0.8rem",
                overflow: "hidden",
                border:
                  "1px solid #D9D9D9",
              }}
            >
              <DataTable
                columns={
                  columnasInicio
                }
                rows={
                  prestamosFiltered
                }
                emptyText="No hay préstamos"
                onRowClick={(f) =>
                  setFilaSeleccionada(
                    f
                  )
                }
              />
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* INVENTARIO */}
        {/* ========================= */}

        {pestanaActiva ===
          "libros" && (
          <div>
            <SearchBar
              loading={loading}
              onSearch={
                FiltrarLibros
              }
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
                  label:
                    "Edición",
                  type: "text",
                },
              ]}
            />

            <div
              style={{
                marginTop: "1rem",
                background:
                  "#FFFFFF",
                borderRadius:
                  "0.8rem",
                overflow: "hidden",
                border:
                  "1px solid #D9D9D9",
              }}
            >
              <DataTable
                columns={
                  columnasLibros
                }
                rows={
                  librosFiltered
                }
                emptyText="No hay libros"
                onRowClick={(f) =>
                  setFilaSeleccionada(
                    f
                  )
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
        onAccept={
          handleGuardarLibro
        }
        onCancel={cerrarModal}
      />
    </div>
  );
}