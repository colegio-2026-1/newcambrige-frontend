import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { useAuth } from "../../api/useAuth";
import { allrolesuserRequest } from "../../api/endpoints";

import Header from "../../components/layout/header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import PupitresIcon   from "../../assets/Salon/pupitres.svg";
import BibliotecaIcon from "../../assets/Salon/biblioteca.svg";
import PruebasIcon    from "../../assets/Salon/pruebas.svg";

export default function SalonPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userName = user?.nombre || "Usuario";
  const [cargandoRol, setCargandoRol] = useState(true);

  const idUser = user?.id_usuario;
  const [roles, setRoles] = useState([]);
  const rol = roles[0] || "Rol Desconocido";

  const [selectedMenu, setSelectedMenu] = useState("Inicio");

  const menuItems = [
    { label: "Inicio", icon: <Home />, path: "/home" },
  ];

  const modulos = [
    { id: "pupitres",   label: "Pupitres",   path: "/salon/pupitre",   icon: PupitresIcon   },
    { id: "biblioteca", label: "Biblioteca", path: "/salon/biblioteca", icon: BibliotecaIcon },
    { id: "pruebas",    label: "Pruebas",    path: "/salon/pruebas",    icon: PruebasIcon    },
  ];

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
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            user={{ nombre: userName, rol: rol }}
            logout={logout}
          />
        }
      >
        <div style={{ width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center", padding:"2rem" }}>
          <div style={{ width:"100%", maxWidth:"1100px", display:"flex", justifyContent:"center", alignItems:"center", gap:"2.5rem", flexWrap:"wrap" }}>
            {modulos.map((modulo) => (
              <div
                key={modulo.id}
                onClick={() => navigate(modulo.path)}
                style={{ width:"230px", height:"230px", background:"var(--color-white)", borderRadius:"0.8rem", cursor:"pointer", position:"relative", boxShadow:"12px 10px 0px #8E2A25", border:"1px solid #E5E7EB", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", paddingTop:"1.8rem", transition:"all 0.2s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.background="#DCD4BE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.background="var(--color-white)"; }}
              >
                <h2 style={{ fontFamily:"var(--font-display)", fontSize:"2rem", fontWeight:"500", color:"#1F1F1F", margin:0, marginBottom:"2.2rem", textAlign:"center" }}>
                  {modulo.label}
                </h2>
                <img src={modulo.icon} alt={modulo.label} style={{ width:"95px", height:"95px", objectFit:"contain" }} />
              </div>
            ))}
          </div>
        </div>
      </ModuleLayout>
    </div>
  );
}