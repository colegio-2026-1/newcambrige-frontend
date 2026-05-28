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
  // === NUEVOS ENDPOINTS CONECTADOS A TU FASTAPI ===
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
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================
  const [pestanaActiva, setPestanaActiva] = useState("inicio");
  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

  // Estados comunes para el manejo del modal dinámico
  const [modal, setModal] = useState(false);
  const [modalTipo, setModalTipo] = useState("agregar"); // 'agregar', 'editar', 'asignar', 'devolver'
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

  useEffect(() => {
    cargarTodo();
  }, []);

  // =========================
  // CARGAR PRÉSTAMOS
  // =========================
  const cargarPrestamos = async () => {
    try {
      const response = await getPrestamosRequest();
      console.log("Datos reales que llegan del backend:", response.data);

      const prestamosFormateados = Array.isArray(response.data)
        ? response.data.map((p) => {
            // Evaluamos el string que viene de la columna character varying(20)
            // Si el backend te manda directamente "Prestado" o "Devuelto", lo dejamos pasar limpio.
            // Si te manda "true"/"false" o "Activo"/"Devuelto", lo estandarizamos aquí:
            let estadoVisual = "Prestado";
            
            if (p.estado === "Devuelto" || p.estado === "true" || p.estado === true) {
              estadoVisual = "Devuelto";
            } else if (p.estado === "Prestado" || p.estado === "false" || p.estado === false) {
              estadoVisual = "Prestado";
            }

            return {
              id_prestamo: p.id_prestamo,
              // Si tu backend ya hace el Join con estudiante y libro, estos campos vendrán así:
              codigo: p.codigo || p.estudiante?.codigo || "",
              nombre: p.nombre || p.estudiante?.nombre || "",
              grado: p.grado || p.estudiante?.grado || "",
              grupo: p.grupo || p.estudiante?.grupo || "",
              titulo_libro: p.libro || p.inventario_libro?.nombre || "", 
              fecha_prestamo: p.fecha_prestamo || "",
              fecha_entrega: p.fecha_devolucion || "", 
              estado: estadoVisual, // Asignamos el estado corregido
              observacion: p.observacion || "",
            };
          })
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
            disponible: l.disponible ? "Disponible" : "Prestado",
            estado_fisico: l.estado_fisico || "Excelente",
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

  const cargarSalones = async () => {
    try {
      const response = await allsalonesRequest();
      setSalones(response.data || []);
    } catch (error) {
      console.error("Error cargando salones:", error);
    }
  };

  const cargarPeriodos = async () => {
    try {
      const response = await allaniosacademicosRequest();
      setPeriodos(response.data || []);
    } catch (error) {
      console.error("Error cargando periodos:", error);
    }
  };

  // =========================
  // ACCIONES / MODALES DEL MOCKUP
  // =========================
  const abrirModalAsignar = () => {
    setModalTipo("asignar");
    setFormValues({
      codigo: "",
      nombre: "",
      grado: "",
      grupo: "",
      titulo_libro: "",
      edicion: "",
      fecha_entrega: "",
      estado_del_libro: "Excelente",
      observacion: "",
    });
    setModal(true);
  };

  const abrirModalDevolver = () => {
    if (!filaSeleccionada) {
      alert("Por favor, selecciona un registro de préstamo en la tabla primero.");
      return;
    }
    if (filaSeleccionada.estado === "Devuelto") {
      alert("Este libro ya figura como devuelto en el sistema.");
      return;
    }

    setModalTipo("devolver");
    setFormValues({
      id_prestamo: filaSeleccionada.id_prestamo,
      titulo_libro: filaSeleccionada.titulo_libro,
      edicion: "",
      fecha_entrega: filaSeleccionada.fecha_entrega,
      fecha_devolucion: new Date().toISOString().split("T")[0], // Fecha actual por defecto
      estado_de_entrega: filaSeleccionada.estado_fisico || "Excelente",
      estado_de_devolucion: "Excelente",
      observacion: filaSeleccionada.observacion || "",
    });
    setModal(true);
  };

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
  // GUARDAR / PROCESAR (PROS)
  // =========================
const handleGuardarTodo = async () => {
    try {
      if (modalTipo === "agregar") {
        await createLibroRequest({
          nombre: formValues.nombre,
          autor: formValues.autor,
          edicion: formValues.edicion,
          disponible: formValues.disponible === "Disponible",
          estado_fisico: formValues.estado_fisico,
        });
      } else if (modalTipo === "editar") {
        await updateLibroRequest(formValues.id, {
          nombre: formValues.nombre,
          autor: formValues.autor,
          edicion: formValues.edicion,
          estado_fisico: formValues.estado_fisico,
        });
      } else if (modalTipo === "asignar") {
        // El backend intercepta "libro" y desactiva su disponibilidad automáticamente
        await asignarLibroRequest({
          codigo: formValues.codigo ? parseInt(formValues.codigo, 10) : 0,
          nombre: formValues.nombre,
          grado: formValues.grado,
          grupo: formValues.grupo,
          libro: formValues.titulo_libro,
          fecha_prestamo: new Date().toISOString().split('T')[0],
          fecha_devolucion: formValues.fecha_entrega,
          estado: false,
          observacion: formValues.observacion || "",
          estado_fisico: formValues.estado_del_libro 
        });

      } else if (modalTipo === "devolver") {
        // El backend marca el préstamo como devuelto y libera el libro automáticamente
        await devolverLibroRequest(formValues.id_prestamo, {
          fecha_devolucion: formValues.fecha_devolucion,
          estado_de_devolucion: formValues.estado_de_devolucion,
          observacion: formValues.observacion || ""
        });
      }

      // Recarga completa y limpia del servidor para reflejar los cambios en ambas pestañas
      await cargarPrestamos();
      await cargarLibros();
      cerrarModal();
      setFilaSeleccionada(null);
    } catch (error) {
      console.error("Error procesando operación:", error);
      alert("Ocurrió un problema guardando los cambios en el servidor.");
    }
  };

const handleEliminarLibro = async () => {
    if (!filaSeleccionada) {
      alert("Por favor, selecciona un libro de la tabla primero.");
      return;
    }

    if (filaSeleccionada.disponible === "Prestado") {
      alert("No es posible eliminar un libro con préstamo activo.");
      return;
    }

    try {
      console.log("Enviando solicitud de eliminación para ID:", filaSeleccionada.id);
      
      // Ejecutamos la petición directamente
      await deleteLibroRequest(filaSeleccionada.id);
      
      console.log("Eliminación exitosa en el servidor");
      
      // Refrescar estados locales
      await cargarLibros();
      await cargarPrestamos();
      
      setFilaSeleccionada(null); 
      alert("El libro ha sido eliminado del inventario.");
    } catch (error) {
      console.error("Error detectado en la petición Axios:", error);
      alert("Ocurrió un error en el servidor al intentar eliminar el libro.");
    }
  };

  // =========================
  // FILTRAR LOGIC
  // =========================
  const FiltrarPrestamos = (filtros) => {
    let filtered = prestamos;
    if (filtros.codigo) {
      filtered = filtered.filter((r) => r.codigo?.toString().includes(filtros.codigo));
    }
    if (filtros.nombre) {
      filtered = filtered.filter((r) => r.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase()));
    }
    if (filtros.grado) {
      filtered = filtered.filter((r) => r.grado?.toString() === filtros.grado.toString());
    }
    if (filtros.grupo) {
      filtered = filtered.filter((r) => r.grupo?.toString() === filtros.grupo.toString());
    }
    if (filtros.periodo) {
      filtered = filtered.filter((r) => {
        const salon = Object.values(salonesMap).find(
          (s) => s.grado?.toString() === r.grado?.toString() && s.grupo?.toString() === r.grupo?.toString()
        );
        const periodo = periodosMap[salon?.id_periodo];
        return periodo?.nombre?.toString() === filtros.periodo.toString();
      });
    }
    setPrestamosFiltered(filtered);
  };

  const FiltrarLibros = (filtros) => {
    let filtered = libros;
    if (filtros.nombre) {
      filtered = filtered.filter((l) => l.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase()));
    }
    if (filtros.autor) {
      filtered = filtered.filter((l) => l.autor?.toLowerCase().includes(filtros.autor.toLowerCase()));
    }
    if (filtros.edicion) {
      filtered = filtered.filter((l) => l.edicion?.toString().includes(filtros.edicion));
    }
    setLibrosFiltered(filtered);
  };

  // =========================
  // COLUMNAS TABLAS
  // =========================
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
        let className = val === "Prestado" ? "badge--warning" : "badge--ok";
        return <span className={className}>{val}</span>;
      },
    },
  ];

  const columnasLibros = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "TÍTULO DEL LIBRO" },
    { key: "autor", label: "AUTOR" },
    { key: "edicion", label: "EDICIÓN" },
    {
      key: "disponible",
      label: "DISPONIBILIDAD",
      render: (val) => (
        <span className={val === "Disponible" ? "badge--ok" : "badge--no"}>{val}</span>
      ),
    },
    { key: "estado_fisico", label: "ESTADO FÍSICO" },
  ];

  // =========================
  // RENDERIZADO DE CAMPOS DINÁMICOS
  // =========================
  let camposModal = [];
  let tituloModal = "";

  if (modalTipo === "agregar" || modalTipo === "editar") {
    tituloModal = modalTipo === "agregar" ? "AGREGAR LIBRO" : "EDITAR LIBRO";
    camposModal = [
      { key: "nombre", label: "Título del Libro", type: "text" },
      { key: "autor", label: "Autor", type: "text" },
      { key: "edicion", label: "Edición", type: "text" },
      { key: "disponible", label: "Disponibilidad", type: "select", options: ["Disponible", "Prestado"] },
      { key: "estado_fisico", label: "Estado Físico", type: "select", options: ["Excelente", "Regular", "Malo"] },
    ];
  } else if (modalTipo === "asignar") {
    tituloModal = "ASIGNAR LIBRO";
    camposModal = [
      { key: "codigo", label: "Código Estudiante", type: "text" },
      { key: "nombre", label: "Nombre Completo", type: "text" },
      { key: "grado", label: "Grado", type: "text" },
      { key: "grupo", label: "Grupo", type: "text" },
      { key: "titulo_libro", label: "Título del Libro", type: "text" },
      { key: "edicion", label: "Edición", type: "text" },
      { key: "fecha_entrega", label: "Fecha de Entrega", type: "text" },
      { key: "estado_del_libro", label: "Estado del Libro", type: "select", options: ["Excelente", "Regular", "Malo"] },
      { key: "observacion", label: "Observación", type: "text" },
    ];
  } else if (modalTipo === "devolver") {
    tituloModal = "DEVOLVER LIBRO";
    camposModal = [
      { key: "titulo_libro", label: "Título del Libro", type: "text", disabled: true },
      { key: "edicion", label: "Edición", type: "text" },
      { key: "fecha_entrega", label: "Fecha de Entrega", type: "text", disabled: true },
      { key: "fecha_devolucion", label: "Fecha de Devolución", type: "text" },
      { key: "estado_de_entrega", label: "Estado de Entrega", type: "text", disabled: true },
      { key: "estado_de_devolucion", label: "Estado de Devolución", type: "select", options: ["Excelente", "Regular", "Malo"] },
      { key: "observacion", label: "Observación", type: "text" },
    ];
  }

  if (loading) return <div>Cargando biblioteca...</div>;
  if (error) return <div>Error cargando datos: {error}</div>;

  return (
    <div>
      <style>
        {`
          .badge--ok { display: inline-block; padding: 0.4rem 0.8rem; background: #D4EDDA; color: #155724; border-radius: 0.4rem; font-weight: 600; font-size: 0.9rem; }
          .badge--warning { display: inline-block; padding: 0.4rem 0.8rem; background: #FFF3CD; color: #856404; border-radius: 0.4rem; font-weight: 600; font-size: 0.9rem; }
          .badge--no { display: inline-block; padding: 0.4rem 0.8rem; background: #F8D7DA; color: #721C24; border-radius: 0.4rem; font-weight: 600; font-size: 0.9rem; }
        `}
      </style>

      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      <ModuleLayout
        sidebar={<Sidebar menuItems={menuItems} selectedMenu={selectedMenu} user="Nombre usuario" logout={() => console.log("logout")} />}
        actions={
          <ActionButtons
            filaSeleccionada={filaSeleccionada}
            botones={
              pestanaActiva === "inicio"
                ? [
                    { label: "Asignar Libro", onClick: abrirModalAsignar, siempreActivo: true, variante: "primary" },
                    { label: "Devolver Libro", onClick: abrirModalDevolver, variante: "secondary" },
                  ]
                : [
                    { label: "Agregar Libro", onClick: abrirModalAgregar, siempreActivo: true, variante: "primary" },
                    { label: "Editar Libro", onClick: () => abrirModalEditar(filaSeleccionada), variante: "secondary", disabled: !filaSeleccionada || filaSeleccionada.disponible === "Prestado" },
                    // Cambia el botón de eliminar para que quede así:
                    { 
                      label: "Eliminar Libro", 
                      onClick: handleEliminarLibro, 
                      variante: "danger",
                      disabled: !filaSeleccionada // Solo se deshabilita si no han hecho click en ninguna fila
                    },
                  ]
            }
          />
        }
      >
        {/* ========================= VIEW: INICIO ========================= */}
        {pestanaActiva === "inicio" && (
          <div>
            <SearchBar
              loading={loading}
              onSearch={FiltrarPrestamos}
              fields={[
                { key: "codigo", label: "Código", type: "text", onInput: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); } },
                { key: "nombre", label: "Nombre", type: "text" },
                { key: "grado", label: "Grado", type: "select", options: Array.from(new Set(Object.values(salonesMap).map((s) => s.grado).filter(Boolean))) },
                { key: "grupo", label: "Grupo", type: "select", options: Array.from(new Set(Object.values(salonesMap).map((s) => s.grupo).filter(Boolean))) },
                { key: "periodo", label: "Periodo", type: "select", options: Array.from(new Set(Object.values(periodosMap).map((p) => p.nombre).filter(Boolean))) },
              ]}
            />
            <div style={{ marginTop: "1rem", background: "#FFFFFF", borderRadius: "0.8rem", overflow: "hidden", border: "1px solid #D9D9D9" }}>
              <DataTable columns={columnasInicio} rows={prestamosFiltered} emptyText="No hay préstamos" onRowClick={(f) => setFilaSeleccionada(f)} />
            </div>
          </div>
        )}

        {/* ========================= VIEW: INVENTARIO ========================= */}
        {pestanaActiva === "libros" && (
          <div>
            <SearchBar
              loading={loading}
              onSearch={FiltrarLibros}
              fields={[
                { key: "nombre", label: "Título del Libro", type: "text" },
                { key: "autor", label: "Autor", type: "text" },
                { key: "edicion", label: "Edición", type: "text" },
              ]}
            />
            <div style={{ marginTop: "1rem", background: "#FFFFFF", borderRadius: "0.8rem", overflow: "hidden", border: "1px solid #D9D9D9" }}>
              <DataTable columns={columnasLibros} rows={librosFiltered} emptyText="No hay libros" onRowClick={(f) => setFilaSeleccionada(f)} />
            </div>
          </div>
        )}
      </ModuleLayout>

      {/* ========================= MODAL REUTILIZABLE ========================= */}
      <Modal
        title={tituloModal}
        isOpen={modal}
        fields={camposModal}
        values={formValues}
        onChange={(key, val) =>
          setFormValues((p) => ({
            ...p,
            [key]: val,
          }))
        }
        onAccept={handleGuardarTodo}
        onCancel={cerrarModal}
      />
    </div>
  );
}