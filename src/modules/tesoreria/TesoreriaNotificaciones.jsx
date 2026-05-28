import Header from "../../components/layout/header";
import Sidebar from "../../components/layout/Sidebar";
import ModuleLayout from "../../components/layout/ModuleLayout";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";

import { useAuth } from "../../api/useAuth";
import { useNavigate } from 'react-router-dom';


import { allrolesuserRequest } from '../../api/endpoints';



const TesoreriaNotificaciones = () => {
  const { user, logout } = useAuth();
    const [selectedMenu, setSelectedMenu] = useState("Notificaciones");
    const navigate = useNavigate();
    const rolespermitidos =  ["secretaria", "admin", "tesoreria"]
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
      { label: "Inicio", icon: <Home /> ,path:'/Tesoreria'},
      { label: "Notificaciones"},
    ];
  
  return (

    <div>
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
        <div className="text-vinotinto font-serif text-xl italic animate-pulse">
          Verificando credenciales institucionales...
        </div>
      ) : ( roles.some(rol => rolespermitidos.includes(rol)) ? (
          <div className="cards-grid">
            <h1>
              Notificaciones-Proximamente 
            </h1>
           </div>   
         ): (
         <div className="text-gray-400 italic text-center">
            Tu usuario no tiene permisos para acceder a este módulo.
          </div>
        )) 
        }
      </ModuleLayout>
    </div>
  );
};

export default TesoreriaNotificaciones;