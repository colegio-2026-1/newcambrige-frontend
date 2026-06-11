import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./UsuariosPage.css";

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

const mapaRolesFrontendABackend = {
  "Robot": "robot", "Salón": "salon", "Tesorería": "tesoreria",
  "Rectoría": "rectoria", "Uniformes": "uniformes", "Banda": "banda",
  "Parametrización": "parametrizacion", "Dashboard": "dashboard", "Titular": "titular"
};

const mapaRolesBackendAFrontend = Object.fromEntries(
  Object.entries(mapaRolesFrontendABackend).map(([k, v]) => [v, k])
);

const rolesDisponibles = Object.keys(mapaRolesFrontendABackend);

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
    <div className="usuarios-modal-overlay">
      <div className="usuarios-modal-content">
        <div className="usuarios-modal-header">
          <h3>ADMINISTRADOR</h3>
          <button className="usuarios-modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        <div className="usuarios-modal-body">
          <div className="usuarios-modal-form-row">
            <div className="usuarios-input-group">
              <label>Usuario</label>
              <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
            </div>
            <div className="usuarios-input-group">
              <label>Documento</label>
              <input type="text" value={documento} onChange={(e) => setDocumento(e.target.value)} />
            </div>
            <div className="usuarios-input-group">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="usuarios-roles-section">
            <h4>ROLES</h4>
            <div className="usuarios-roles-grid">
              {rolesDisponibles.map(rol => (
                <button key={rol} className={`usuarios-rol-btn ${rolesSeleccionados.includes(rol) ? 'active' : ''}`} onClick={() => toggleRol(rol)}>
                  {rol}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="usuarios-modal-footer">
          <ActionButtons botones={[{ label: "Aceptar", onClick: handleCrear, variante: "primary", siempreActivo: true }]} />
          <ActionButtons botones={[{ label: "Cancelar", onClick: onClose, variante: "secondary", siempreActivo: true }]} />
        </div>
      </div>
    </div>
  );
};

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
    <div className="usuarios-modal-overlay">
      <div className="usuarios-modal-content">
        <div className="usuarios-modal-header">
          <h3>EDITAR USUARIO</h3>
          <button className="usuarios-modal-close" onClick={onClose} disabled={cargando}>×</button>
        </div>
        <div className="usuarios-modal-body">
          <div className="usuarios-modal-form-row">
            <div className="usuarios-input-group">
              <label>Usuario</label>
              <input type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
            </div>
            <div className="usuarios-input-group">
              <label>Contraseña</label>
              <input type="password" placeholder="Nueva contraseña..." value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="usuarios-input-group usuarios-toggle-group">
              <label>{estado ? "Activo" : "Inactivo"}</label>
              <label className="usuarios-toggle-switch">
                <input type="checkbox" checked={estado} onChange={(e) => setEstado(e.target.checked)} />
                <span className="usuarios-slider"></span>
              </label>
            </div>
          </div>
          <div className="usuarios-roles-section">
            <h4>ROLES</h4>
            <div className="usuarios-roles-grid">
              {rolesDisponibles.map(rol => (
                <button key={rol} className={`usuarios-rol-btn ${rolesSeleccionados.includes(rol) ? 'active' : ''}`} onClick={() => toggleRol(rol)}>
                  {rol}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="usuarios-modal-footer">
          <ActionButtons botones={[{ label: "Aceptar", onClick: handleActualizar, variante: "primary", siempreActivo: true }]} />
          <ActionButtons botones={[{ label: "Cancelar", onClick: onClose, variante: "secondary", siempreActivo: true }]} />
        </div>
      </div>
    </div>
  );
};

const UsuariosPage = () => {
  const { user, roles, loadingRoles, logout } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({ busqueda: "" });

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
    { key: "id_usuario", label: "Código" },
    { key: "nombre", label: "Usuario" },
    {
      key: "estado",
      label: "Estado",
      render: (val) => <span className={val ? 'usuarios-badge-ok' : 'usuarios-badge-no'}>{val ? 'Activo' : 'Inactivo'}</span>
    },
    { key: "rolesStr", label: "Roles" }
  ];

  const filasProcesadas = useMemo(() => {
    const termino = (filtros.busqueda || "").toLowerCase();
    
    return usuarios
      .filter(u =>
        u.nombre.toLowerCase().includes(termino) ||
        u.id_usuario.toString().includes(termino)
      )
      .map(u => ({
        ...u,
        rolesStr: (u.roles || [])
          .filter(r => r && typeof r === 'string')
          .map(r => mapaRolesBackendAFrontend[r] || r)
          .join(" - ")
      }));
  }, [usuarios, filtros]);

  const totalPaginas = Math.ceil(filasProcesadas.length / itemsPorPagina) || 1;

  const filasPaginadas = useMemo(() => {
    const startIndex = (paginaActual - 1) * itemsPorPagina;
    return filasProcesadas.slice(startIndex, startIndex + itemsPorPagina);
  }, [filasProcesadas, paginaActual]);

  const userName = user?.nombre || "Usuario";
  const rol = roles[0] || (loadingRoles ? "Cargando rol..." : "Sin rol");

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu="Usuarios"
            user={{ nombre: userName, rol }}
            loadingRoles={loadingRoles}
            logout={logout}
          />
        }
      >
        <div className="usuarios-wrapper page-master-wrapper">
          
          <div className="module-toolbar-container">
            <div className="toolbar-grouped-actions">
              <SearchBar
                fields={[
                  { key: 'busqueda', label: 'Usuario:', type: 'text' }
                ]}
                onSearch={(nuevosFiltros) => {
                  setFiltros(nuevosFiltros);
                  setPaginaActual(1);
                }}
              />
              
              <ActionButtons
                botones={[
                  { 
                    label: "Crear", 
                    onClick: () => setIsModalCrearOpen(true), 
                    variante: "primary",
                    siempreActivo: true 
                  }
                ]}
              />
            </div>
          </div>

          <div className="main-area">
            {usuarios.length === 0 ? (
              <div className="empty-state">
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

                <div className="side-actions">
                  <ActionButtons
                    filaSeleccionada={usuarioSeleccionado}
                    botones={[
                      { 
                        label: "Editar", 
                        onClick: () => setIsModalEditarOpen(true), 
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

        <CrearUsuarioModal isOpen={isModalCrearOpen} onClose={() => setIsModalCrearOpen(false)} alTerminar={cargarUsuarios} />
        <EditarUsuarioModal isOpen={isModalEditarOpen} onClose={() => setIsModalEditarOpen(false)} usuario={usuarioSeleccionado} alTerminar={cargarUsuarios} />
      </ModuleLayout>
    </div>
  );
};

export default UsuariosPage;