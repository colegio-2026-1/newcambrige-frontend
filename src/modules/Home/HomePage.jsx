// HomePage.js (sin cambios, igual a como lo tenías)
import { useState } from "react";
import { Icon } from '@mdi/react';
import { mdiHome, mdiViewDashboard } from '@mdi/js';
import "./HomePage.css";
import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import bandaIcon from "../../assets/Banda/banda.svg";
import paraIcon from "../../assets/Parametrizacion/parametrizacion.svg";
import RobotIcon from "../../assets/Robot/Robot.svg";
import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import CardsGrid from "../../components/layout/CardsGrid";
import { useAuth } from "../../api/useAuth";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, roles, loadingRoles, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const navigate = useNavigate();

  const userName = user?.nombre || "Usuario";
  const rol = roles[0] || "Rol Desconocido";

  const menuItems = [
    { label: "Inicio", icon: <Icon path={mdiHome} /> },
    { label: "Dashboard", icon: <Icon path={mdiViewDashboard} /> },
  ];

  const cards = [
    { title: "Salón", icon: salonIcon, path: "/salon", roles: ["admin", "administrador", "titular"] },
    { title: "Tesorería", icon: tesoreriaIcon, path: "/tesoreria", roles: ["secretaria", "administrador", "admin", "tesoreria"] },
    { title: "Rectoría", icon: rectoriaIcon, path: "/rectoria", roles: ["secretaria", "administrador", "admin", "rectoria"] },
    { title: "Uniformes", icon: uniformesIcon, path: "/uniformes", roles: ["administrador", "admin", "uniformes"] },
    { title: "Banda", icon: bandaIcon, path: "/banda", roles: ["administrador", "admin", "banda"] },
    { title: "Parametrización", icon: paraIcon, path: "/parametrizacion", roles: ["secretaria", "administrador", "admin", "rectoria"] },
    { title: "Robot", icon: RobotIcon, path: "/robot", roles: ["administrador", "admin", "robot"] },
  ];

  const handleCardClick = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            user={{ nombre: userName, rol }}
            loadingRoles={loadingRoles}
            logout={logout}
          />
        }
      >
        <CardsGrid
          cards={cards}
          roles={roles}
          onCardClick={handleCardClick}
          loading={loadingRoles}
        />
      </ModuleLayout>
    </div>
  );
};

export default HomePage;