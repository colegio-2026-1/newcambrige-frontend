import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import "./UsuariosPage.css";

// ==========================================
// IMPORTACIONES
// ==========================================
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import DataTable from "../../components/shared/DataTable";

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

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(false);

  const toggleRol = (rol) => {
    setRolesSeleccionados(prev =>
      prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
    );
  };

  const handleCrear = async () => {
    if (!nombreUsuario || !documento || !password)
      return alert("Llena usuario, documento y contraseña");

    try {
      setCargando(true);
      const rolesParaBackend = rolesSeleccionados.map(r => mapaRolesFrontendABackend[r]);

      await crearUsuarioRequest({
        nombre: nombreUsuario,
        documento: documento,
        password: password,
        roles: rolesParaBackend
      });

      setNombreUsuario("");
      setDocumento("");
      setPassword("");
      setRolesSeleccionados([]);
      alTerminar();
      onClose();
    } catch (error) {
      alert(error.response?.data?.detail || "Error al crear.");
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
          <div className="modal-inputs-row">
            <div className="input-group">
              <label>Usuario</label>
              <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Documento</label>
              <input type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} />
            </div>
            <div className="input-group">
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

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState(true);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (usuario) {
      setNombreUsuario(usuario.nombre);
      setEstado(usuario.estado ?? true);
      setPassword("");
      const rolesLimpios = (usuario.roles || []).filter(r => r && typeof r === 'string');
      const rolesVisuales = rolesLimpios.map(r => mapaRolesBackendAFrontend[r] || r);
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
      const payloadBasico = { nombre: nombreUsuario, estado: estado };
      if (password) payloadBasico.password = password;

      await actualizarUsuarioRequest(usuario.id_usuario, payloadBasico);

      const rolesValidos = rolesSeleccionados.filter(r => r && typeof r === 'string');
      const rolesParaBackend = rolesValidos.map(r => mapaRolesFrontendABackend[r]);

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
          <div className="modal-inputs-row">
            <div className="input-group">
              <label>Usuario</label>
              <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Contraseña</label>
              <input type="password" placeholder="Nueva contraseña..." value={password} onChange={(e) => setPassword(e.target.value)} />
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
// COMPONENTE PRINCIPAL (CON ROLES GLOBALES)
// ==========================================
const UsuariosPage = () => {
  const { user, roles, loadingRoles, logout } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
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
    { key: "id_usuario", label: "Código" },
    { key: "nombre", label: "Usuario" },
    {
      key: "estado",
      label: "Estado",
      render: (val) => <span className={val ? 'badge--ok' : 'badge--no'}>{val ? 'Activo' : 'Inactivo'}</span>
    },
    { key: "rolesStr", label: "Roles" }
  ];

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
    u.id_usuario.toString().includes(filtroBusqueda)
  );

  const filasProcesadas = usuariosFiltrados.map(u => ({
    ...u,
    rolesStr: (u.roles || [])
      .filter(r => r && typeof r === 'string')
      .map(r => mapaRolesBackendAFrontend[r] || r)
      .join(" - ")
  }));

  const totalPaginas = Math.ceil(filasProcesadas.length / itemsPorPagina) || 1;
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const filasPaginadas = filasProcesadas.slice(startIndex, startIndex + itemsPorPagina);

  const userName = user?.nombre || "Usuario";
  const rol = roles[0] || (loadingRoles ? "Cargando rol..." : "Sin rol");

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu="Parametrización"
            user={{ nombre: userName, rol }}
            loadingRoles={loadingRoles}
            logout={logout}
          />
        }
      >
        <div className="usuarios-page-content">
          <div className="toolbar-custom">
            <label>Usuario</label>
            <input
              type="text"
              className="input-compacto"
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setPaginaActual(1); }}
            />
            <button className="btn-search-icon" onClick={() => setPaginaActual(1)}>
              <Search size={16} />
            </button>
            <button className="btn-editar" style={{ padding: '0 24px', height: '32px' }} onClick={() => setIsModalCrearOpen(true)}>
              Crear
            </button>
          </div>

          <div className="main-area" style={{ paddingTop: '20px' }}>
            {usuarios.length === 0 ? (
              <div className="empty-state">
                <p>Aún no hay usuarios registrados en el sistema</p>
              </div>
            ) : (
              <div className="table-layout-wrapper">
                <div className="table-main-section">
                  <div className="datatable-fixed-container">
                    <DataTable
                      columns={columnasTabla}
                      rows={filasPaginadas}
                      onRowClick={(fila) => setUsuarioSeleccionado(fila)}
                      emptyText="No se encontraron usuarios con esa búsqueda"
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
                <div className="side-actions">
                  <button className="btn-editar" disabled={!usuarioSeleccionado} onClick={() => setIsModalEditarOpen(true)}>
                    Editar
                  </button>
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