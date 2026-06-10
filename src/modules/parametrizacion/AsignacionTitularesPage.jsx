import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./AsignacionTitularesPage.css";

import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";

import { useAuth } from "../../api/useAuth";
import { 
  obtenerTitularesRequest, 
  obtenerSalonesPorPeriodoRequest, 
  asignarTitularRequest 
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
// MODAL UNIFICADO (ASIGNAR / EDITAR)
// ==========================================
const AsignacionModal = ({ isOpen, onClose, titularSeleccionado, titulares, salones, alTerminar }) => {
  if (!isOpen) return null;

  const [titularIdModal, setTitularIdModal] = useState("");
  const [gradoSelect, setGradoSelect] = useState("");
  const [grupoSelect, setGrupoSelect] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (titularSeleccionado) {
        setTitularIdModal(titularSeleccionado.id_usuario.toString());
      } else {
        setTitularIdModal("");
      }
      setGradoSelect("");
      setGrupoSelect("");
    }
  }, [isOpen, titularSeleccionado]);

  const gradosUnicos = useMemo(() => [...new Set(salones.map(s => s.grado))], [salones]);
  const gruposDisponibles = useMemo(() => 
    salones.filter(s => s.grado === gradoSelect), 
  [salones, gradoSelect]);

  const titularActivo = useMemo(() => 
    titulares.find(t => t.id_usuario.toString() === titularIdModal), 
  [titulares, titularIdModal]);

  const salonesAsignadosActivos = useMemo(() => 
    titularActivo ? salones.filter(s => s.id_usuario === titularActivo.id_usuario) : [],
  [titularActivo, salones]);

  const handleAsignar = async () => {
    if (!titularIdModal) return alert("Seleccione un Titular primero.");
    if (!gradoSelect || !grupoSelect) return alert("Seleccione grado y grupo");
    
    const salon = gruposDisponibles.find(s => s.grupo === grupoSelect);
    if (!salon) return;

    try {
      setCargando(true);
      await asignarTitularRequest(salon.id_salon, { id_usuario: parseInt(titularIdModal) });
      setGradoSelect("");
      setGrupoSelect("");
      alTerminar(); 
    } catch (error) {
      alert("Error al asignar el salón: " + (error.response?.data?.detail || error.message));
    } finally {
      setCargando(false);
    }
  };

  const handleRemoverAsignacion = async (id_salon) => {
    const confirmar = window.confirm("¿Estás seguro de remover esta asignación?");
    if (!confirmar) return;
    try {
      setCargando(true);
      await asignarTitularRequest(id_salon, { id_usuario: null });
      alTerminar();
    } catch (error) {
      alert("Error al remover asignación: " + (error.response?.data?.detail || error.message));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="asignacion-modal-content">
        <div className="modal-header">
          <h3>{titularSeleccionado ? "EDITAR" : "ASIGNAR TITULAR"}</h3>
          <button className="modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-form-row">
            <div className="input-group" style={{ flex: 2 }}>
              <label>Titular</label>
              <select 
                value={titularIdModal} 
                onChange={(e) => setTitularIdModal(e.target.value)}
                disabled={!!titularSeleccionado} 
              >
                <option value="">Seleccione un titular...</option>
                {titulares.map(t => (
                  <option key={t.id_usuario} value={t.id_usuario}>{t.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-form-row" style={{ alignItems: "flex-end" }}>
            <div className="input-group">
              <label>Grado</label>
              <select value={gradoSelect} onChange={(e) => { setGradoSelect(e.target.value); setGrupoSelect(""); }} disabled={!titularIdModal}>
                <option value="">Seleccione...</option>
                {gradosUnicos.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Grupo</label>
              <select value={grupoSelect} onChange={(e) => setGrupoSelect(e.target.value)} disabled={!gradoSelect || !titularIdModal}>
                <option value="">Seleccione...</option>
                {gruposDisponibles.map(s => <option key={s.id_salon} value={s.grupo}>{s.grupo}</option>)}
              </select>
            </div>
            <button className="btn-circle btn-add-modal" onClick={handleAsignar} disabled={cargando || !grupoSelect}>
              +
            </button>
          </div>

          <div className="asignaciones-section">
            <h4>ASIGNACIONES</h4>
            <div className="asignaciones-pills-container">
              {!titularActivo ? (
                <p style={{ color: "#666", width: "100%", textAlign: "center" }}>Seleccione un titular arriba</p>
              ) : salonesAsignadosActivos.length === 0 ? (
                <p style={{ color: "#666", width: "100%", textAlign: "center" }}>No tiene salones asignados</p>
              ) : (
                salonesAsignadosActivos.map(salon => (
                  <div key={salon.id_salon} className="asignacion-pill" onClick={() => handleRemoverAsignacion(salon.id_salon)} title="Clic para remover">
                    {salon.grado} - {salon.grupo}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <ActionButtons botones={[{ label: "Cerrar", onClick: onClose, variante: "primary", siempreActivo: true }]} />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const AsignacionTitularesPage = () => {
  const { user, roles, loadingRoles, logout } = useAuth();
  
  const [titulares, setTitulares] = useState([]);
  const [salones, setSalones] = useState([]);
  const [titularTablaSelec, setTitularTablaSelec] = useState(null);
  
  const [filtroTitularTexto, setFiltroTitularTexto] = useState("");
  const [filtroGrado, setFiltroGrado] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState(null); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  const ID_PERIODO_ACTUAL = 1; 

  const cargarDatos = async () => {
    try {
      const [resTitulares, resSalones] = await Promise.all([
        obtenerTitularesRequest(),
        obtenerSalonesPorPeriodoRequest(ID_PERIODO_ACTUAL)
      ]);
      setTitulares(resTitulares.data || []);
      setSalones(resSalones.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const gradosUnicosBusqueda = useMemo(() => [...new Set(salones.map(s => s.grado))], [salones]);
  const gruposDisponiblesBusqueda = useMemo(() => {
    return salones.filter(s => s.grado === filtroGrado);
  }, [salones, filtroGrado]);

  const handleBusqueda = () => {
    setBusquedaActiva({
      titular: filtroTitularTexto.trim().toLowerCase(),
      grado: filtroGrado,
      grupo: filtroGrupo
    });
    setPaginaActual(1);
    setTitularTablaSelec(null);
  };

  const limpiarBusqueda = () => {
    setBusquedaActiva(null);
    setFiltroTitularTexto("");
    setFiltroGrado("");
    setFiltroGrupo("");
    setPaginaActual(1);
  };

  const datosTabla = useMemo(() => {
    let filtrados = titulares.map(titular => {
      const salonesAsignados = salones.filter(s => s.id_usuario === titular.id_usuario);
      return {
        ...titular,
        salones_asignados: salonesAsignados,
        asignaciones_str: salonesAsignados.length > 0 
          ? salonesAsignados.map(s => `${s.grado} - ${s.grupo}`).join(", ")
          : "Sin asignar"
      };
    });

    if (busquedaActiva) {
      if (busquedaActiva.titular) {
        filtrados = filtrados.filter(t => t.nombre.toLowerCase().includes(busquedaActiva.titular));
      }
      if (busquedaActiva.grado) {
        filtrados = filtrados.filter(t => t.salones_asignados.some(s => s.grado === busquedaActiva.grado));
      }
      if (busquedaActiva.grupo) {
        filtrados = filtrados.filter(t => t.salones_asignados.some(s => s.grupo === busquedaActiva.grupo));
      }
    }

    return filtrados;
  }, [titulares, salones, busquedaActiva]);

  const totalPaginas = Math.ceil(datosTabla.length / itemsPorPagina) || 1;
  const filasPaginadas = datosTabla.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);

  const abrirModalCrear = () => {
    setTitularTablaSelec(null); 
    setIsModalOpen(true);
  };

  const abrirModalEditar = () => {
    if (!titularTablaSelec) return alert("Seleccione una fila primero");
    setIsModalOpen(true);
  };

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
    { key: "nombre", label: "Titular" },
    { key: "asignaciones_str", label: "Asignaciones" }
  ];

  const userName = user?.nombre || "Usuario";
  const rol = roles[0] || (loadingRoles ? "Cargando rol..." : "Sin rol");

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={<Sidebar menuItems={menuItems} selectedMenu="Asignar Titular" user={{ nombre: userName, rol }} loadingRoles={loadingRoles} logout={logout} />}
      >
        <div className="asignaciones-wrapper page-master-wrapper">
          
          <div className="module-toolbar-container">
            <div className="toolbar-grouped-actions">
              

              <div className="searchbar-wrapper custom-asignacion-search">
                <div className="searchbar-field">
                  <label className="searchbar-label">Titular:</label>
                  <input 
                    type="text" 
                    className="searchbar-input" 
                    style={{ width: "200px" }}
                    placeholder="Buscar..." 
                    value={filtroTitularTexto} 
                    onChange={(e) => setFiltroTitularTexto(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleBusqueda(); }}
                  />
                </div>

                <div className="searchbar-field">
                  <label className="searchbar-label">Grado:</label>
                  <select className="searchbar-input" style={{ width: "120px" }} value={filtroGrado} onChange={(e) => { setFiltroGrado(e.target.value); setFiltroGrupo(""); }}>
                    <option value="">...</option>
                    {gradosUnicosBusqueda.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="searchbar-field">
                  <label className="searchbar-label">Grupo:</label>
                  <select className="searchbar-input" style={{ width: "90px" }} value={filtroGrupo} onChange={(e) => setFiltroGrupo(e.target.value)} disabled={!filtroGrado}>
                    <option value="">...</option>
                    {gruposDisponiblesBusqueda.map(s => <option key={s.id_salon} value={s.grupo}>{s.grupo}</option>)}
                  </select>
                </div>

                <button className="searchbar-btn" onClick={handleBusqueda}>Buscar</button>

                {busquedaActiva && (
                  <button className="clear-filter-btn" onClick={limpiarBusqueda} style={{ background: "none", border: "none", textDecoration: "underline", color: "#666", cursor: "pointer", fontSize: "16px", marginLeft: "5px" }}>
                    Limpiar
                  </button>
                )}
              </div>

              <div className="toolbar-actions-right">
                <ActionButtons 
                  botones={[
                    { label: "Asignar", onClick: abrirModalCrear, variante: "primary", siempreActivo: true }
                  ]} 
                />
              </div>

            </div>
          </div>

          <div className="main-area">
            <div className="table-layout-wrapper">
              
              <div className="table-main-section">
                <div className="datatable-fixed-container">
                  <DataTable 
                    columns={columnasTabla} 
                    rows={filasPaginadas} 
                    onRowClick={(fila) => setTitularTablaSelec(fila)}
                    emptyText="No hay titulares o no coinciden con la búsqueda"
                    filaActiva={titularTablaSelec}
                    idKey="id_usuario"
                  />
                </div>
                
                <div className="pagination-center">
                  <button className="btn-circle" onClick={() => { setPaginaActual(p => Math.max(1, p - 1)); setTitularTablaSelec(null); }} disabled={paginaActual === 1}><ChevronLeft size={20} /></button>
                  <button className="btn-circle" onClick={() => { setPaginaActual(p => Math.min(totalPaginas, p + 1)); setTitularTablaSelec(null); }} disabled={paginaActual === totalPaginas}><ChevronRight size={20} /></button>
                </div>
              </div>

              <div className="side-actions">
                <ActionButtons
                  filaSeleccionada={titularTablaSelec}
                  botones={[
                    { label: "Editar", onClick: abrirModalEditar, variante: "primary", siempreActivo: false }
                  ]}
                />
              </div>  

            </div>
          </div>
        </div>

        <AsignacionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titularSeleccionado={titularTablaSelec} titulares={titulares} salones={salones} alTerminar={cargarDatos} />
      </ModuleLayout>
    </div>
  );
};

export default AsignacionTitularesPage;