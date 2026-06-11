import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ObjetosPage.css";

import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import DataTable from "../../components/shared/DataTable";
import SearchBar from "../../components/shared/SearchBar";
import ActionButtons from "../../components/shared/ActionButtons";

import { useAuth } from "../../api/useAuth";

import { 
  obtenerObjetosRequest, 
  crearObjetoRequest, 
  actualizarObjetoRequest, 
  eliminarObjetoRequest 
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
// MODAL PARA CREAR / EDITAR OBJETO
// ==========================================
const ObjetoModal = ({ isOpen, onClose, objetoEdit, alTerminar }) => {
  if (!isOpen) return null;

  const isEdit = Boolean(objetoEdit);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Vestimenta");
  const [talla, setTalla] = useState("S");
  const [estadoFisico, setEstadoFisico] = useState("");
  const [observacion, setObservacion] = useState("");
  const [cantidadTotal, setCantidadTotal] = useState(0);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (isEdit && objetoEdit) {
      setNombre(objetoEdit.nombre || "");
      setTipo(objetoEdit.tipo || "Vestimenta");
      setTalla(objetoEdit.talla || "No aplica");
      setEstadoFisico(objetoEdit.estado_fisico || "");
      setObservacion(objetoEdit.observacion || "");
      setCantidadTotal(objetoEdit.cantidad_total || 0);
    } else {
      setNombre("");
      setTipo("Vestimenta");
      setTalla("S");
      setEstadoFisico("");
      setObservacion("");
      setCantidadTotal(0);
    }
  }, [isOpen, objetoEdit]);

  const handleTipoChange = (e) => {
    const nuevoTipo = e.target.value;
    setTipo(nuevoTipo);
    if (nuevoTipo === "Objeto") {
      setTalla("No aplica");
    } else if (nuevoTipo === "Vestimenta" && talla === "No aplica") {
      setTalla("S"); 
    }
  };

  const handleGuardar = async () => {
    if (!nombre) return alert("El nombre es obligatorio.");
    if (cantidadTotal < 0) return alert("La cantidad no puede ser negativa.");

    try {
      setCargando(true);
      const payload = {
        nombre,
        tipo,
        talla,
        estado_fisico: estadoFisico || "Excelente",
        observacion,
        cantidad_total: parseInt(cantidadTotal)
      };

      if (isEdit) {
        await actualizarObjetoRequest(objetoEdit.id_objeto, payload);
      } else {
        await crearObjetoRequest(payload);
      }
      
      alTerminar();
      onClose();
    } catch (error) {
      alert(error.response?.data?.detail || "Error al guardar el ítem.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="objetos-modal-overlay">
      <div className="objetos-modal-content">
        <div className="modal-header">
          <h3>{isEdit ? "EDITAR ÍTEM" : "NUEVO ÍTEM"}</h3>
          <button className="modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        <div className="modal-body">
          
          <div className="modal-form-row">
            <div className="input-group" style={{ flex: 2 }}>
              <label>Nombre / Prenda</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Camisa Diario" />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label>Tipo</label>
              <select value={tipo} onChange={handleTipoChange}>
                <option value="Vestimenta">Vestimenta</option>
                <option value="Objeto">Objeto</option>
              </select>
            </div>
          </div>

          <div className="modal-form-row">
            <div className="input-group">
              <label>Talla</label>
              <select value={talla} onChange={(e) => setTalla(e.target.value)} disabled={tipo === "Objeto"}>
                {tipo === "Objeto" ? (
                  <option value="No aplica">No aplica</option>
                ) : (
                  <>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </>
                )}
              </select>
            </div>
            <div className="input-group">
              <label>Cantidad Total</label>
              <input type="number" min="0" value={cantidadTotal} onChange={(e) => setCantidadTotal(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Estado Físico</label>
              <select value={estadoFisico} onChange={(e) => setEstadoFisico(e.target.value)}>
                <option value="">Seleccione...</option>
                <option value="Excelente">Excelente</option>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Malo">Malo</option>
              </select>
            </div>
          </div>

          <div className="modal-form-row">
            <div className="input-group">
              <label>Observación (Opcional)</label>
              <input type="text" value={observacion} onChange={(e) => setObservacion(e.target.value)} placeholder="Detalles extra..." />
            </div>
          </div>

        </div>
        <div className="modal-footer">
          <ActionButtons botones={[{ label: "Aceptar", onClick: handleGuardar, variante: "primary", siempreActivo: true }]} />
          <ActionButtons botones={[{ label: "Cancelar", onClick: onClose, variante: "secondary", siempreActivo: true }]} />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const ObjetosPage = () => {
  const { user, logout } = useAuth();
  
  const [objetos, setObjetos] = useState([]);
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(null);
  
  const [filtros, setFiltros] = useState({ nombre: "", tipo: "" });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalModeEdit, setModalModeEdit] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const cargarObjetos = async () => {
    try {
      const response = await obtenerObjetosRequest();
      setObjetos(response.data || []);
      setObjetoSeleccionado(null); 
    } catch (error) {
      console.error("Error al cargar objetos:", error);
    }
  };

  useEffect(() => { cargarObjetos(); }, []);

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
    { key: "id_objeto", label: "Cód" },
    { key: "nombre", label: "Nombre / Prenda" },
    { key: "tipo", label: "Tipo" },
    { key: "talla", label: "Talla" },
    { key: "estado_fisico", label: "Estado" },
    { key: "cantidad_total", label: "Total" },
    { key: "prestadas", label: "Prestadas" },
    { key: "cantidad_disponible", label: "Disponibles", 
      render: (val) => <span style={{ color: val > 0 ? "#008000" : "#D00000", fontWeight: "bold" }}>{val}</span> 
    }
  ];

  const objetosFiltrados = useMemo(() => {
    return objetos.filter(o => {
      const matchNombre = filtros.nombre ? (o.nombre || "").toLowerCase().includes(filtros.nombre.toLowerCase()) : true;
      const matchTipo = filtros.tipo ? o.tipo === filtros.tipo : true;
      return matchNombre && matchTipo;
    });
  }, [objetos, filtros]);

  const totalPaginas = Math.ceil(objetosFiltrados.length / itemsPorPagina) || 1;

  const filasPaginadas = useMemo(() => {
    const startIndex = (paginaActual - 1) * itemsPorPagina;
    return objetosFiltrados.slice(startIndex, startIndex + itemsPorPagina);
  }, [objetosFiltrados, paginaActual]);

  const abrirModalCrear = () => { setModalModeEdit(false); setIsModalOpen(true); };
  const abrirModalEditar = () => { setModalModeEdit(true); setIsModalOpen(true); };

  const handleEliminar = async () => {
    if (!objetoSeleccionado) return;
    const confirmar = window.confirm(`¿Estás seguro de eliminar: ${objetoSeleccionado.nombre}?`);
    if (!confirmar) return;

    try {
      await eliminarObjetoRequest(objetoSeleccionado.id_objeto);
      cargarObjetos();
    } catch (error) {
      alert(error.response?.data?.detail || "No se puede eliminar un ítem con historial de préstamos.");
    }
  };

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={<Sidebar menuItems={menuItems} selectedMenu="Objetos" user={{ nombre: user?.nombre || "Usuario", rol: user?.rol || "TITULAR" }} logout={logout} />}
      >
        <div className="objetos-wrapper page-master-wrapper">
          
          <div className="module-toolbar-container">
            <SearchBar
              fields={[
                { key: 'nombre', label: 'Nombre:', type: 'text' },
                { key: 'tipo', label: 'Tipo:', type: 'select', options: ['Vestimenta', 'Objeto'] }
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
                {objetos.length === 0 ? (
                  <div className="empty-state">
                    <p>Aún no hay ítems registrados en el inventario</p>
                  </div>
                ) : (
                  <>
                    <div className="datatable-fixed-container">
                      <DataTable 
                        columns={columnasTabla} 
                        rows={filasPaginadas} 
                        onRowClick={(fila) => setObjetoSeleccionado(fila)}
                        emptyText="No se encontraron ítems con esos criterios"
                        filaActiva={objetoSeleccionado}
                        idKey="id_objeto"
                      />
                    </div>
                    
                    <div className="pagination-center">
                      <button 
                        className="btn-circle"
                        onClick={() => { setPaginaActual(p => Math.max(1, p - 1)); setObjetoSeleccionado(null); }}
                        disabled={paginaActual === 1}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        className="btn-circle"
                        onClick={() => { setPaginaActual(p => Math.min(totalPaginas, p + 1)); setObjetoSeleccionado(null); }}
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
                  filaSeleccionada={objetoSeleccionado}
                  botones={[
                    { label: "Agregar Ítem", onClick: abrirModalCrear, variante: "primary", siempreActivo: true },
                    { label: "Editar Ítem", onClick: abrirModalEditar, variante: "primary", siempreActivo: false },
                    { label: "Eliminar Ítem", onClick: handleEliminar, variante: "primary", siempreActivo: false }
                  ]}
                />
              </div>  

            </div>
          </div>
        </div>

        <ObjetoModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          objetoEdit={modalModeEdit ? objetoSeleccionado : null} 
          alTerminar={cargarObjetos} 
        />
      </ModuleLayout>
    </div>
  );
};

export default ObjetosPage;