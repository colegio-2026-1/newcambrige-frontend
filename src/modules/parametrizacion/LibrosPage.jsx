import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./LibrosPage.css";

import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import DataTable from "../../components/shared/DataTable";
import SearchBar from "../../components/shared/searchBar";
import ActionButtons from "../../components/shared/ActionButtons";

import { useAuth } from "../../api/useAuth";
import { 
  obtenerLibrosRequest, 
  crearLibroRequest, 
  actualizarLibroRequest, 
  eliminarLibroRequest 
} from "../../api/endpointsParametrizacion"; 

import { Icon } from '@mdi/react';
import {
  mdiHome,
  mdiCog,

  mdiAccount,
  mdiCalendar,
  mdiTestTube,
  mdiGuitarElectric,
  mdiCube,
  mdiBook,
  mdiAccountGroup,
} from '@mdi/js';

import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import paraIcon from "../../assets/Parametrizacion/parametrizacion.svg";

// ==========================================
// MODAL PARA CREAR / EDITAR LIBRO
// ==========================================
const LibroModal = ({ isOpen, onClose, libroEdit, alTerminar }) => {
  if (!isOpen) return null;

  const isEdit = Boolean(libroEdit);

  const [nombre, setNombre] = useState("");
  const [autor, setAutor] = useState("");
  const [edicion, setEdicion] = useState("");
  const [estadoFisico, setEstadoFisico] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (isEdit && libroEdit) {
      setNombre(libroEdit.nombre || "");
      setAutor(libroEdit.autor || "");
      setEdicion(libroEdit.edicion || "");
      setEstadoFisico(libroEdit.estado_fisico || "");
      setDisponible(libroEdit.disponible !== false); 
    } else {
      setNombre("");
      setAutor("");
      setEdicion("");
      setEstadoFisico("");
      setDisponible(true);
    }
  }, [isOpen, libroEdit]);

  const handleGuardar = async () => {
    if (!nombre || !autor) return alert("El título y el autor son obligatorios.");

    try {
      setCargando(true);
      const payload = {
        nombre,
        autor,
        edicion,
        estado_fisico: estadoFisico,
        disponible
      };

      if (isEdit) {
        await actualizarLibroRequest(libroEdit.id_libro, payload);
      } else {
        await crearLibroRequest(payload);
      }
      
      alTerminar();
      onClose();
    } catch (error) {
      alert(error.response?.data?.detail || "Error al guardar el libro.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="libros-modal-overlay">
      <div className="libros-modal-content">
        <div className="modal-header">
          <h3>{isEdit ? "EDITAR LIBRO" : "NUEVO LIBRO"}</h3>
          <button className="modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        <div className="modal-body">
          
          <div className="modal-form-row">
            <div className="input-group" style={{ flex: 2 }}>
              <label>Título del Libro</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Cien Años de Soledad" />
            </div>
            <div className="input-group" style={{ flex: 1.5 }}>
              <label>Autor</label>
              <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} placeholder="Ej: Gabriel García Márquez" />
            </div>
          </div>

          <div className="modal-form-row">
            <div className="input-group">
              <label>Edición</label>
              <input type="text" value={edicion} onChange={(e) => setEdicion(e.target.value)} placeholder="Ej: 1ra Edición" />
            </div>
            <div className="input-group">
              <label>Estado Físico</label>
              <input type="text" value={estadoFisico} onChange={(e) => setEstadoFisico(e.target.value)} placeholder="Ej: Bueno, Regular, Malo" />
            </div>
            <div className="input-group toggle-group">
              <label>Disponibilidad</label>
              <label className="toggle-switch">
                <input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>

        </div>
        <div className="modal-footer">
          <ActionButtons
            botones={[{ label: "Aceptar", onClick: handleGuardar, variante: "primary", siempreActivo: true }]}
          />
          <ActionButtons
            botones={[{ label: "Cancelar", onClick: onClose, variante: "secondary", siempreActivo: true }]}
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const LibrosPage = () => {
  const { user, logout } = useAuth();
  
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  
  const [filtros, setFiltros] = useState({ id_libro: "", nombre: "", edicion: "" });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalModeEdit, setModalModeEdit] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const cargarLibros = async () => {
    try {
      const response = await obtenerLibrosRequest();
      setLibros(response.data || []);
      setLibroSeleccionado(null); 
    } catch (error) {
      console.error("Error al cargar libros:", error);
    }
  };

  useEffect(() => { cargarLibros(); }, []);

  const menuItems = [
    { label: "Inicio", icon: <Icon path={mdiHome} size="32px" />, path: "/home" },
    { label: "Usuarios", icon: <Icon path={mdiAccount} size="32px" />, path: "/parametrizacion/usuarios" },
    { label: "Año Escolar", icon: <Icon path={mdiCalendar} size="32px" />, path: "/parametrizacion/anio-escolar" },
    { label: "Pruebas", icon: <Icon path={mdiTestTube} size="32px" />, path: "/parametrizacion/pruebas" },
    { label: "Instrumentos", icon: <Icon path={mdiGuitarElectric} size="32px" />, path: "/parametrizacion/instrumentos" },
    { label: "Objetos", icon: <Icon path={mdiCube} size="32px" />, path: "/parametrizacion/objetos" },
    { label: "Libros", icon: <Icon path={mdiBook} size="32px" />, path: "/parametrizacion/libros" },
    { label: "Asignar Titular", icon: <Icon path={mdiAccountGroup} size="32px" />, path: "/parametrizacion/titulares" },
  ];

  const columnasTabla = [
    { key: "id_libro", label: "Código" },
    { key: "nombre", label: "Título del Libro" },
    { key: "autor", label: "Autor" },
    { key: "edicion", label: "Edición", render: (val) => val || "N/A" },
    { key: "disponible", label: "Disponibilidad", render: (val) => <span style={{ color: val ? "#008000" : "#D00000", fontWeight: "bold" }}>{val ? "Disponible" : "Prestado"}</span> },
    { key: "estado_fisico", label: "Estado Físico", render: (val) => val || "N/A" }
  ];

  const librosFiltrados = useMemo(() => {
    return libros.filter(l => {
      const matchId = filtros.id_libro ? l.id_libro.toString().includes(filtros.id_libro) : true;
      const matchNombre = filtros.nombre ? (l.nombre || "").toLowerCase().includes(filtros.nombre.toLowerCase()) : true;
      const matchEdicion = filtros.edicion ? (l.edicion || "").toLowerCase().includes(filtros.edicion.toLowerCase()) : true;
      
      const isNotDeleted = !(l.nombre || "").includes("(Eliminado del Inventario)");
      return matchId && matchNombre && matchEdicion && isNotDeleted;
    });
  }, [libros, filtros]);

  const totalPaginas = Math.ceil(librosFiltrados.length / itemsPorPagina) || 1;

  const filasPaginadas = useMemo(() => {
    const startIndex = (paginaActual - 1) * itemsPorPagina;
    return librosFiltrados.slice(startIndex, startIndex + itemsPorPagina);
  }, [librosFiltrados, paginaActual]);

  const abrirModalCrear = () => { setModalModeEdit(false); setIsModalOpen(true); };
  const abrirModalEditar = () => { setModalModeEdit(true); setIsModalOpen(true); };

  const handleEliminar = async () => {
    if (!libroSeleccionado) return;
    const confirmar = window.confirm(`¿Estás seguro de eliminar el libro: ${libroSeleccionado.nombre}?`);
    if (!confirmar) return;

    try {
      await eliminarLibroRequest(libroSeleccionado.id_libro);
      cargarLibros();
    } catch (error) {
      alert(error.response?.data?.detail || "No se puede eliminar un libro con préstamo activo.");
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={<Sidebar menuItems={menuItems} selectedMenu="Libros" user={{ nombre: user?.nombre || "Usuario", rol: user?.rol || "TITULAR" }} logout={logout} />}
      >
        <div className="libros-wrapper page-master-wrapper">
          
          <div className="module-toolbar-container">
            <SearchBar
              fields={[
                { key: 'id_libro', label: 'Código', type: 'text' },
                { key: 'nombre', label: 'Título del Libro', type: 'text' },
                { key: 'edicion', label: 'Edición', type: 'text' }
              ]}
              onSearch={(nuevosFiltros) => {
                setFiltros(nuevosFiltros);
                setPaginaActual(1);
              }}
            />
          </div>

          <div className="main-area">
            <div className="table-layout-wrapper">
              
              <div className="table-main-section">
                {libros.length === 0 ? (
                  <div className="empty-state">
                    <p>Aún no hay libros registrados</p>
                  </div>
                ) : (
                  <>
                    <div className="datatable-fixed-container">
                      <DataTable 
                        columns={columnasTabla} 
                        rows={filasPaginadas} 
                        onRowClick={(fila) => setLibroSeleccionado(fila)}
                        emptyText="No se encontraron libros con esos criterios"
                        filaActiva={libroSeleccionado}
                        idKey="id_libro"
                      />
                    </div>
                    
                    <div className="pagination-center">
                      <button 
                        className="btn-circle"
                        onClick={() => { setPaginaActual(p => Math.max(1, p - 1)); setLibroSeleccionado(null); }}
                        disabled={paginaActual === 1}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        className="btn-circle"
                        onClick={() => { setPaginaActual(p => Math.min(totalPaginas, p + 1)); setLibroSeleccionado(null); }}
                        disabled={paginaActual === totalPaginas}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="side-actions">
                <ActionButtons
                  filaSeleccionada={libroSeleccionado}
                  botones={[
                    { 
                      label: "Agregar Libro", 
                      onClick: abrirModalCrear, 
                      variante: "primary", 
                      siempreActivo: true 
                    },
                    { 
                      label: "Editar Libro", 
                      onClick: abrirModalEditar, 
                      variante: "primary", 
                      siempreActivo: false 
                    },
                    { 
                      label: "Eliminar Libro", 
                      onClick: handleEliminar, 
                      variante: "primary",
                      siempreActivo: false 
                    }
                  ]}
                />
              </div>  

            </div>
          </div>
        </div>  

        <LibroModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          libroEdit={modalModeEdit ? libroSeleccionado : null} 
          alTerminar={cargarLibros} 
        />
      </ModuleLayout>
    </div>
  );
};

export default LibrosPage;