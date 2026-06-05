import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import "./TiposPruebaPage.css";

// ==========================================
// IMPORTACIONES
// ==========================================
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import DataTable from "../../components/shared/DataTable";
import SearchBar from "../../components/shared/SearchBar";
import ActionButtons from "../../components/shared/ActionButtons";

import { useAuth } from "../../api/useAuth";
import { 
  obtenerTiposPruebaRequest,
  crearTipoPruebaRequest,
  actualizarTipoPruebaRequest
} from "../../api/endpointsParametrizacion";

// Iconos 
import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import paraIcon from "../../assets/Parametrizacion/parametrizacion.svg";

// Constantes de Grados Escolares
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
      setNombre(pruebaEdit.nombre);
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
  }, [isOpen, pruebaEdit]);

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
    const val = parseInt(valor);
    if (tipo === 'min') {
      setGradoMin(val);
      if (val > gradoMax) setGradoMax(val); 
      determinarRangoPorGrados(val, Math.max(val, gradoMax));
    } else {
      setGradoMax(val);
      if (val < gradoMin) setGradoMin(val); 
      determinarRangoPorGrados(Math.min(val, gradoMin), val);
    }
  };

  const handleGuardar = async () => {
    if (!nombre) return alert("El nombre de la prueba es obligatorio.");
    
    try {
      setCargando(true);
      const payload = {
        grado_min: gradoMin,
        grado_max: gradoMax,
        descripcion: descripcion
      };

      if (isEdit) {
        await actualizarTipoPruebaRequest(pruebaEdit.id_tipo_prueba, payload);
      } else {
        payload.nombre = nombre; 
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEdit ? `PRUEBA - ${nombre}` : "NUEVA PRUEBA"}</h3>
          <button className="modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        <div className="modal-body">
        <div className="modal-form-row">
          {!isEdit && (
            <div className="input-group">
              <label>Prueba</label>
              <input type="text" placeholder="Ej: Saber 11" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
          )}
          <div className="input-group">
            <label>Descripción</label>
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Rango</label>
            <select value={rangoSelect} onChange={handleRangoChange}>
              <option value="Todo">Todo</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
              <option value="Personalizado">Personalizado</option>
            </select>
          </div>
        </div>

          <div className="modal-form-row">
            <div className="input-group">
              <label>Grado Inicial</label>
              <select value={gradoMin} onChange={(e) => handleGradoManualChange('min', e.target.value)}>
                {GRADOS_ESCOLARES.map(g => (
                  <option key={`min-${g.id}`} value={g.id}>{g.label}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Grado Final</label>
              <select value={gradoMax} onChange={(e) => handleGradoManualChange('max', e.target.value)}>
                {GRADOS_ESCOLARES.map(g => (
                  <option key={`max-${g.id}`} value={g.id}>{g.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grados-section">
            <h4>GRADOS</h4>
            <div className="grados-grid">
              {GRADOS_ESCOLARES.map(grado => {
                const estaIluminado = grado.id >= gradoMin && grado.id <= gradoMax;
                return (
                  <div key={grado.id} className={`grado-caja ${estaIluminado ? 'iluminado' : ''}`}>
                    {grado.label}
                  </div>
                );
              })}
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
    }
  };

  useEffect(() => { cargarPruebas(); }, []);

  const menuItems = [
    { label: "Inicio", path: "/home" }, { label: "Dashboard" },
    { label: "Salón", icon: salonIcon, path: "/salon" },
    { label: "Uniformes", icon: uniformesIcon, path: "/objetos" },
    { label: "Tesorería", icon: tesoreriaIcon, path: "/tesoreria" },
    { label: "Rectoría", icon: rectoriaIcon, path: "/rectoria" },
    { label: "Parametrización", icon: paraIcon, path: "/parametrizacion" },
  ];

  const columnasTabla = [
    { key: "id_tipo_prueba", label: "Código" },
    { key: "nombre", label: "Prueba" },
    { key: "descripcion", label: "Descripción", render: (val) => val || "Sin descripción" },
    { key: "rango_str", label: "Rango de Grados" }
  ];

  const pruebasFiltradas = pruebas.filter(p => 
    p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase())
  );

  const filasProcesadas = pruebasFiltradas.map(p => ({
    ...p,
    rango_str: `De ${p.grado_min} a ${p.grado_max}`
  }));

  const totalPaginas = Math.ceil(filasProcesadas.length / itemsPorPagina) || 1;
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const filasPaginadas = filasProcesadas.slice(startIndex, startIndex + itemsPorPagina);

  const abrirModalCrear = () => { setModalModeEdit(false); setIsModalOpen(true); };
  const abrirModalEditar = () => { setModalModeEdit(true); setIsModalOpen(true); };

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={<Sidebar menuItems={menuItems} selectedMenu="Parametrización" user={{ nombre: user?.nombre || "Usuario", rol: user?.rol || "TITULAR" }} logout={logout} />}
      >
        <div className="tipos-prueba-content">
          
          <div className="module-toolbar-container">
            {/* Contenedor extra para obligar a flexbox a pegar los elementos */}
            <div className="toolbar-grouped-actions">
              <SearchBar
                fields={[
                  { key: 'busqueda', label: 'Prueba:', type: 'text' }
                ]}
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
                <p>Aún no hay pruebas registradas</p>
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
                      filaActiva={pruebaSeleccionada}
                      idKey="id_tipo_prueba"
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