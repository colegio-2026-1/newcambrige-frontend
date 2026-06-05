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

  if (loading || !user) return <div className="status-message status-message--loading">Cargando...</div>;

  const menuBanda = [
    { label: "Inicio", path: "/banda" },
    { label: "Inventario", path: "/banda/inventario" },
    { label: "Préstamos", path: "/banda/prestamos" },
  ];

  if (user?.roles?.includes("admin") || user?.rol === "admin") {
    menuBanda.push({ label: "Auditoría", path: "/banda/auditoria" });
  }

  return (
    <div className="dashboard-container banda-custom-sidebar">
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
        {/* Contenedor de centrado absoluto */}
        <div style={centerWrapperStyle}>
          
          {/* ✅ Envoltura para forzar el tamaño correcto de la tarjeta (331px es el estándar de tu grid) */}
          <div style={{ width: '100%', maxWidth: '331px' }}>
            <div 
              className="dashboard-card" 
              onClick={() => navigate("/banda/prestamos")} 
              style={{ cursor: 'pointer' }}
            >
              <h2>Banda</h2>
              <div className="card-icon">
                <img src={bandaIcon} alt="Banda" />
              </div>
            </div>
          </div>

        </div>
      </ModuleLayout>
    </div>
  );
};

// =====================================================
// ESTILOS DE POSICIONAMIENTO (LOCALES)
// =====================================================

const centerWrapperStyle = {
  display: 'flex',
  justifyContent: 'center', 
  alignItems: 'center',     
  width: '100%',
  height: '100%',           
  minHeight: 'calc(100vh - 200px)', 
  boxSizing: 'border-box',
  padding: '20px'
};

export default BandaHomePage;