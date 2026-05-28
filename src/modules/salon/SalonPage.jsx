import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home } from "lucide-react";

import Header from "../../components/layout/header";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";

import PupitresIcon from "../../assets/Salon/pupitres.svg";
import BibliotecaIcon from "../../assets/Salon/biblioteca.svg";
import PruebasIcon from "../../assets/Salon/pruebas.svg";

export default function SalonPage() {

  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState("Inicio");

  // ITEMS SIDEBAR
  const menuItems = [
    {
      label: "Home",
      icon: <Home />,
      path: "/home ",
    }
  ];

  // TARJETAS
  const modulos = [
    {
      id: "pupitres",
      label: "Pupitres",
      path: "/pupitres",
      icon: PupitresIcon,
    },
    {
      id: "biblioteca",
      label: "Biblioteca",
      path: "/biblioteca",
      icon: BibliotecaIcon,
    },
    {
      id: "pruebas",
      label: "Pruebas",
      path: "/pruebas",
      icon: PruebasIcon,
    },
  ];

  return (

    <div className="dashboard-container">

      {/* HEADER */}
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      {/* LAYOUT BASE */}
      <ModuleLayout

        sidebar={

          <Sidebar
            menuItems={menuItems}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            user="Nombre usuario"
            logout={() => navigate("/")}
          />

        }

      >

        {/* CONTENIDO */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >

          {/* GRID */}
          <div
            style={{
              width: "100%",
              maxWidth: "1100px",
              display: "flex",
              justifyContent: "center",
              alingItems: "center",
              gap: "2.5rem",
              flexWrap: "wrap",
            }}
          >

            {modulos.map((modulo) => (

              <div
                key={modulo.id}
                onClick={() => navigate(modulo.path)}
                style={{
                  width: "230px",
                  height: "230px",
                  background: "var(--color-white)",
                  borderRadius: "0.8rem",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: "12px 10px 0px #8E2A25",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingTop: "1.8rem",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.background = "#DCD4BE";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.background = "var(--color-white)";
                }}
              >

                {/* TITULO */}
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: "500",
                    color: "#1F1F1F",
                    margin: 0,
                    marginBottom: "2.2rem",
                    textAlign: "center",
                  }}
                >
                  {modulo.label}
                </h2>

                {/* ICONO */}
                <img
                  src={modulo.icon}
                  alt={modulo.label}
                  style={{
                    width: "95px",
                    height: "95px",
                    objectFit: "contain",
                  }}
                />

              </div>

            ))}

          </div>

        </div>

      </ModuleLayout>

    </div>

  );
}