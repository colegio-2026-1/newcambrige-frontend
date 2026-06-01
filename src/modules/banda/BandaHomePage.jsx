import React from 'react';
import { useAuth } from "../../api/useAuth";

// RECURSOS GLOBALES DEL EQUIPO
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

const BandaHomePage = () => {
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
    <>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
      
      <ModuleLayout
        sidebar={
          <Sidebar
            moduloActual="Inicio"
            menuItems={menuBanda}
            user={user}
          />
        }
      >
        <div style={mainContainer}>
          <div style={figmaCardWrapper}>
            <div style={figmaShadow} />
            <div style={figmaCard}>
              <h2 style={cardTitle}>Banda</h2>
              <div style={iconContainer}>
                <svg width="280" height="200" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="60" y1="30" x2="100" y2="75" stroke="#C9B99A" strokeWidth="1.5" />
                  <line x1="140" y1="30" x2="100" y2="75" stroke="#C9B99A" strokeWidth="1.5" />
                  <ellipse cx="100" cy="80" rx="55" ry="18" stroke="#C9B99A" strokeWidth="2" fill="white"/>
                  <path d="M45 80 V115 Q45 140 100 140 Q155 140 155 115 V80" stroke="#C9B99A" strokeWidth="2" fill="white"/>
                  <line x1="75" y1="95" x2="75" y2="130" stroke="#C9B99A" strokeWidth="1" opacity="0.4"/>
                  <line x1="100" y1="98" x2="100" y2="140" stroke="#C9B99A" strokeWidth="1" opacity="0.4"/>
                  <line x1="125" y1="95" x2="125" y2="130" stroke="#C9B99A" strokeWidth="1" opacity="0.4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </ModuleLayout>
    </>
  );
};

const mainContainer = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#FFFFFF' };
const figmaCardWrapper = { position: 'relative', width: '662px', height: '310px' };
const figmaShadow = { position: 'absolute', top: '15px', left: '15px', width: '662px', height: '310px', backgroundColor: '#8E2A25', borderRadius: '30px', zIndex: 1 };
const figmaCard = { position: 'absolute', top: 0, left: 0, width: '662px', height: '310px', backgroundColor: '#F8F7F3', border: '1px solid #D1D5DB', borderRadius: '30px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' };
const cardTitle = { fontFamily: "'Cinzel', serif", fontSize: '42px', color: '#1A1A1A', margin: '0 0 10px 0', fontWeight: '400' };
const iconContainer = { display: 'flex', alignItems: 'center', justifyContent: 'center' };

export default BandaHomePage;