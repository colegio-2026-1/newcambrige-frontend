import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import "./ParametrizacionPage.css";

// ==========================================
// IMPORTACIONES DE COMPONENTES
// ==========================================
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import { useAuth } from "../../api/useAuth";

// ==========================================
// IMPORTACIONES DE ICONOS
// ==========================================
import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import bandaIcon from "../../assets/Banda/banda.svg";
import paraIcon from "../../assets/Parametrizacion/parametrizacion.svg";
import DashboardIcon from "../../assets/Parametrizacion/parametrizacion.svg";

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const ParametrizacionPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const userName = user?.nombre || "Usuario";
  const rol = user?.rol || "TITULAR";
  const [selectedMenu, setSelectedMenu] = useState("Parametrización");

  // ==========================================
  // CONFIGURACIÓN DEL MENÚ Y TARJETAS
  // ==========================================
  const menuItems = [
    { label: "Inicio", icon: <Home />, path: "/home" },
    { label: "Dashboard", icon: DashboardIcon },
    { label: "Salón", icon: salonIcon, path: "/salon" },
    { label: "Uniformes", icon: uniformesIcon, path: "/uniformes" },
    { label: "Tesorería", icon: tesoreriaIcon, path: "/tesoreria" },
    { label: "Rectoría", icon: rectoriaIcon, path: "/rectoria" },
    { label: "Parametrización", icon: paraIcon, path: "/parametrizacion" },
  ];

  const cards = [
    { title: "Usuarios", icon: null, path: "/parametrizacion/usuarios" },
    { title: "Año escolar", icon: null, path: "/parametrizacion/anio-escolar" },
    { title: "Pruebas", icon: null, path: "/parametrizacion/pruebas" },
    { title: "Instrumentos", icon: null, path: "/parametrizacion/instrumentos" },
    { title: "Objetos", icon: null, path: "/parametrizacion/objetos" },
    { title: "Asignar titulares", icon: null, path: "/parametrizacion/titulares" },
  ];

  // ==========================================
  // RENDERIZADO DE LA VISTA
  // ==========================================
  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            setSelectedMenu={(menu) => {
               setSelectedMenu(menu);
               const itemSeleccionado = menuItems.find(m => m.label === menu);
               if (itemSeleccionado && itemSeleccionado.path) {
                   navigate(itemSeleccionado.path);
               }
            }}
            user={{ nombre: userName, rol: rol }}
            logout={logout}
          />
        }
      >
        <div className="param-page-content">
          <div className="param-grid-container">
            {cards.map((card, index) => (
              <button 
                key={index} 
                className="param-card" 
                onClick={() => navigate(card.path)}
              >
                <div className="param-icon-wrapper">
                  <img src={card.icon || "ruta_falsa"} alt={card.title} className="param-icon" />
                </div>
                <span className="param-title">{card.title}</span>
              </button>
            ))}
          </div>
        </div>
      </ModuleLayout>
    </div>
  );
};

export default ParametrizacionPage;