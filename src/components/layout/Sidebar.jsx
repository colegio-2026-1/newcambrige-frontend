// Sidebar.js
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../../api/useAuth";
import "./Sidebar.css";


export default function Sidebar({
  menuItems = [], // ahora cada elemento: { label: string, icon?: ReactNode }
  selectedMenu,
  setSelectedMenu,
  user: propUser,
}) {

  

  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const user = propUser || authUser;

  const handleNavigation = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    //setSelectedMenu(item.label);
    
    //(es solo un planteamiento de redireccion se debe modificar segun sea el caso)

    // Genera la ruta: convierte a minúsculas, reemplaza espacios por guiones
    // const path = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(item.path);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.label}
            className={`menu-item ${selectedMenu === item.label ? "active" : ""}`}
            onClick={(e) => handleNavigation(item, e)}
          >
            {item.icon && (
              <span className="menu-icon">
                {typeof item.icon === 'string' ? (
                  <img src={item.icon} alt={item.label} />
                ) : (
                  item.icon
                )}
              </span>
            )}
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-user">
        <UserCircle2  />
        <span className="titular-label">{user.rol ?? "Rol no asignado"}</span>
        <h3>{user?.nombre ?? "Nombre usuario"}</h3>
        <button type="button" className="logout-button" onClick={handleLogout}>
          <LogOut />

        </button>
      </div>
    </aside>
  );
}