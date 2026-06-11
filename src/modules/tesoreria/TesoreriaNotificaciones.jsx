import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";

import { useEffect, useState } from "react";
import { Icon } from '@mdi/react';
import { mdiHome , mdiCash, mdiBell } from "@mdi/js";
import { useAuth } from "../../api/useAuth";
import { useNavigate } from 'react-router-dom';


import { allrolesuserRequest } from '../../api/endpoints';



const TesoreriaNotificaciones = () => {
  const { user, logout } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState("Notificaciones");
  const navigate = useNavigate();
  const rolespermitidos = ["secretaria", "admin", "tesoreria"]
  const userName = user?.nombre || "Usuario";
  const idUser = user?.id_usuario;
  const [roles, setRoles] = useState([]);
  const [cargandoRol, setCargandoRol] = useState(true);
  const rol = roles[0] || "Rol Desconocido";

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
  const modulos = [
    { label: "Inicio", icon: <Icon path={mdiHome} />, path: "/home" },
    { label: "Tesoreria", icon: <Icon path={mdiCash} />, path: "/tesoreria/", roles: ["secretaria", "admin", "tesoreria"] },
    { label: "Notificaciones", icon: <Icon path={mdiBell} />, path: "/tesoreria/notificaciones", roles: ["secretaria", "admin", "tesoreria"] },
  ];

  return (

    <div>
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
            setSelectedMenu={setSelectedMenu}
            user={{ nombre: userName, rol: rol }}
            selectedMenu={selectedMenu}
            logout={logout}
          />
        }
      >
        {cargandoRol ? (
          <div className="status-message status-message--loading">
            Verificando credenciales institucionales...
          </div>
        ) : (roles.some(rol => rolespermitidos.includes(rol)) ? (
          <div className="status-message">
            <h1>
              Notificaciones-Proximamente
            </h1>
          </div>
        ) : (
          <div className="status-message status-message--empty">
            Tu usuario no tiene permisos para acceder a este módulo.
          </div>
        ))
        }
      </ModuleLayout>
    </div>
  );
};

export default TesoreriaNotificaciones;