import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import "./AnioEscolarPage.css";

// Importaciones
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import DataTable from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";

import { useAuth } from "../../api/useAuth";
import { obtenerAniosRequest, crearAnioRequest, actualizarAnioRequest } from "../../api/endpointsParametrizacion";

// Iconos
import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import paraIcon from "../../assets/Parametrizacion/parametrizacion.svg";

// Helper para formatear el año
const formatAnioDoble = (anioStr) => {
  const anioNum = parseInt(anioStr);
  if (isNaN(anioNum)) return anioStr;
  return `${anioNum} - ${anioNum + 1}`;
};

// ==========================================
// COMPONENTE: SELECTOR DE AÑO DINÁMICO
// ==========================================
const YearPicker = ({ selectedYear, onYearSelect, placeholder = "Seleccionar año" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [baseYear, setBaseYear] = useState(selectedYear || new Date().getFullYear());
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const aniosVisibles = Array.from({ length: 16 }, (_, i) => baseYear + i);

  return (
    <div className="form-group" ref={popoverRef} style={{ width: '100%' }}>
      <div className="custom-year-picker" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedYear ? formatAnioDoble(selectedYear) : placeholder}</span>
        <CalendarIcon size={18} color="#3F5D93" />
      </div>

      {isOpen && (
        <div className="year-grid-popover">
          <div className="year-grid-header">
            <span>{aniosVisibles[0]} - {aniosVisibles[15]}</span>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button type="button" onClick={(e) => { e.stopPropagation(); setBaseYear(b => b - 16); }}><ChevronUp size={16} /></button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setBaseYear(b => b + 16); }}><ChevronDown size={16} /></button>
            </div>
          </div>
          <div className="year-grid">
            {aniosVisibles.map(anio => (
              <button 
                key={anio} 
                type="button"
                className={`year-btn ${anio === selectedYear ? 'active' : ''}`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onYearSelect(anio); 
                  setIsOpen(false); 
                }}
              >
                {anio}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MODAL (CREAR / EDITAR)
// ==========================================
const AnioModal = ({ isOpen, onClose, anioEdit, alTerminar }) => {
  if (!isOpen) return null;

  const isEdit = Boolean(anioEdit);
  
  const [anioInicio, setAnioInicio] = useState(new Date().getFullYear());
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [activo, setActivo] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (isEdit && anioEdit) {
      setAnioInicio(parseInt(anioEdit.nombre.substring(0, 4))); 
      setFechaInicio(anioEdit.fecha_inicio.split('T')[0]); 
      setFechaFin(anioEdit.fecha_fin.split('T')[0]);
      setActivo(anioEdit.activo);
    } else {
      setAnioInicio(new Date().getFullYear());
      setFechaInicio("");
      setFechaFin("");
      setActivo(true);
    }
  }, [isOpen, anioEdit]);

  const handleGuardar = async () => {
    if (!fechaInicio || !fechaFin) return alert("Por favor selecciona ambas fechas.");
    if (new Date(fechaInicio) >= new Date(fechaFin)) return alert("La fecha de fin debe ser posterior a la de inicio.");

    try {
      setCargando(true);
      const payload = {
        fecha_inicio: `${fechaInicio}T00:00:00`,
        fecha_fin: `${fechaFin}T23:59:59`,
        activo: activo
      };

      const ejecutarPeticion = async (forzarActivo) => {
        if (isEdit) {
          await actualizarAnioRequest(anioEdit.id_periodo, payload, forzarActivo);
        } else {
          payload.anio_inicio = parseInt(anioInicio);
          await crearAnioRequest(payload, forzarActivo);
        }
      };

      try {
        await ejecutarPeticion(false);
        alTerminar();
        onClose();
      } catch (error) {
        if (error.response?.status === 409) {
          const confirmar = window.confirm(`${error.response.data.detail}\n\n¿Deseas forzar el cambio y desactivar el año anterior?`);
          if (confirmar) {
            await ejecutarPeticion(true);
            alTerminar();
            onClose();
          }
        } else {
          alert(error.response?.data?.detail || "Error al guardar el periodo académico.");
        }
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEdit ? "ADMINISTRADOR" : "NUEVO AÑO ESCOLAR"}</h3>
          <button className="modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-row" style={{ justifyContent: "space-between" }}>
            <div style={{ flex: 0.6 }}>
              <label style={{fontWeight: 'bold', color: '#333', fontSize: '16px', display: 'block', marginBottom: '5px'}}>Año Escolar</label>
              {isEdit ? (
                <div className="input-style" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#d3d3d3', color: '#666' }}>
                  {formatAnioDoble(anioInicio)}
                </div>
              ) : (
                <YearPicker selectedYear={anioInicio} onYearSelect={setAnioInicio} />
              )}
            </div>
            
            <div className="toggle-wrapper">
              <span>Activo</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de Inicio</label>
              <input type="date" className="input-style" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Fecha de Fin</label>
              <input type="date" className="input-style" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} min={fechaInicio} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <ActionButtons
            botones={[
              { 
                label: "Aceptar", 
                onClick: handleGuardar, 
                variante: "primary",
                siempreActivo: true
              }
            ]}
          />
          <ActionButtons
            botones={[
              { 
                label: "Cancelar", 
                onClick: onClose, 
                variante: "secondary",
                siempreActivo: true
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const AnioEscolarPage = () => {
  const { user, logout } = useAuth();
  
  const [anios, setAnios] = useState([]);
  const [anioSeleccionado, setAnioSeleccionado] = useState(null);
  const [filtroAnio, setFiltroAnio] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalModeEdit, setModalModeEdit] = useState(false);

  // PAGINACIÓN
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const cargarAnios = async () => {
    try {
      const response = await obtenerAniosRequest();
      setAnios(response.data || []);
      setAnioSeleccionado(null); 
    } catch (error) {
      console.error("Error al cargar años escolares:", error);
    }
  };

  useEffect(() => { cargarAnios(); }, []);

  const aniosFiltrados = filtroAnio 
    ? anios.filter(a => parseInt(a.nombre.substring(0, 4)) === filtroAnio)
    : anios;

  const totalPaginas = Math.ceil(aniosFiltrados.length / itemsPorPagina) || 1;
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const aniosPaginados = aniosFiltrados.slice(startIndex, startIndex + itemsPorPagina);

  const menuItems = [
    { label: "Inicio", path: "/home" }, { label: "Dashboard" },
    { label: "Salón", icon: salonIcon, path: "/salon" },
    { label: "Uniformes", icon: uniformesIcon, path: "/objetos" },
    { label: "Tesorería", icon: tesoreriaIcon, path: "/tesoreria" },
    { label: "Rectoría", icon: rectoriaIcon, path: "/rectoria" },
    { label: "Parametrización", icon: paraIcon, path: "/parametrizacion" },
  ];

  const columnasTabla = [
    { 
      key: "nombre", 
      label: "AÑO ESCOLAR",
      render: (val) => formatAnioDoble(val) 
    },
    { 
      key: "fecha_inicio", 
      label: "FECHA INICIO",
      render: (val) => new Date(val).toLocaleDateString('es-CO', { timeZone: 'UTC' })
    },
    { 
      key: "fecha_fin", 
      label: "FECHA FIN",
      render: (val) => new Date(val).toLocaleDateString('es-CO', { timeZone: 'UTC' })
    },
    { 
      key: "activo", 
      label: "ESTADO", 
      render: (val) => <span style={{ color: val ? "#008000" : "#D00000", fontWeight: "bold" }}>{val ? 'Activo' : 'Cerrado'}</span> 
    }
  ];

  const abrirModalCrear = () => { setModalModeEdit(false); setIsModalOpen(true); };
  const abrirModalEditar = () => { setModalModeEdit(true); setIsModalOpen(true); };

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={<Sidebar menuItems={menuItems} selectedMenu="Parametrización" user={{ nombre: user?.nombre || "Usuario", rol: user?.rol || "TITULAR" }} logout={logout} />}
      >
        <div className="anio-content">
          
          <div className="toolbar-custom">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span className="toolbar-title" style={{ marginRight: '10px' }}>Año Escolar:</span>
              
              <div style={{ width: '200px' }}>
                <YearPicker 
                  selectedYear={filtroAnio} 
                  onYearSelect={(anio) => { setFiltroAnio(anio); setPaginaActual(1); }} 
                  placeholder="Todos los años"
                />
              </div>
              
              {filtroAnio && (
                <button 
                  onClick={() => { setFiltroAnio(null); setPaginaActual(1); }}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Limpiar Filtro
                </button>
              )}
            </div>
            
            <ActionButtons
              botones={[
                { 
                  label: "Crear", 
                  onClick: abrirModalCrear, 
                  variante: "primary",
                  siempreActivo: true 
                }
              ]}
            />
          </div>

          <div className="main-area">
            {anios.length === 0 ? (
              <div className="empty-state">
                <p>Aún no hay años escolares registrados</p>
              </div>
            ) : aniosFiltrados.length === 0 ? (
                <div className="empty-state">
                  <p>No se encontraron registros para el año {formatAnioDoble(filtroAnio)}</p>
                </div>
            ) : (
              <div className="table-layout-wrapper">
                
                <div className="table-main-section">
                  <div className="datatable-fixed-container">
                    <DataTable 
                      columns={columnasTabla} 
                      rows={aniosPaginados} 
                      onRowClick={(fila) => setAnioSeleccionado(fila)}
                      emptyText="No hay años registrados"
                      filaActiva={anioSeleccionado}
                      idKey="id_periodo"
                    />
                  </div>
                  
                  <div className="pagination-center">
                    <button 
                      className="btn-circle"
                      onClick={() => { setPaginaActual(p => Math.max(1, p - 1)); setAnioSeleccionado(null); }}
                      disabled={paginaActual === 1}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      className="btn-circle"
                      onClick={() => { setPaginaActual(p => Math.min(totalPaginas, p + 1)); setAnioSeleccionado(null); }}
                      disabled={paginaActual === totalPaginas}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="side-actions">
                  <ActionButtons
                    filaSeleccionada={anioSeleccionado}
                    botones={[
                      { 
                        label: "Editar", 
                        onClick: abrirModalEditar, 
                        variante: "primary",
                        siempreActivo: false 
                      }
                    ]}
                  />
                </div>

              </div>
            )}
          </div>
        </div>

        <AnioModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          anioEdit={modalModeEdit ? anioSeleccionado : null} 
          alTerminar={cargarAnios} 
        />
      </ModuleLayout>
    </div>
  );
};

export default AnioEscolarPage;