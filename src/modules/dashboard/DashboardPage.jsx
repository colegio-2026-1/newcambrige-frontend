import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useState, useEffect } from "react";
import { useAuth } from "../../modules/auth/useAuth";
import { allrolesuserRequest } from '../../api/endpoints';

import MatriculaLogo from '../../assets/Tesoreria/matricula.svg';
import PensionLogo from '../../assets/Tesoreria/pension.svg';
import PapeleriaLogo from '../../assets/Tesoreria/papeleria.svg';
import UserIcon from '../../assets/Login/usuario_login.svg';

import Header        from "../../components/layout/Header";
import ModuleLayout  from "../../components/layout/ModuleLayout";
import Sidebar       from "../../components/layout/Sidebar";
import SearchBar     from "../../components/shared/SearchBar";
import DataTable     from "../../components/shared/DataTable";
import ActionButtons from "../../components/shared/ActionButtons";
import Modal         from "../../components/shared/Modal";


const Dashboard = () => {
  const navigate = useNavigate();
  //para las tarjetas del dashboard
  const categories = [
    { title: 'Matrícula', icon: MatriculaLogo, path: "/tesoreria/matricula", roles: ["secretaria", "administrador", "admin", "tesoreria"] },
    { title: 'Pensión', icon: PensionLogo, path: "/tesoreria/pension", roles: ["secretaria", "administrador", "admin", "tesoreria"] },
    { title: 'Papelería', icon: PapeleriaLogo, path: "/tesoreria/papeleria", roles: ["secretaria", "administrador", "admin", "tesoreria"] },
  ];
  //para el sidebar
  const modulos = [
    { label: "Notificaciones",    path: "/tesoreria/notificaciones", roles: ["secretaria", "administrador", "admin", "tesoreria"] },
  ];

  const { user, logout } = useAuth();
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

 

  return (
 <div>
  
  <Header />

   <ModuleLayout
    sidebar={<Sidebar 
            modulos={modulos.filter(item => item && Array.isArray(item.roles) && roles.some(rol => item.roles.includes(rol)))}
            userIcon={user?.icon || UserIcon}
            usuario={{ nombre: userName, rol: rol }}
            onLogout={logout}
    />}
      children={
        cargandoRol ? (
  <div className="text-vinotinto font-serif text-xl italic animate-pulse">
    Verificando credenciales institucionales...
  </div>
) : (
  <section className="h-full w-full flex justify-center items-center gap-20 py-24 relative">
    {categories
      .filter(item => item && Array.isArray(item.roles) && roles.some(rol => item.roles.includes(rol)))
      
      .map((item, index) => (
        <div key={index} className="relative group scale-110" onClick={() => navigate(item?.path)}>
          {/* Sombra proyectada vinotinto */}
          <div className="absolute top-4 left-4 w-56 h-72 bg-vinotinto rounded-2xl shadow-lg transition-transform group-hover:translate-x-1 group-hover:translate-y-1"></div>
          
          {/* Tarjeta Blanca */}
          <div className="relative bg-white border border-gray-100 rounded-2xl w-56 h-72 flex flex-col items-center justify-center p-8 shadow-2xl transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
            <h3 className="text-dorado text-3xl font-serif font-medium mb-10 tracking-wide text-center">
              {item?.title}
            </h3>
            <div className="text-dorado transform transition-transform group-hover:scale-110">
              {item.icon ? (
              <img 
                src={item.icon} 
                alt={item.title} 
                className="w-16 h-16 object-contain" 
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-full" />
            )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Si terminó de cargar pero el usuario no tiene roles permitidos para ninguna tarjeta */}
      {categories.filter(item => item && Array.isArray(item.roles) && roles.some(rol => item.roles.includes(rol))).length === 0 && (
        <div className="text-gray-400 italic text-center">
          Tu usuario no tiene módulos asignados.
        </div>
      )}
  </section>
)}
        
/>
      
    </div>
   
  );
};

export default Dashboard;