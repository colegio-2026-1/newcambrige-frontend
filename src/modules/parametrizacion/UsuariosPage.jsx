import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import "./UsuariosPage.css";

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
  obtenerUsuariosRequest, 
  crearUsuarioRequest, 
  actualizarUsuarioRequest, 
  asignarRolesRequest 
} from "../../api/usuariosService";

import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import paraIcon from "../../assets/Parametrizacion/parametrizacion.svg";

// ==========================================
// DICCIONARIOS DE TRADUCCIÓN DE ROLES
// ==========================================
const mapaRolesFrontendABackend = {
  "Robot": "robot", "Salón": "salon", "Tesorería": "tesoreria",
  "Rectoría": "rectoria", "Uniformes": "uniformes", "Banda": "banda",
  "Parametrización": "parametrizacion", "Dashboard": "dashboard"
};

const mapaRolesBackendAFrontend = Object.fromEntries(
  Object.entries(mapaRolesFrontendABackend).map(([k, v]) => [v, k])
);

const rolesDisponibles = Object.keys(mapaRolesFrontendABackend);

// ==========================================
// MODAL PARA CREAR USUARIO
// ==========================================
const CrearUsuarioModal = ({ isOpen, onClose, alTerminar }) => {
  if (!isOpen) return null;

  const [documento, setDocumento] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(false);

  const toggleRol = (rol) => {
    setRolesSeleccionados(prev => 
      prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
    );
  };

  const handleCrear = async () => {
    if (!documento || !nombreUsuario || !password) return alert("Llena documento, usuario y contraseña");

    try {
      setCargando(true);
      const rolesParaBackend = rolesSeleccionados.map(r => mapaRolesFrontendABackend[r]);
      
      await crearUsuarioRequest({
        documento: documento,
        nombre: nombreUsuario,
        password: password,
        roles: rolesParaBackend
      });
      
      setDocumento(""); setNombreUsuario(""); setPassword(""); setRolesSeleccionados([]);
      alTerminar(); 
      onClose();
    } catch (error) {
      alert(error.response?.data?.detail || "Error al crear el usuario.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>ADMINISTRADOR</h3>
          <button className="modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        <div className="modal-body">
          {/* FILA 1: Usuario y Documento */}
          <div className="modal-inputs-row">
            <div className="input-group">
              <label>Usuario</label>
              <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} placeholder="Nombre completo" />
            </div>
            <div className="input-group">
              <label>Documento</label>
              <input type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} placeholder="Ej: 1005..." />
            </div>
          </div>
          
          {/* FILA 2: Contraseña */}
          <div className="modal-inputs-row">
            <div className="input-group" style={{ flex: 0.5 }}>
              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="roles-section">
            <h4>ROLES</h4>
            <div className="roles-grid">
              {rolesDisponibles.map(rol => (
                <button key={rol} className={`rol-btn ${rolesSeleccionados.includes(rol) ? 'active' : ''}`} onClick={() => toggleRol(rol)}>
                  {rol}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={handleCrear} disabled={cargando}>Aceptar</button>
          <button className="btn-secondary" onClick={onClose} disabled={cargando}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MODAL PARA EDITAR USUARIO
// ==========================================
const EditarUsuarioModal = ({ isOpen, onClose, usuario, alTerminar }) => {
  if (!isOpen || !usuario) return null;

  const [documento, setDocumento] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState(""); 
  const [estado, setEstado] = useState(true);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuario) {
      setDocumento(usuario.documento || "");
      setNombreUsuario(usuario.nombre);
      setEstado(usuario.estado ?? true);
      setPassword(""); 
      const rolesVisuales = (usuario.roles || []).map(r => mapaRolesBackendAFrontend[r] || r);
      setRolesSeleccionados(rolesVisuales);
    }
  }, [usuario]);

  const toggleRol = (rol) => {
    setRolesSeleccionados(prev => 
      prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
    );
  };

  const handleActualizar = async () => {
    try {
      setCargando(true);
      const payloadBasico = { documento: documento, nombre: nombreUsuario, estado: estado };
      if (password) payloadBasico.password = password; 
      
      await actualizarUsuarioRequest(usuario.id_usuario, payloadBasico);

      const rolesParaBackend = rolesSeleccionados.map(r => mapaRolesFrontendABackend[r]);
      await asignarRolesRequest(usuario.id_usuario, { roles: rolesParaBackend });

      alTerminar();
      onClose();
    } catch (error) {
      alert(error.response?.data?.detail || "Error al actualizar.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>EDITAR USUARIO</h3>
          <button className="modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        <div className="modal-body">
          {/* FILA 1: Usuario y Documento */}
          <div className="modal-inputs-row">
            <div className="input-group">
              <label>Usuario</label>
              <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Documento</label>
              <input type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} />
            </div>
          </div>
          
          {/* FILA 2: Contraseña y Estado */}
          <div className="modal-inputs-row">
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" placeholder="Nueva contraseña (opcional)..." value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="toggle-group">
              <label>{estado ? "Activo" : "Inactivo"}</label>
              <label className="switch">
                <input type="checkbox" checked={estado} onChange={(e) => setEstado(e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="roles-section">
            <h4>ROLES</h4>
            <div className="roles-grid">
              {rolesDisponibles.map(rol => (
                <button key={rol} className={`rol-btn ${rolesSeleccionados.includes(rol) ? 'active' : ''}`} onClick={() => toggleRol(rol)}>
                  {rol}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={handleActualizar} disabled={cargando}>Aceptar</button>
          <button className="btn-secondary" onClick={onClose} disabled={cargando}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const UsuariosPage = () => {
  const { user, logout } = useAuth();
  
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  
  // Estado para el buscador
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  
  const [isModalCrearOpen, setIsModalCrearOpen] = useState(false);
  const [isModalEditarOpen, setIsModalEditarOpen] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const cargarUsuarios = async () => {
    try {
      const response = await obtenerUsuariosRequest();
      setUsuarios(response.data || []);
      setUsuarioSeleccionado(null); 
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const menuItems = [
    { label: "Inicio", path: "/home" }, { label: "Dashboard" },
    { label: "Salón", icon: salonIcon, path: "/salon" },
    { label: "Uniformes", icon: uniformesIcon, path: "/uniformes" },
    { label: "Tesorería", icon: tesoreriaIcon, path: "/tesoreria" },
    { label: "Rectoría", icon: rectoriaIcon, path: "/rectoria" },
    { label: "Parametrización", icon: paraIcon, path: "/parametrizacion" },
  ];

  const columnasTabla = [
    { key: "nombre", label: "USUARIO" },
    { key: "documento", label: "DOCUMENTO", render: (val) => val || "—" },
    { 
      key: "estado", 
      label: "ESTADO", 
      render: (val) => <span style={{ color: val ? "#008000" : "#D00000", fontWeight: "bold" }}>{val ? 'Activo' : 'Inactivo'}</span>
    },
    { key: "rolesStr", label: "ROLES" }
  ];

  // Filtramos utilizando el valor capturado por el SearchBar
  const usuariosFiltrados = usuarios.filter(u => {
    const termino = filtroBusqueda.toLowerCase();
    const doc = (u.documento || "").toLowerCase();
    const nom = (u.nombre || "").toLowerCase();
    return doc.includes(termino) || nom.includes(termino);
  });

  const filasProcesadas = usuariosFiltrados.map(u => ({
    ...u,
    rolesStr: (u.roles || []).map(r => mapaRolesBackendAFrontend[r] || r).join(" - ")
  }));

  const totalPaginas = Math.ceil(filasProcesadas.length / itemsPorPagina) || 1;
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const filasPaginadas = filasProcesadas.slice(startIndex, startIndex + itemsPorPagina);

return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={<Sidebar menuItems={menuItems} selectedMenu="Parametrización" user={{ nombre: user?.nombre || "Usuario", rol: user?.rol || "TITULAR" }} logout={logout} />}
      >
        <div className="usuarios-page-content">
          
          {/* BARRA DE BÚSQUEDA Y BOTÓN CREAR AGRUPADOS */}
          <div className="usuarios-toolbar-container">
            <SearchBar
              fields={[
                { key: 'busqueda', label: 'Buscar usuario:', type: 'text' }
              ]}
              onSearch={(filtros) => {
                setFiltroBusqueda(filtros.busqueda || "");
                setPaginaActual(1);
              }}
            />
            
            {/* BOTÓN CREAR al lado del de buscar */}
            <button className="btn-crear-top" onClick={() => setIsModalCrearOpen(true)}>
              Crear
            </button>
          </div>

          <div className="main-area">
            {usuarios.length === 0 ? (
              <div className="empty-state">
                <p>Aún no hay usuarios registrados en el sistema</p>
              </div>
            ) : (
              <div className="table-layout-wrapper">
                
                {/* LADO IZQUIERDO: Tabla + Paginación */}
                <div className="table-main-section">
                  <div className="datatable-fixed-container">
                    <DataTable 
                      columns={columnasTabla} 
                      rows={filasPaginadas} 
                      onRowClick={(fila) => setUsuarioSeleccionado(fila)}
                      emptyText="No se encontraron usuarios con esa búsqueda"
                      filaActiva={usuarioSeleccionado}
                      idKey="id_usuario"
                    />
                  </div>
                  
                  <div className="pagination-center">
                    <button 
                      className="btn-circle"
                      onClick={() => { setPaginaActual(p => Math.max(1, p - 1)); setUsuarioSeleccionado(null); }}
                      disabled={paginaActual === 1}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      className="btn-circle"
                      onClick={() => { setPaginaActual(p => Math.min(totalPaginas, p + 1)); setUsuarioSeleccionado(null); }}
                      disabled={paginaActual === totalPaginas}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* LADO DERECHO: ActionButtons (Solo Editar en color amarillo) */}
                <div className="side-actions">
                  <ActionButtons
                    filaSeleccionada={usuarioSeleccionado}
                    botones={[
                      { 
                        label: "Editar", 
                        onClick: () => setIsModalEditarOpen(true), 
                        siempreActivo: false, 
                        variante: "primary" 
                      }
                    ]}
                  />
                </div>

              </div>
            )}
          </div>
        </div>

        <CrearUsuarioModal isOpen={isModalCrearOpen} onClose={() => setIsModalCrearOpen(false)} alTerminar={cargarUsuarios} />
        <EditarUsuarioModal isOpen={isModalEditarOpen} onClose={() => setIsModalEditarOpen(false)} usuario={usuarioSeleccionado} alTerminar={cargarUsuarios} />
      </ModuleLayout>
    </div>
  );
};

export default UsuariosPage;