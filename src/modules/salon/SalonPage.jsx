import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home } from "lucide-react";
import { useAuth } from "../../api/useAuth";
import Header from "../../components/layout/header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import CardsGrid from "../../components/layout/CardsGrid";

import PupitresIcon from "../../assets/Salon/pupitres.svg";
import BibliotecaIcon from "../../assets/Salon/biblioteca.svg";
import PruebasIcon from "../../assets/Salon/pruebas.svg";

import "./SalonPage.css";

export default function SalonPage() {
  const navigate = useNavigate();
  const { user, roles, loadingRoles, logout } = useAuth(); 
  const userName = user?.nombre || "Usuario";
  const rol = roles[0] || "Rol Desconocido";
  const [selectedMenu, setSelectedMenu] = useState("Inicio");

  const menuItems = [
    { label: "Inicio", icon: <Home />, path: "/home" },
  ];


  const cards = [
    {
      title: "Pupitres",
      icon: PupitresIcon,
      path: "/salon/pupitre",
      roles: ["admin", "administrador", "titular"],
    },
    {
      title: "Biblioteca",
      icon: BibliotecaIcon,
      path: "/salon/biblioteca",
      roles: ["admin", "administrador", "titular"],
    },
    {
      title: "Pruebas",
      icon: PruebasIcon,
      path: "/salon/pruebas",
      roles: ["admin", "administrador", "titular"],
    },
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
            user={{ nombre: userName, rol: rol }}
            loadingRoles={loadingRoles} 
            logout={logout}
          />
        }
      >
        <div className="salon-content">
          <CardsGrid
            cards={cards}
            roles={roles}
            onCardClick={handleCardClick}
            loading={loadingRoles}
          />
        </div>
      </ModuleLayout>
    </div>
  );
}