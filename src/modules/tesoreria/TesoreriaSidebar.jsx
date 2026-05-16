import React from 'react';
import { useNavigate } from 'react-router-dom';
import Home from '../../assets/logout/inicio.svg';
import User from '../../assets/Login/usuario_login.svg';
import Logout from '../../assets/logout/cerrar_sesion.svg';
import { useAuth } from "../auth/useAuth";
import { allrolesuserRequest } from '../../api/endpoints';
import { useState, useEffect } from 'react';


const Sidebar = () => {
  const menuOptions = {
  home: { label: 'Inicio', path: '/dashboard', icon: Home  },
  estadisticas: { label: 'Estadísticas', path: '/tesoreria/estadisticas', icon: ''},
  notificaciones: { label: 'Notificaciones', path: '/tesoreria/notificaciones', icon: '' }
  };
  const routesConfig = {
  '/tesoreria': ['home', 'notificaciones'],
  '/tesoreria/matricula': ['home', 'estadisticas'],
  '/tesoreria/notificaciones': ['home']
};

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userName = user?.nombre || "Usuario";
  const idUser = user?.id_usuario;
  const [rolNombre, setRolNombre] = useState("Cargando...");
  const rol = rolNombre[0]|| "Rol Desconocido";
  const currentButtons = routesConfig[location.pathname] || ['home']; 


  useEffect(() => {
  const obtenerRoles = async () => {
    if (idUser) {
      try {
        const response = await allrolesuserRequest(idUser);
        const nombres = response?.data;
        setRolNombre(nombres);
      } catch (error) {
        console.error("Error al obtener el rol:", error);
        setRolNombre("Error al cargar");
      }
    }
  };
  obtenerRoles();
}, [idUser]);

  return (
    <aside className="w-64 bg-crema-sidebar flex flex-col border-r border-gray-300 h-full shadow-lg">
      <div className="p-8 flex flex-col items-center">
        

        {/* Navegación */}
       <nav className="w-full space-y-2">
          {currentButtons.map((key) => {
            const item = menuOptions[key];
            return (
              <button 
                key={key}
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-4 text-vinotinto font-bold w-full p-3 hover:bg-white/40 rounded-lg transition-all"
              >
                {item.icon && <span className="w-6 h-6"><img src={item.icon} alt={item.label} /></span>}
                <span className="text-lg">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    <div className="flex-grow"></div>
      {/* Perfil de Usuario al final */}
      <div className="mt-auto p-10 flex flex-col items-center text-vinotinto ">
        <div className="w-20 h-20 rounded-full border-2 border-dorado flex items-center justify-center mb-3 bg-white/30 shadow-inner overflow-hidden">
         
          <span className="text-3xl"><img src={User} alt="Usuario" className="w-6 h-6" /></span>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.2em]">{rol}</p>
        <p className="text-md font-medium">{userName}</p>
        <button onClick={logout} className="mt-6 p-2 hover:bg-vinotinto hover:text-white rounded-xl transition-all duration-300 border border-vinotinto/20">
          
          <span><img src={Logout} alt="Cerrar Sesión" className="w-6 h-6" /></span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;