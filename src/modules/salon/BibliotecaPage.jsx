import { useState } from "react";

import Header from "../../components/layout/Header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import SearchBar from "../../components/shared/SearchBar";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal from "../../components/shared/Modal";

import userIcon from "../../assets/Login/usuario_login.svg";

export default function BibliotecaPage() {

  const [pestanaActiva, setPestanaActiva] = useState("inicio");
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalTipo, setModalTipo] = useState("agregar"); // agregar, editar
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [modalDevolver, setModalDevolver] = useState(false);

  // DATOS PARA TABLA INVENTARIO DE LIBROS
  const libros = [
    { id: 1, nombre: "Matemáticas 6", autor: "Santillana", edicion: "3era", disponible: "Disponible", estado_fisico: "Bueno" },
    { id: 2, nombre: "Lenguaje 7", autor: "Norma", edicion: "2da", disponible: "No disponible", estado_fisico: "Dañado" },
    { id: 3, nombre: "Ciencias 8", autor: "SM", edicion: "1era", disponible: "Disponible", estado_fisico: "Bueno" },
    { id: 4, nombre: "Historia 9", autor: "Santillana", edicion: "2da", disponible: "Disponible", estado_fisico: "Regular" },
    { id: 5, nombre: "Inglés 10", autor: "Oxford", edicion: "4ta", disponible: "No disponible", estado_fisico: "Muy dañado" },
  ];

  // DATOS PARA TABLA INICIO (INFORMACIÓN DE ESTUDIANTES Y LIBROS)
  const estadisticas = [
    { id: 1, codigo: "5301", nombre: "Juan Pérez López", grado: "6", grupo: "A", titulo_libro: "Matemáticas 6", fecha_entrega: "15/05/2026", estado: "Entregado" },
    { id: 2, codigo: "5302", nombre: "María García Rodríguez", grado: "7", grupo: "B", titulo_libro: "Lenguaje 7", fecha_entrega: "14/05/2026", estado: "Entregado" },
    { id: 3, codigo: "5303", nombre: "Carlos López Martínez", grado: "8", grupo: "A", titulo_libro: "Ciencias 8", fecha_entrega: "13/05/2026", estado: "Pendiente" },
    { id: 4, codigo: "5304", nombre: "Laura Gómez Sánchez", grado: "9", grupo: "C", titulo_libro: "Historia 9", fecha_entrega: "12/05/2026", estado: "Entregado" },
    { id: 5, codigo: "5305", nombre: "Pedro Díaz Martínez", grado: "10", grupo: "B", titulo_libro: "Inglés 10", fecha_entrega: "", estado: "No asignado" },
  ];

  // COLUMNAS PARA TABLA INICIO
  const columnasInicio = [
    { key: "codigo", label: "CÓDIGO" },
    { key: "nombre", label: "NOMBRE COMPLETO" },
    { key: "grado", label: "GRADO" },
    { key: "grupo", label: "GRUPO" },
    { key: "titulo_libro", label: "TÍTULO DEL LIBRO" },
    { key: "fecha_entrega", label: "FECHA DE ENTREGA" },
    {
      key: "estado",
      label: "ESTADO",
      render: (val) => {
        let className = "badge--ok";
        if (val === "Pendiente") className = "badge--warning";
        if (val === "No asignado") className = "badge--no";
        return <span className={className}>{val}</span>;
      },
    },
  ];

  // COLUMNAS PARA TABLA INVENTARIO DE LIBROS
  const columnasLibros = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "TÍTULO DEL LIBRO" },
    { key: "autor", label: "AUTOR" },
    { key: "edicion", label: "EDICIÓN" },
    {
      key: "disponible",
      label: "DISPONIBILIDAD",
      render: (val) => (
        <span className={val === "Disponible" ? "badge--ok" : "badge--no"}>
          {val}
        </span>
      ),
    },
    { key: "estado_fisico", label: "ESTADO FÍSICO" },
  ];

  // CAMPOS DEL MODAL
  const camposModal = [
    { key: "nombre", label: "Título del Libro", type: "text" },
    { key: "autor", label: "Autor", type: "text" },
    { key: "edicion", label: "Edición", type: "text" },
    { key: "disponible", label: "Disponibilidad", type: "select", options: ["Disponible", "No disponible"] },
    { key: "estado_fisico", label: "Estado Físico", type: "select", options: ["Bueno", "Regular", "Dañado", "Muy dañado"] },
  ];

  // CAMPOS PARA MODAL ASIGNAR LIBRO
  const camposAsignar = [
    { key: "titulo_libro", label: "Título del Libro", type: "text" },
    { key: "edicion", label: "Edición", type: "text" },
    { key: "fecha_entrega", label: "Fecha de Entrega", type: "date" },
    { key: "estado_libro", label: "Estado del Libro", type: "text" },
    { key: "observacion", label: "Observación", type: "text" },
  ];

  // CAMPOS PARA MODAL DEVOLVER LIBRO
  const camposDevolver = [
    { key: "titulo_libro", label: "Título del Libro", type: "text" },
    { key: "edicion", label: "Edición", type: "text" },
    { key: "fecha_entrega", label: "Fecha de Entrega", type: "date" },
    { key: "fecha_devolucion", label: "Fecha de Devolución", type: "date" },
    { key: "estado_entrega", label: "Estado de Entrega", type: "text" },
    { key: "estado_devolucion", label: "Estado de Devolución", type: "text" },
    { key: "observacion", label: "Observación", type: "text" },
  ];

  const handleSearch = (filtros) => {
    console.log("Filtros aplicados:", filtros);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // MANEJADORES PARA MODAL
  const abrirModalAgregar = () => {
    setModalTipo("agregar");
    setFormValues({});
    setModal(true);
  };

  const abrirModalEditar = (fila) => {
    if (!fila) {
      alert("Debes seleccionar una fila");
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

  const handleModalSubmit = () => {
    console.log(`Libro ${modalTipo === "agregar" ? "agregado" : "editado"}:`, formValues);
    cerrarModal();
  };

  const handleEliminar = (fila) => {
    if (!fila) {
      alert("Debes seleccionar una fila");
      return;
    }

    // Validar si el libro tiene préstamo activo
    if (fila.disponible === "No disponible") {
      alert("NO ES POSIBLE ELIMINAR UN LIBRO CON PRÉSTAMO ACTIVO.");
      return;
    }

    // Si pasa la validación, mostrar confirmación
    const confirmacion = window.confirm(
      `¿CONFIRMAS ELIMINAR EL LIBRO\n[${fila.nombre}] DE [${fila.autor}]?`
    );

    if (confirmacion) {
      console.log("Libro eliminado:", fila);
      alert("Libro eliminado exitosamente");
    }
  };

  // MANEJADORES PARA ASIGNAR Y DEVOLVER LIBRO
  const abrirModalAsignar = () => {
    if (!filaSeleccionada) {
      alert("Debes seleccionar una fila");
      return;
    }
    setFormValues({
      titulo_libro: filaSeleccionada.titulo_libro || "",
      edicion: "",
      fecha_entrega: "",
      estado_libro: "",
      observacion: "",
    });
    setModalAsignar(true);
  };

  const abrirModalDevolver = () => {
    if (!filaSeleccionada) {
      alert("Debes seleccionar una fila");
      return;
    }
    setFormValues({
      titulo_libro: filaSeleccionada.titulo_libro || "",
      edicion: "",
      fecha_entrega: filaSeleccionada.fecha_entrega || "",
      fecha_devolucion: "",
      estado_entrega: "",
      estado_devolucion: "",
      observacion: "",
    });
    setModalDevolver(true);
  };

  const cerrarModalAsignar = () => {
    setModalAsignar(false);
    setFormValues({});
  };

  const cerrarModalDevolver = () => {
    setModalDevolver(false);
    setFormValues({});
  };

  const handleAsignarLibro = () => {
    console.log("Libro asignado:", formValues);
    cerrarModalAsignar();
  };

  const handleDevolverLibro = () => {
    console.log("Libro devuelto:", formValues);
    cerrarModalDevolver();
  };

  return (
    <div>

      <style>
        {`
    .biblioteca-tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid #D9D9D9;
      margin-bottom: 1.5rem;
      background: #FFFFFF;
      border-radius: 0.8rem 0.8rem 0 0;
      overflow: hidden;
    }

    .biblioteca-tab {
      padding: 1rem 2rem;
      cursor: pointer;
      border: none;
      background: transparent;
      font-size: 1rem;
      font-weight: 600;
      color: #666;
      transition: all 0.3s ease;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
    }

    .biblioteca-tab:hover {
      color: #2E5FA7;
      background: #F5F5F5;
    }

    .biblioteca-tab--activa {
      color: #2E5FA7;
      border-bottom-color: #2E5FA7;
    }

    .biblioteca-contenido {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .action-btn--primary:hover{
      background: #2E5FA7 !important;
      transform: translateY(2px);
    }

    .action-btn--secondary:hover{
      background: #6C757D !important;
      transform: translateY(2px);
    }

    .action-btn--danger:hover{
      background: #DC3545 !important;
      transform: translateY(2px);
    }

    .datatable-row--selected td{
      background: #E8E3E3 !important;
    }

    .datatable-row--selected .datatable-td-check{
      background: #E8E3E3 !important;
    }

    .datatable-check{
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem !important;
      font-weight: bold;
      width: 100%;
      color: #2E5FA7 !important;
    }

    .datatable-td-check{
      width: 50px !important;
      min-width: 50px !important;
      max-width: 50px !important;
      text-align: center !important;
      padding: 0.75rem !important;
      background: #FFFFFF;
    }

    .datatable-row--selected .datatable-td-check {
      background: #E8E3E3 !important;
    }

    .datatable-row--clickable{
      cursor: pointer;
    }

    .datatable-row--clickable:hover {
      background-color: #F5F5F5 !important;
    }

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

      {/* HEADER */}
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      {/* LAYOUT */}
      <ModuleLayout
        sidebar={
          <Sidebar
            moduloActual="Biblioteca"
            modulos={[]}
            usuario={{
              nombre: "Nombre usuario",
              rol: "Titular",
            }}
            userIcon={userIcon}
            onLogout={() => console.log("logout")}
          />
        }

        actions={
          <ActionButtons
            filaSeleccionada={filaSeleccionada}
            botones={
              pestanaActiva === "inicio"
                ? [
                    {
                      label: "Asignar Libro",
                      onClick: abrirModalAsignar,
                      variante: "primary",
                    },
                    {
                      label: "Devolver Libro",
                      onClick: abrirModalDevolver,
                      variante: "secondary",
                    },
                  ]
                : [
                    {
                      label: "Agregar Libro",
                      onClick: abrirModalAgregar,
                      siempreActivo: true,
                      variante: "primary",
                    },
                    {
                      label: "Editar Libro",
                      onClick: () => abrirModalEditar(filaSeleccionada),
                      variante: "secondary",
                    },
                    {
                      label: "Eliminar Libro",
                      onClick: () => handleEliminar(filaSeleccionada),
                      variante: "danger",
                    },
                  ]
            }
          />
        }
      >

        {/* PESTAÑAS */}
        <div className="biblioteca-tabs">
          <button
            className={`biblioteca-tab ${pestanaActiva === "inicio" ? "biblioteca-tab--activa" : ""}`}
            onClick={() => {
              setPestanaActiva("inicio");
              setFilaSeleccionada(null);
            }}
          >
            Inicio
          </button>
          <button
            className={`biblioteca-tab ${pestanaActiva === "libros" ? "biblioteca-tab--activa" : ""}`}
            onClick={() => {
              setPestanaActiva("libros");
              setFilaSeleccionada(null);
            }}
          >
            Inventario de Libros
          </button>
        </div>

        {/* CONTENIDO PESTAÑA INICIO */}
        {pestanaActiva === "inicio" && (
          <div className="biblioteca-contenido">
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
                  options: ["6", "7", "8", "9", "10", "11"],
                },
                {
                  key: "grupo",
                  label: "Grupo",
                  type: "select",
                  options: ["A", "B", "C"],
                },
              ]}
            />

            <div
              style={{
                marginTop: "1rem",
                background: "#FFFFFF",
                borderRadius: "0.8rem",
                overflow: "hidden",
                border: "1px solid #D9D9D9",
              }}
            >
              <DataTable
                columns={columnasInicio}
                rows={estadisticas}
                emptyText="No hay datos de estudiantes"
                onRowClick={(f) => setFilaSeleccionada(f)}
              />
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA INVENTARIO DE LIBROS */}
        {pestanaActiva === "libros" && (
          <div className="biblioteca-contenido">
            <SearchBar
              loading={loading}
              onSearch={handleSearch}
              fields={[
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
                  options: ["Disponible", "No disponible"],
                },
              ]}
            />

            <div
              style={{
                marginTop: "1rem",
                background: "#FFFFFF",
                borderRadius: "0.8rem",
                overflow: "hidden",
                border: "1px solid #D9D9D9",
              }}
            >
              <DataTable
                columns={columnasLibros}
                rows={libros}
                emptyText="No se encontraron libros"
                onRowClick={(f) => setFilaSeleccionada(f)}
              />
            </div>
          </div>
        )}

      </ModuleLayout>

      {/* MODAL INVENTARIO DE LIBROS */}
      <Modal
        title={modalTipo === "agregar" ? "AGREGAR LIBRO" : "EDITAR LIBRO"}
        isOpen={modal}
        fields={camposModal}
        values={formValues}
        onChange={(key, val) => setFormValues((p) => ({ ...p, [key]: val }))}
        onAccept={handleModalSubmit}
        onCancel={cerrarModal}
      />

      {/* MODAL ASIGNAR LIBRO */}
      <Modal
        title="ASIGNAR LIBRO"
        isOpen={modalAsignar}
        fields={camposAsignar}
        values={formValues}
        onChange={(key, val) => setFormValues((p) => ({ ...p, [key]: val }))}
        onAccept={handleAsignarLibro}
        onCancel={cerrarModalAsignar}
      />

      {/* MODAL DEVOLVER LIBRO */}
      <Modal
        title="DEVOLVER LIBRO"
        isOpen={modalDevolver}
        fields={camposDevolver}
        values={formValues}
        onChange={(key, val) => setFormValues((p) => ({ ...p, [key]: val }))}
        onAccept={handleDevolverLibro}
        onCancel={cerrarModalDevolver}
      />
    </div>
  );
}