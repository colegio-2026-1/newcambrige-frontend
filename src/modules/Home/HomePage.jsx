// HomePage.js
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import "./HomePage.css";

import salonIcon from "../../assets/Salon/salon.svg";
import tesoreriaIcon from "../../assets/Tesoreria/tesoreria.svg";
import rectoriaIcon from "../../assets/Rectoria/estudiante.svg";
import uniformesIcon from "../../assets/Objetos/objetos.svg";
import bandaIcon from "../../assets/Banda/Banda.svg";
import paraIcon from "../../assets/Parametrizacion/parametrizacion.svg";
import DashboardIcon from "../../assets/Parametrizacion/parametrizacion.svg";
import RobotIcon from "../../assets/Robot/robot.svg";

import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";
import { useAuth } from "../../api/useAuth";
import { useNavigate } from 'react-router-dom';


import { allrolesuserRequest } from '../../api/endpoints';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState("Inicio");
  const navigate = useNavigate();
 
  const userName = user?.nombre || "Usuario";
  const idUser = user?.id_usuario;
  const [roles, setRoles] = useState([]); 
  const [cargandoRol, setCargandoRol] = useState(true);
  const rol = roles[0]|| "Rol Desconocido";

   useEffect(() => {
    const obtenerRoles = async () => {
      if (!idUser) return;
      
      try {
        setCargandoRol(true);
        const response = await allrolesuserRequest(idUser);
        
        setRoles(response?.data || []); 
      } catch (error) {
        console.error("Error al obtener el rol:", error);
        setRoles([]);
      } finally {
        setCargandoRol(false);
      }
    };
    
    obtenerRoles();
  }, [idUser]);
  


  // MENU ITEMS CON ICONOS
  const menuItems = [
    { label: "Inicio", icon: <Home /> },
    { label: "Dashboard", icon: DashboardIcon },
  ];

  const cards = [
    { title: "Salón", icon: salonIcon, path: "/salon", roles: [  "admin", "administrador","titular" ] },
    { title: "Tesorería", icon: tesoreriaIcon, path: "/tesoreria", roles: ["secretaria", "administrador", "admin", "tesoreria"] },
    { title: "Rectoría", icon: rectoriaIcon, path: "/rectoria", roles: ["secretaria", "administrador", "admin", "rectoria"] },
    { title: "Uniformes", icon: uniformesIcon, path: "/uniformes", roles: ["administrador", "admin", "uniformes"] },
    { title: "Banda", icon: bandaIcon, path: "/banda", roles: [ "administrador", "admin", "banda"] },
    { title: "Parametrización", icon: paraIcon, path: "/parametrizacion", roles: ["secretaria", "administrador", "admin", "rectoria"] },
    { title: "Robot", icon: RobotIcon, path: "/robot", roles: ["administrador", "admin", "robot"] },
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
            user={{ nombre: userName, rol: rol }}
           
            logout={logout}
          />
        }
      >
       {cargandoRol ? (
  <div className="status-message status-message--loading">
    Verificando credenciales institucionales...
  </div>
) : (
   
    <div className="cards-grid">
    {cards
    .filter(card => 
    card && 
    Array.isArray(card.roles) && 
    card.roles.length > 0 && 
    roles.some(rol => card.roles.includes(rol))
  )
  .map((card) => (
            <div className="dashboard-card" key={card.title} onClick={() => navigate(card?.path)}>
              <h2>{card.title}</h2>
              <div className="card-icon">
                <img src={card.icon} alt={card.title} />
              </div>
            </div>
          ))}
     </div>   
   ) }
   { !cargandoRol && cards.filter(item => item && Array.isArray(item.roles) && roles.some(rol => item.roles.includes(rol))).length === 0 && (
        <div className="status-message status-message--empty">
          Tu usuario no tiene módulos asignados.
        </div>
      )}

     
      </ModuleLayout>
    </div>
  );
};

export default HomePage;