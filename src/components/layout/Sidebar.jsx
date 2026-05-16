import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

/**
 * Sidebar — columna izquierda reutilizable para todos los módulos
 *
 * Props:
 *  moduloActual {String}   — título del módulo donde estamos ej: "Inventario Libros"
 *  modulos      {Array}    — links de otros módulos disponibles
 *                { label, path }
 *  usuario      {Object}   — { nombre, rol }
 *  userIcon     {String}   — import del ícono de usuario (lo agrega cada página)
 *  onLogout     {Function} — cierra sesión
 *
 * Ejemplo de uso:
 *  import userIcon from "../../assets/Icons/user.svg";
 *
 *  <Sidebar
 *    moduloActual="Inventario Libros"
 *    modulos={[
 *      { label: "Uniformes",     path: "/uniformes" },
 *      { label: "Instrumentos",  path: "/instrumentos" },
 *    ]}
 *    usuario={{ nombre: "Juan Pérez", rol: "Titular" }}
 *    userIcon={userIcon}
 *    onLogout={handleLogout}
 *  />
 */

export default function Sidebar({
  moduloActual = "",
  modulos = [],
  usuario = {},
  userIcon,
  onLogout,
}) {
  const navigate   = useNavigate();
  const location   = useLocation();

  return (
    <aside className="sidebar">

      {/* ── ZONA SUPERIOR ── */}
      <div className="sidebar-top">

        {/* INICIO */}
        <button
          className="sidebar-inicio"
          onClick={() => navigate("/")}
        >
          Inicio
        </button>

        {/* TÍTULO MÓDULO ACTUAL */}
        {moduloActual && (
          <div className="sidebar-modulo-actual">
            <span>{moduloActual}</span>
          </div>
        )}

        {/* LINKS OTROS MÓDULOS */}
        {modulos.length > 0 && (
          <nav className="sidebar-nav">
            {modulos.map((mod) => (
              <button
                key={mod.path}
                className={`sidebar-link ${location.pathname.startsWith(mod.path) ? "sidebar-link--active" : ""}`}
                onClick={() => navigate(mod.path)}
              >
                {mod.label}
              </button>
            ))}
          </nav>
        )}

      </div>

      {/* ── ZONA INFERIOR — USUARIO ── */}
      <div className="sidebar-user">

        {userIcon && (
          <img
            src={userIcon}
            alt="Usuario"
            className="sidebar-user-icon"
          />
        )}

        <p className="sidebar-user-rol">
          {usuario.rol?.toUpperCase()}
        </p>

        <p className="sidebar-user-nombre">
          {usuario.nombre}
        </p>

        <button
          className="sidebar-logout"
          onClick={onLogout}
          title="Cerrar sesión"
        >
          ⇥
        </button>

      </div>

    </aside>
  );
}