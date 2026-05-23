// HomePage.js
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import "./HomePage.css";

import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import bandaIcon from "../../assets/Banda/banda.svg";
import paraIcon from "../../assets/Parametrizacion/parametrizacion.svg";
import DashboardIcon from "../../assets/Parametrizacion/parametrizacion.svg";

import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import { useAuth } from "../../api/useAuth";

const HomePage = () => {
  const { user, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState("Inicio");

  // MENU ITEMS CON ICONOS
  const menuItems = [
    { label: "Inicio", icon: <Home /> },
    { label: "Dashboard", icon: DashboardIcon },
  ];

  const cards = [
    { title: "Salón", icon: salonIcon },
    { title: "Tesorería", icon: tesoreriaIcon },
    { title: "Rectoría", icon: rectoriaIcon },
    { title: "Uniformes", icon: uniformesIcon },
    { title: "Banda", icon: bandaIcon },
    { title: "Parametrización", icon: paraIcon },
  ];

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            user={user}
            logout={logout}
          />
        }
      >
        <div className="cards-grid">
          {cards.map((card) => (
            <div className="dashboard-card" key={card.title}>
              <h2>{card.title}</h2>
              <div className="card-icon">
                <img src={card.icon} alt={card.title} />
              </div>
            </div>
          ))}
        </div>
      </ModuleLayout>
    </div>
  );
};

export default HomePage;