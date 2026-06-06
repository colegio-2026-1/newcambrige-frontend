import { useNavigate } from "react-router-dom";
import Icon from "../../components/common/Icon";
import { mdiAccountCircle, mdiLogout } from '@mdi/js';
import { useAuth } from "../../api/useAuth";
import "./ImportacionSidebar.css";

export default function ImportacionSidebar({
  menuItems = [], 
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
    navigate(item.path);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
  };

  return (
    <aside className="importacion-sidebar">
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
        <Icon icon={mdiAccountCircle} size={3.5} />
        <span className="titular-label">{user?.rol ?? "Rol no asignado"}</span>
        <h3>{user?.nombre ?? "Nombre usuario"}</h3>
        <button type="button" className="logout-button" onClick={handleLogout}>
          <Icon icon={mdiLogout} size={1.5} />
        </button>
      </div>
    </aside>
  );
}
