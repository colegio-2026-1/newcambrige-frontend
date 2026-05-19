import { useEffect, useState } from "react";
import "./HomePage.css";

import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import bandaIcon from "../../assets/Banda/banda.svg";

import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";

import { useAuth } from "../../api/useAuth";

const HomePage = () => {
  const { user, logout } = useAuth();

  // MENU ACTIVO
  const [selectedMenu, setSelectedMenu] = useState("Inicio");


  // ITEMS MENU
  const menuItems = [
    "Inicio",
    "Estudiante",
    "Docente",
  ];

  // CARDS
  const cards = [
    {
      title: "Salón",
      icon: salonIcon,
    },
    {
      title: "Tesorería",
      icon: tesoreriaIcon,
    },
    {
      title: "Rectoría",
      icon: rectoriaIcon,
    },
    {
      title: "Uniformes",
      icon: uniformesIcon,
    },
    {
      title: "Banda",
      icon: bandaIcon,
    },
  ];

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      {/* Layout base con sidebar y contenido central */}
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
        {/* Contenido central: cuadrícula de tarjetas */}
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