import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import "./TiposPruebaPage.css";

// ==========================================
// IMPORTACIONES
// ==========================================
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import DataTable from "../../components/shared/DataTable";
import SearchBar from "../../components/shared/searchBar";
import ActionButtons from "../../components/shared/ActionButtons";

import { useAuth } from "../../api/useAuth";
import { 
  obtenerTiposPruebaRequest,
  crearTipoPruebaRequest,
  actualizarTipoPruebaRequest
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

const GRADOS_ESCOLARES = [
  { id: 1, label: "Primero" }, { id: 2, label: "Segundo" }, { id: 3, label: "Tercero" },
  { id: 4, label: "Cuarto" }, { id: 5, label: "Quinto" }, { id: 6, label: "Sexto" },
  { id: 7, label: "Séptimo" }, { id: 8, label: "Octavo" }, { id: 9, label: "Noveno" },
  { id: 10, label: "Décimo" }, { id: 11, label: "Once" }
];

// ==========================================
// MODAL UNIFICADO (CREAR / EDITAR)
// ==========================================
const PruebaModal = ({ isOpen, onClose, pruebaEdit, alTerminar }) => {
  if (!isOpen) return null;

  const isEdit = Boolean(pruebaEdit);
  
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [rangoSelect, setRangoSelect] = useState("Todo");
  const [gradoMin, setGradoMin] = useState(1);
  const [gradoMax, setGradoMax] = useState(11);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (isEdit && pruebaEdit) {
      setNombre(pruebaEdit.nombre || "");
      setDescripcion(pruebaEdit.descripcion || "");
      setGradoMin(pruebaEdit.grado_min);
      setGradoMax(pruebaEdit.grado_max);
      determinarRangoPorGrados(pruebaEdit.grado_min, pruebaEdit.grado_max);
    } else {
      setNombre("");
      setDescripcion("");
      setRangoSelect("Todo");
      setGradoMin(1);
      setGradoMax(11);
    }
  }, [isOpen, pruebaEdit, isEdit]);

  const determinarRangoPorGrados = (min, max) => {
    if (min === 1 && max === 11) setRangoSelect("Todo");
    else if (min === 1 && max === 5) setRangoSelect("Primaria");
    else if (min === 6 && max === 11) setRangoSelect("Secundaria");
    else setRangoSelect("Personalizado");
  };

  const handleRangoChange = (e) => {
    const val = e.target.value;
    setRangoSelect(val);
    if (val === "Todo") { setGradoMin(1); setGradoMax(11); }
    else if (val === "Primaria") { setGradoMin(1); setGradoMax(5); }
    else if (val === "Secundaria") { setGradoMin(6); setGradoMax(11); }
  };

  const handleGradoManualChange = (tipo, valor) => {
    const val = parseInt(valor, 10);
    if (tipo === 'min') {
      const newMin = val;
      const newMax = Math.max(newMin, gradoMax);
      setGradoMin(newMin);
      setGradoMax(newMax);
      determinarRangoPorGrados(newMin, newMax);
    } else {
      const newMax = val;
      const newMin = Math.min(gradoMin, newMax);
      setGradoMax(newMax);
      setGradoMin(newMin);
      determinarRangoPorGrados(newMin, newMax);
    }
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) return alert("El nombre de la prueba es obligatorio.");
    if (gradoMin > gradoMax) return alert("El grado inicial no puede ser mayor al grado final.");
    
    try {
      setCargando(true);
      const payload = {
        nombre: nombre.trim(),
        grado_min: gradoMin,
        grado_max: gradoMax,
        descripcion: descripcion.trim() || null
      };

      if (isEdit) {
        await actualizarTipoPruebaRequest(pruebaEdit.id_tipo_prueba, payload);
      } else {
        await crearTipoPruebaRequest(payload);
      }
      
      alTerminar();
      onClose();
    } catch (error) {
      alert(error.response?.data?.detail || "Error al guardar el tipo de prueba.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="tp-modal-overlay">
      <div className="tp-modal-content">
        <div className="tp-modal-header">
          <h3>{isEdit ? `EDITAR PRUEBA: ${nombre}` : "NUEVA PRUEBA"}</h3>
          <button className="tp-modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        
        <div className="tp-modal-body">
          <div className="tp-modal-form-row">
            <div className="tp-input-group">
              <label>Prueba </label>
              <input type="text" placeholder="Ej: Saber 11" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={cargando} />
            </div>
            <div className="tp-input-group">
              <label>Descripción</label>
              <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} disabled={cargando} />
            </div>
            <div className="tp-input-group">
              <label>Rango</label>
              <select value={rangoSelect} onChange={handleRangoChange} disabled={cargando}>
                <option value="Todo">Todo</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Personalizado">Personalizado</option>
              </select>
            </div>
          </div>

          <div className="tp-modal-form-row">
            <div className="tp-input-group">
              <label>Grado Inicial</label>
              <select value={gradoMin} onChange={(e) => handleGradoManualChange('min', e.target.value)} disabled={cargando}>
                {GRADOS_ESCOLARES.map(g => <option key={`min-${g.id}`} value={g.id}>{g.label}</option>)}
              </select>
            </div>
            <div className="tp-input-group">
              <label>Grado Final</label>
              <select value={gradoMax} onChange={(e) => handleGradoManualChange('max', e.target.value)} disabled={cargando}>
                {GRADOS_ESCOLARES.map(g => <option key={`max-${g.id}`} value={g.id}>{g.label}</option>)}
              </select>
            </div>
          </div>

          <div className="tp-grados-section">
            <h4>GRADOS</h4>
            <div className="tp-grados-grid">
              {GRADOS_ESCOLARES.map(grado => {
                const estaIluminado = grado.id >= gradoMin && grado.id <= gradoMax;
                return (
                  <div key={grado.id} className={`tp-grado-caja ${estaIluminado ? 'iluminado' : ''}`}>
                    {grado.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="tp-modal-footer">
          <button className="tp-btn-primary" onClick={handleGuardar} disabled={cargando}>
            {cargando ? "Guardando..." : "Aceptar"}
          </button>
          <button className="tp-btn-secondary" onClick={onClose} disabled={cargando}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const TiposPruebaPage = () => {
  const { user, logout } = useAuth();
  
  const [pruebas, setPruebas] = useState([]);
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalModeEdit, setModalModeEdit] = useState(false); 

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const cargarPruebas = async () => {
    try {
      const response = await obtenerTiposPruebaRequest();
      setPruebas(response.data || []);
      setPruebaSeleccionada(null); 
    } catch (error) {
      console.error("Error al cargar tipos de prueba:", error);
      alert("No se pudieron cargar las pruebas. Verifique la conexión.");
    }
  };

  useEffect(() => { cargarPruebas(); }, []);

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
    { key: "id_tipo_prueba", label: "Código" },
    { key: "nombre", label: "Prueba" },
    { key: "descripcion", label: "Descripción", render: (val) => val || "Sin descripción" },
    { key: "rango", label: "Rango de Grados", render: (_, row) => `De ${row.grado_min} a ${row.grado_max}` }
  ];

  const pruebasFiltradas = useMemo(() => {
    return pruebas.filter(p => 
      (p.nombre || "").toLowerCase().includes(filtroBusqueda.toLowerCase())
    );
  }, [pruebas, filtroBusqueda]);

  const totalPaginas = Math.ceil(pruebasFiltradas.length / itemsPorPagina) || 1;

  const filasPaginadas = useMemo(() => {
    const startIndex = (paginaActual - 1) * itemsPorPagina;
    return pruebasFiltradas.slice(startIndex, startIndex + itemsPorPagina);
  }, [pruebasFiltradas, paginaActual]);

  const abrirModalCrear = () => { 
    setModalModeEdit(false); 
    setIsModalOpen(true); 
  };
  
  const abrirModalEditar = () => { 
    if (!pruebaSeleccionada) {
      alert("Seleccione una prueba para editar.");
      return;
    }
    setModalModeEdit(true); 
    setIsModalOpen(true); 
  };

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={<Sidebar menuItems={menuItems} selectedMenu="Pruebas" user={{ nombre: user?.nombre || "Usuario", rol: user?.rol || "TITULAR" }} logout={logout} />}
      >
        <div className="tipos-prueba-wrapper page-master-wrapper">
          
          <div className="module-toolbar-container">
            <div className="toolbar-grouped-actions">
              <SearchBar
                fields={[ { key: 'busqueda', label: 'Prueba:', type: 'text' } ]}
                onSearch={(filtros) => {
                  setFiltroBusqueda(filtros.busqueda || "");
                  setPaginaActual(1);
                }}
              />
              
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
          </div>

          <div className="main-area">
            {pruebas.length === 0 ? (
              <div className="empty-state">
              </div>
            ) : (
              <div className="table-layout-wrapper">
                
                <div className="table-main-section">
                  <div className="datatable-fixed-container">
                    <DataTable 
                      columns={columnasTabla} 
                      rows={filasPaginadas} 
                      onRowClick={(fila) => setPruebaSeleccionada(fila)}
                      emptyText="No se encontraron pruebas con esa búsqueda"
                      idKey="id_tipo_prueba"
                      filaActiva={pruebaSeleccionada}
                    />
                  </div>
                  
                  <div className="pagination-center">
                    <button 
                      className="btn-circle"
                      onClick={() => { setPaginaActual(p => Math.max(1, p - 1)); setPruebaSeleccionada(null); }}
                      disabled={paginaActual === 1}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      className="btn-circle"
                      onClick={() => { setPaginaActual(p => Math.min(totalPaginas, p + 1)); setPruebaSeleccionada(null); }}
                      disabled={paginaActual === totalPaginas}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="side-actions">
                  <ActionButtons
                    filaSeleccionada={pruebaSeleccionada}
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

        <PruebaModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          pruebaEdit={modalModeEdit ? pruebaSeleccionada : null} 
          alTerminar={cargarPruebas} 
        />
      </ModuleLayout>
    </div>
  );
};

export default TiposPruebaPage;