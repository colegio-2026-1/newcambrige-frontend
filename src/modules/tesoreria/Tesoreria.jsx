import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from "react";
import { useAuth } from "../../api/useAuth";
import { allrolesuserRequest } from '../../api/endpoints';
import { Home } from "lucide-react";

import MatriculaLogo from '../../assets/Tesoreria/matricula.svg';
import PensionLogo from '../../assets/Tesoreria/pension.svg';
import PapeleriaLogo from '../../assets/Tesoreria/papeleria.svg';


import Header from "../../components/layout/header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";



const Tesoreria = () => {
  const navigate = useNavigate();
  const selectedMenu = "Tesoreria";
  //para las tarjetas del dashboard
  const cards = [
    { title: 'Matrícula', icon: MatriculaLogo, path: "/tesoreria/matricula", roles: ["secretaria", "admin", "tesoreria"] },
    { title: 'Pensión', icon: PensionLogo, path: "/tesoreria/pension", roles: ["secretaria", "admin", "tesoreria"] },
    { title: 'Papelería', icon: PapeleriaLogo, path: "/tesoreria/papeleria", roles: ["secretaria", "admin", "tesoreria"] },
  ];
  //para el sidebar
  const modulos = [
    { label: "Inicio", icon: <Home />, path: "/home" },
    { label: "Tesoreria", path: "/tesoreria/", roles: ["secretaria", "admin", "tesoreria"] },
    { label: "Notificaciones", path: "/tesoreria/notificaciones", roles: ["secretaria", "admin", "tesoreria"] },
  ];
  //variables de autenticación y roles
  const { user, logout } = useAuth();
  const userName = user?.nombre || "Usuario";
  const idUser = user?.id_usuario;
  const [roles, setRoles] = useState([]);
  const [cargandoRol, setCargandoRol] = useState(true);
  const rol = roles[0] || "Rol Desconocido";
  //obtener roles del usuario
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



  return (
    <div className="dashboard-container">
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={modulos.filter(modulo => {
              if (!modulo) return false;
              if (!modulo.roles || !Array.isArray(modulo.roles) || modulo.roles.length === 0) return true;
              return roles.some(rol => modulo.roles.includes(rol));
            })}
            selectedMenu={selectedMenu}
            user={{ nombre: userName, rol: rol }}
            logout={logout}
          />
        }
      >{cargandoRol ? (
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
        <div 
          className="dashboard-card" 
          key={card.title} 
          onClick={() => navigate(card?.path)}
        >
          <h2>{card.title}</h2>
          <div className="card-icon">
            <img src={card.icon} alt={card.title} />
          </div>
        </div>
      ))}
  </div>
      )}
        {!cargandoRol
          && cards.filter(item => item && Array.isArray(item.roles)
            && roles.some(rol => item.roles.includes(rol))).length === 0
          && (
            <div className="status-message status-message--empty">
              Tu usuario no tiene módulos asignados.
            </div>
          )}

      </ModuleLayout>
    </div>

  );
};

export default Tesoreria;