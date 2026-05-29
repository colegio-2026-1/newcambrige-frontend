import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Home, BookOpen } from "lucide-react";
import { useAuth } from "../../api/useAuth";

import {
  getLibrosRequest,
  getPrestamosRequest,
  createLibroRequest,
  updateLibroRequest,
  deleteLibroRequest,
  allsalonesRequest,
  allaniosacademicosRequest,
  asignarLibroRequest,
  devolverLibroRequest,
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

  // ── UI ──────────────────────────────────────────────────────────────────
  const [pestanaActiva, setPestanaActiva]       = useState("inicio");
  const [selectedMenu, setSelectedMenu]         = useState("Inicio");
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  // ── Modal ────────────────────────────────────────────────────────────────
  const [modal, setModal]                 = useState(false);
  const [modalTipo, setModalTipo]         = useState("agregar");
  const [formValues, setFormValues]       = useState({});
  // Guardamos el ID del préstamo activo de forma segura para la devolución
  const [prestamoIdActivo, setPrestamoIdActivo] = useState(null);

  // ── Datos ────────────────────────────────────────────────────────────────
  const [loading, setLoading]                     = useState(true);
  const [error, setError]                         = useState(null);
  const [libros, setLibros]                       = useState([]);
  const [librosFiltered, setLibrosFiltered]       = useState([]);
  const [prestamos, setPrestamos]                 = useState([]);
  const [prestamosFiltered, setPrestamosFiltered] = useState([]);
  const [salones, setSalones]                     = useState([]);
  const [periodos, setPeriodos]                   = useState([]);

  // ── Maps auxiliares ──────────────────────────────────────────────────────
  const salonesMap  = Object.fromEntries(salones.map((s) => [s.id_salon, s]));
  const periodosMap = Object.fromEntries(periodos.map((p) => [p.id_periodo, p]));
  const { user, logout } = useAuth();
  // ── Sidebar ──────────────────────────────────────────────────────────────
  const menuItems = [
    { label: "Inicio",     icon: <Home />,     path: "/biblioteca/inicio" },
    { label: "Inventario", icon: <BookOpen />, path: "/biblioteca/inventario" },
  ];

  // ── Sync ruta → pestaña ──────────────────────────────────────────────────
  useEffect(() => {
    if (location.pathname.includes("inventario")) {
      setPestanaActiva("libros");
      setSelectedMenu("Inventario");
    } else {
      setPestanaActiva("inicio");
      setSelectedMenu("Inicio");
    }
    setFilaSeleccionada(null);
  }, [location.pathname]);

  // ── Carga inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    const cargarTodo = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([
          cargarPrestamos(),
          cargarLibros(),
          cargarSalones(),
          cargarPeriodos(),
        ]);
      } catch (err) {
        console.error(err);
        setError("Error al comunicar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    cargarTodo();
  }, []);

  // ── Cargar préstamos ─────────────────────────────────────────────────────
  const cargarPrestamos = async () => {
    try {
      const { data } = await getPrestamosRequest();
      console.log("RAW BACKEND:", JSON.stringify(data?.[0], null, 2));
      const formateados = Array.isArray(data)
        ? data.map((p) => ({
            id:             p.id_prestamo,
            id_prestamo:    p.id_prestamo,
            codigo:         p.codigo  ?? "",
            nombre:         p.nombre  ?? "",
            grado:          p.grado   ?? "",
            grupo:          p.grupo   ?? "",
            titulo_libro:   p.libro   ?? "",          // backend devuelve "libro"
            fecha_prestamo: p.fecha_prestamo    ?? "",
            fecha_entrega:  p.fecha_devolucion  ?? "", // fecha pactada de devolución
            // Normalizamos el estado a string legible
            estado:
              p.estado === "Devuelto" || p.estado === true || p.estado === "true"
                ? "Devuelto"
                : "Prestado",
          }))
        : [];
      setPrestamos(formateados);
      setPrestamosFiltered(formateados);
    } catch (err) {
      console.error("ERROR PRESTAMOS:", err);
      setPrestamos([]);
      setPrestamosFiltered([]);
    }
  };

  // ── Cargar libros ────────────────────────────────────────────────────────
  const cargarLibros = async () => {
    try {
      const { data } = await getLibrosRequest();
      const formateados = Array.isArray(data)
        ? data
            .filter((l) => !l.nombre?.includes("(Eliminado del Inventario)"))
            .map((l) => ({
              id:           l.id_libro,
              nombre:       l.nombre       ?? "",
              autor:        l.autor        ?? "",
              edicion:      l.edicion      ?? "",
              disponible:   l.disponible ? "Disponible" : "Prestado",
              estado_fisico: l.estado_fisico ?? "Excelente",
            }))
        : [];
      setLibros(formateados);
      setLibrosFiltered(formateados);
    } catch (err) {
      console.error("ERROR LIBROS:", err);
      setLibros([]);
      setLibrosFiltered([]);
    }
  };

  const cargarSalones = async () => {
    try {
      const { data } = await allsalonesRequest();
      setSalones(data ?? []);
    } catch (err) {
      console.error("Error cargando salones:", err);
    }
  };

  const cargarPeriodos = async () => {
    try {
      const { data } = await allaniosacademicosRequest();
      setPeriodos(data ?? []);
    } catch (err) {
      console.error("Error cargando periodos:", err);
    }
  };

  // ── Abrir modales ────────────────────────────────────────────────────────
  const abrirModalAsignar = () => {
    setModalTipo("asignar");
    setFormValues({
      codigo:         "",
      nombre:         "",
      titulo_libro:   "",
      fecha_entrega:  "",
      estado_del_libro: "Excelente",
      observacion:    "",
    });
    setModal(true);
  };

  const abrirModalDevolver = () => {
    console.log("FILA COMPLETA:", JSON.stringify(filaSeleccionada, null, 2));
    if (!filaSeleccionada) {
      alert("Por favor, selecciona un registro de préstamo en la tabla primero.");
      return;
    }
    if (filaSeleccionada.estado === "Devuelto") {
      alert("Este libro ya figura como devuelto en el sistema.");
      return;
    }

    const id = filaSeleccionada.id_prestamo ?? filaSeleccionada.id;
    if (!id) {
      alert("Error interno: La fila seleccionada no contiene un ID válido.");
      return;
    }

    setPrestamoIdActivo(id);
    setModalTipo("devolver");
    setFormValues({
      titulo_libro:         filaSeleccionada.titulo_libro,
      fecha_entrega:        filaSeleccionada.fecha_entrega,
      fecha_devolucion:     new Date().toISOString().split("T")[0],
      estado_de_devolucion: "Excelente",
      observacion:          "",
    });
    setModal(true);
  };

  const abrirModalAgregar = () => {
    setModalTipo("agregar");
    setFormValues({
      nombre:       "",
      autor:        "",
      edicion:      "",
      disponible:   "Disponible",
      estado_fisico: "Excelente",
    });
    setModal(true);
  };

  const abrirModalEditar = () => {
    if (!filaSeleccionada) { alert("Debes seleccionar un libro."); return; }
    setModalTipo("editar");
    setFormValues(filaSeleccionada);
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    setFormValues({});
    setPrestamoIdActivo(null);
  };

  // ── Guardar / procesar ───────────────────────────────────────────────────
  const handleGuardarTodo = async () => {
    try {
      if (modalTipo === "agregar") {
        await createLibroRequest({
          nombre:       formValues.nombre,
          autor:        formValues.autor,
          edicion:      formValues.edicion,
          disponible:   formValues.disponible === "Disponible",
          estado_fisico: formValues.estado_fisico,
        });

      } else if (modalTipo === "editar") {
        await updateLibroRequest(formValues.id, {
          nombre:       formValues.nombre,
          autor:        formValues.autor,
          edicion:      formValues.edicion,
          estado_fisico: formValues.estado_fisico,
        });

      } else if (modalTipo === "asignar") {
        if (!formValues.fecha_entrega) {
        alert("Por favor ingresa la fecha de entrega.");
        return;
  }
        await asignarLibroRequest({
          codigo:           parseInt(formValues.codigo, 10) || 0,
          libro:            formValues.titulo_libro,
          fecha_devolucion: formValues.fecha_entrega,
          estado:           "Prestado",
          estado_fisico:    formValues.estado_del_libro,
        });

      } else if (modalTipo === "devolver") {
        if (!prestamoIdActivo) {
          alert("Error: No se encontró el ID del préstamo activo.");
          return;
        }
        await devolverLibroRequest(prestamoIdActivo, {
          fecha_devolucion:     formValues.fecha_devolucion,
          estado_de_devolucion: formValues.estado_de_devolucion,
          observacion:          formValues.observacion ?? "",
        });
      }

      await cargarPrestamos();
      await cargarLibros();
      cerrarModal();
      setFilaSeleccionada(null);
    } catch (err) {
      const mensaje =
        err.response?.data?.detail ||
        "Ocurrió un problema guardando los cambios en el servidor.";
      alert(mensaje);
}
  };

  // ── Eliminar libro ───────────────────────────────────────────────────────
  const handleEliminarLibro = async () => {
    if (!filaSeleccionada) { alert("Selecciona un libro primero."); return; }
    if (filaSeleccionada.disponible === "Prestado") {
      alert("No es posible eliminar un libro con préstamo activo.");
      return;
    }
    if (!window.confirm(`¿Eliminar "${filaSeleccionada.nombre}" de ${filaSeleccionada.autor}? Esta acción no puede deshacerse.`)) return;

    try {
      await deleteLibroRequest(filaSeleccionada.id);
      await cargarLibros();
      await cargarPrestamos();
      setFilaSeleccionada(null);
    } catch (err) {
      console.error("Error eliminando libro:", err);
      alert("Error en el servidor al intentar eliminar el libro.");
    }
  };

  // ── Filtros ──────────────────────────────────────────────────────────────
  const filtrarPrestamos = (filtros) => {
    let f = prestamos;
    if (filtros.codigo) f = f.filter((r) => r.codigo?.toString().includes(filtros.codigo));
    if (filtros.nombre) f = f.filter((r) => r.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase()));
    if (filtros.grado)  f = f.filter((r) => r.grado?.toString() === filtros.grado.toString());
    if (filtros.grupo)  f = f.filter((r) => r.grupo?.toString() === filtros.grupo.toString());
    if (filtros.periodo) {
      f = f.filter((r) => {
        const salon = Object.values(salonesMap).find(
          (s) => s.grado?.toString() === r.grado?.toString() && s.grupo?.toString() === r.grupo?.toString()
        );
        return periodosMap[salon?.id_periodo]?.nombre?.toString() === filtros.periodo.toString();
      });
    }
    setPrestamosFiltered(f);
  };

  const filtrarLibros = (filtros) => {
    let f = libros;
    if (filtros.nombre)  f = f.filter((l) => l.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase()));
    if (filtros.autor)   f = f.filter((l) => l.autor?.toLowerCase().includes(filtros.autor.toLowerCase()));
    if (filtros.edicion) f = f.filter((l) => l.edicion?.toString().includes(filtros.edicion));
    setLibrosFiltered(f);
  };

  // ── Columnas ─────────────────────────────────────────────────────────────
  const columnasInicio = [
    { key: "codigo",        label: "CÓDIGO" },
    { key: "nombre",        label: "NOMBRE COMPLETO" },
    { key: "grado",         label: "GRADO" },
    { key: "grupo",         label: "GRUPO" },
    { key: "titulo_libro",  label: "TÍTULO DEL LIBRO" },
    { key: "fecha_entrega", label: "FECHA DE ENTREGA" },
    {
      key: "estado", label: "ESTADO",
      render: (val) => (
        <span className={val === "Prestado" ? "badge--warning" : "badge--ok"}>{val}</span>
      ),
    },
  ];

  const columnasLibros = [
    { key: "id",      label: "ID" },
    { key: "nombre",  label: "TÍTULO DEL LIBRO" },
    { key: "autor",   label: "AUTOR" },
    { key: "edicion", label: "EDICIÓN" },
    {
      key: "disponible", label: "DISPONIBILIDAD",
      render: (val) => (
        <span className={val === "Disponible" ? "badge--ok" : "badge--no"}>{val}</span>
      ),
    },
    { 
    key: "estado_fisico", 
    label: "ESTADO FÍSICO",
    render: (val) => {
      const clase = val === "Excelente" ? "badge--ok" : val === "Regular" ? "badge--warning" : "badge--no";
      return <span className={clase}>{val}</span>;
    }
    },
  ];

  // ── Campos del modal según tipo ──────────────────────────────────────────
  const configModal = {
    agregar: {
      titulo: "AGREGAR LIBRO",
      campos: [
        { key: "nombre",       label: "Título del Libro", type: "text" },
        { key: "autor",        label: "Autor",            type: "text" },
        { key: "edicion",      label: "Edición",          type: "text" },
        { key: "disponible",   label: "Disponibilidad",   type: "select", options: ["Disponible", "Prestado"] },
        { key: "estado_fisico", label: "Estado Físico",   type: "select", options: ["Excelente", "Regular", "Malo"] },
      ],
    },
    editar: {
      titulo: "EDITAR LIBRO",
      campos: [
        { key: "nombre",       label: "Título del Libro", type: "text" },
        { key: "autor",        label: "Autor",            type: "text" },
        { key: "edicion",      label: "Edición",          type: "text" },
        { key: "estado_fisico", label: "Estado Físico",   type: "select", options: ["Excelente", "Regular", "Malo"] },
      ],
    },
    asignar: {
      titulo: "ASIGNAR LIBRO",
      campos: [
        { key: "codigo",       label: "Código Estudiante", type: "text" },
        { key: "nombre",       label: "Nombre Completo",   type: "text", disabled: true },
        {
          key: "titulo_libro",
          label: "Título del Libro",
          type: "select",
          options: libros
            .filter((l) => l.disponible === "Disponible")
            .map((l) => ({ value: l.nombre, label: l.nombre })),
        },
        { key: "fecha_entrega",    label: "Fecha de Entrega", type: "date" },
        { key: "estado_del_libro", label: "Estado del Libro", type: "select", options: ["Excelente", "Regular", "Malo"] },
      ],
},
    devolver: {
      titulo: "DEVOLVER LIBRO",
      campos: [
        { key: "titulo_libro",         label: "Título del Libro",      type: "text",   disabled: true },
        { key: "fecha_entrega",        label: "Fecha de Entrega",      type: "text",   disabled: true },
        { key: "fecha_devolucion",     label: "Fecha de Devolución",   type: "text" },
        { key: "estado_de_devolucion", label: "Estado de Devolución",  type: "select", options: ["Excelente", "Regular", "Malo"] },
        { key: "observacion",          label: "Observación",           type: "text" },
      ],
    },
  };

  const { titulo: tituloModal, campos: camposModal } = configModal[modalTipo] ?? { titulo: "", campos: [] };

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) return <div>Cargando biblioteca...</div>;
  if (error)   return <div>Error: {error}</div>;

  return (
    <div>
      <style>{`
        .badge--ok      { display:inline-block; padding:.4rem .8rem; background:#D4EDDA; color:#155724; border-radius:.4rem; font-weight:600; font-size:.9rem; }
        .badge--warning { display:inline-block; padding:.4rem .8rem; background:#FFF3CD; color:#856404; border-radius:.4rem; font-weight:600; font-size:.9rem; }
        .badge--no      { display:inline-block; padding:.4rem .8rem; background:#F8D7DA; color:#721C24; border-radius:.4rem; font-weight:600; font-size:.9rem; }
      `}</style>

      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            user={{ nombre: user?.nombre || "Usuario", rol: user?.rol || "" }}
            logout={() => console.log("logout")}
          />
        }
        actions={
          <ActionButtons
            filaSeleccionada={filaSeleccionada}
            botones={
              pestanaActiva === "inicio"
                ? [
                    { label: "Asignar Libro",  onClick: abrirModalAsignar,  siempreActivo: true,       variante: "primary" },
                    { label: "Devolver Libro", onClick: abrirModalDevolver, disabled: !filaSeleccionada, variante: "secondary" },
                  ]
                : [
                    { label: "Agregar Libro",  onClick: abrirModalAgregar,  siempreActivo: true,                                                      variante: "primary" },
                    { label: "Editar Libro",   onClick: abrirModalEditar,   disabled: !filaSeleccionada || filaSeleccionada.disponible === "Prestado", variante: "secondary" },
                    { label: "Eliminar Libro", onClick: handleEliminarLibro, disabled: !filaSeleccionada || filaSeleccionada.disponible === "Prestado", variante: "danger" },
                  ]
            }
          />
        }
      >
        {/* ── INICIO ── */}
        {pestanaActiva === "inicio" && (
          <div>
            <SearchBar
              loading={loading}
              onSearch={filtrarPrestamos}
              fields={[
                { key: "codigo", label: "Código", type: "text", onInput: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); } },
                { key: "nombre", label: "Nombre", type: "text" },
                { key: "grado",  label: "Grado",  type: "select", options: [...new Set(Object.values(salonesMap).map((s) => s.grado).filter(Boolean))] },
                { key: "grupo",  label: "Grupo",  type: "select", options: [...new Set(Object.values(salonesMap).map((s) => s.grupo).filter(Boolean))] },
                { key: "periodo", label: "Periodo", type: "select", options: [...new Set(Object.values(periodosMap).map((p) => p.nombre).filter(Boolean))] },
              ]}
            />
            <div style={{ marginTop: "1rem", background: "#fff", borderRadius: ".8rem", overflow: "hidden", border: "1px solid #D9D9D9" }}>
               {prestamosFiltered.length} préstamos
              <DataTable columns={columnasInicio} rows={prestamosFiltered} emptyText="No hay préstamos" onRowClick={setFilaSeleccionada} />

            </div>
          </div>
        )}

        {/* ── INVENTARIO ── */}
        {pestanaActiva === "libros" && (
          <div>
            <SearchBar
              loading={loading}
              onSearch={filtrarLibros}
              fields={[
                { key: "nombre",  label: "Título del Libro", type: "text" },
                { key: "autor",   label: "Autor",            type: "text" },
                { key: "edicion", label: "Edición",          type: "text" },
              ]}
            />
            <div style={{ marginTop: "1rem", background: "#fff", borderRadius: ".8rem", overflow: "hidden", border: "1px solid #D9D9D9" }}>
              {librosFiltered.length} libros
              <DataTable columns={columnasLibros} rows={librosFiltered} emptyText="No hay libros" onRowClick={setFilaSeleccionada} />
            </div>
          </div>
        )}
      </ModuleLayout>

      <Modal
        title={tituloModal}
        isOpen={modal}
        fields={camposModal}
        values={formValues}
        onChange={(key, val) => setFormValues((prev) => ({ ...prev, [key]: val }))}
        onAccept={handleGuardarTodo}
        onCancel={cerrarModal}
      />
    </div>
  );
}