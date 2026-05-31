import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import escudoNCS from "../../assets/Escudos/NCS.png";
import escudoUP from "../../assets/Escudos/UP.png";

const BandaLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif" }}>
      
      {/* HEADER */}
      <header style={{
        backgroundColor: "#8E2A25",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        height: "64px",
        gap: "16px",
        flexShrink: 0
      }}>
        <img src={escudoNCS} alt="NCS" style={{ height: "48px" }} />
        <img src={escudoUP} alt="UP" style={{ height: "48px" }} />
        <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, letterSpacing: "1px" }}>
          SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL
        </h1>
      </header>

      {/* CUERPO */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* SIDEBAR */}
        <aside style={{
          width: "160px",
          backgroundColor: "#E9E9E7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "0",
          flexShrink: 0,
          borderRight: "1px solid #ccc"
        }}>
          <nav style={{ display: "flex", flexDirection: "column" }}>
            <NavLink
              to="/banda"
              end
              style={({ isActive }) => ({
                padding: "14px 16px",
                textDecoration: "none",
                color: "#333333",
                backgroundColor: isActive ? "#DCD4BE" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
                borderBottom: "1px solid #ccc"
              })}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/banda/inventario"
              style={({ isActive }) => ({
                padding: "14px 16px",
                textDecoration: "none",
                color: "#333333",
                backgroundColor: isActive ? "#DCD4BE" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
                borderBottom: "1px solid #ccc"
              })}
            >
              Inventario Banda
            </NavLink>
            <NavLink
              to="/banda/asignaciones"
              style={({ isActive }) => ({
                padding: "14px 16px",
                textDecoration: "none",
                color: "#333333",
                backgroundColor: isActive ? "#DCD4BE" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
                borderBottom: "1px solid #ccc"
              })}
            >
              Asignaciones
            </NavLink>
          </nav>

          {/* USUARIO */}
          <div style={{
            padding: "16px",
            borderTop: "1px solid #ccc",
            textAlign: "center"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#8E2A25",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
              fontSize: "20px",
              fontWeight: "bold"
            }}>
              {user?.nombre?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "bold", color: "#333" }}>
              TITULAR
            </p>
            <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#333" }}>
              {user?.nombre ?? "Usuario"}
            </p>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                color: "#8E2A25"
              }}
              title="Cerrar sesión"
            >
              ⇥
            </button>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          overflow: "auto",
          padding: "24px"
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BandaLayout;