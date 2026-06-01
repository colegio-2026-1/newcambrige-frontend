import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../api/useAuth";

// RECURSOS GLOBALES
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/header";
import "../Home/HomePage.css"; // ✅ Usamos los estilos del equipo

// ICONO OFICIAL
import bandaIcon from "../../assets/Banda/banda.svg";

const BandaHomePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading || !user) return <div className="loading">Cargando...</div>;

  const menuBanda = [
    { label: "Inicio", path: "/banda" },
    { label: "Inventario", path: "/banda/inventario" },
    { label: "Préstamos", path: "/banda/prestamos" },
  ];

  if (user?.roles?.includes("admin") || user?.rol === "admin") {
    menuBanda.push({ label: "Auditoría", path: "/banda/auditoria" });
  }

  return (
    <div className="dashboard-container banda-custom-sidebar">{/* Clase personalizada para el sidebar de Banda */}
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      
      <ModuleLayout
        sidebar={
          <Sidebar
            selectedMenu="Inicio"
            menuItems={menuBanda}
            user={user}
          />
        }
      >
        {/* 
          ESTE ES EL CONTENEDOR MAESTRO DE CENTRADO:
          Ocupa todo el espacio disponible y centra su contenido 
        */}
        <div style={centerWrapperStyle}>
          
          <div 
            className="dashboard-card" 
            onClick={() => navigate("/banda/prestamos")} 
            style={{ cursor: 'pointer', margin: 0 }} // Quitamos el margin auto para que flex controle el centro
          >
            <h2>Banda</h2>
            <div className="card-icon">
              <img src={bandaIcon} alt="Banda" />
            </div>
          </div>
        </div>
      </ModuleLayout>
    </div>
  );
};
// =====================================================
// ESTILO DE CENTRADO ABSOLUTO (Centro del Centro)
// =====================================================

const centerWrapperStyle = {
  display: 'flex',
  justifyContent: 'center', // Centrado horizontal
  alignItems: 'center',     // Centrado vertical
  width: '100%',
  height: '100%',           // Ocupa el 100% del alto del contenido blanco
  minHeight: 'calc(100vh - 160px)', // Ajuste para que se vea centrado respecto a la pantalla
  boxSizing: 'border-box'
};

export default BandaHomePage;