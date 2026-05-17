import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSalonesRequest } from "../../api/endpoints";

import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";

import PupitresIcon from "../../assets/Salón/pupitres.svg";
import BibliotecaIcon from "../../assets/Salón/biblioteca.svg";
import PruebasIcon from "../../assets/Salón/pruebas.svg";

import userIcon from "../../assets/Login/usuario_login.svg";
import LogOutIcon from "../../assets/logout/cerrar_sesion.svg";

export default function SalonPage() {
  const navigate = useNavigate();

  const [usuario] = useState({
    nombre: "Nombre usuario",
    rol: "Titular",
  });

  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ TRAER DATOS DEL API
  useEffect(() => {
    const obtenerSalones = async () => {
      try {
        setLoading(true);
        const response = await getSalonesRequest();
        setSalones(response.data);
        console.log("Salones obtenidos:", response.data);
      } catch (error) {
        console.error("Error al obtener salones:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerSalones();
  }, []);

  // MÓDULOS (Esto no cambió, son los módulos de acceso rápido)
  const modulos = [
    {
      id: "pupitres",
      label: "Pupitres",
      path: "/pupitres",
      icon: PupitresIcon,
      descripcion: "Gestión y asignación de pupitres del salón.",
    },
    {
      id: "biblioteca",
      label: "Biblioteca",
      path: "/biblioteca",
      icon: BibliotecaIcon,
      descripcion: "Control e inventario de libros disponibles.",
    },
    {
      id: "pruebas",
      label: "Pruebas",
      path: "/pruebas",
      icon: PruebasIcon,
      descripcion: "Administración y seguimiento de evaluaciones.",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    console.log("Cerrando sesión...");
    // navigate("/login");
  };

  if (loading) return <div>Cargando salones...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        background: "var(--color-bg)",
      }}
    >
      {/* HEADER */}
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />

      {/* CONTENIDO PRINCIPAL */}
      <div
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
        }}
      >
        {/* SIDEBAR */}
        <Sidebar
          moduloActual=""
          modulos={[]}
          usuario={usuario}
          userIcon={userIcon}
          onLogout={handleLogout}
        />

        {/* CONTENIDO */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            borderLeft: "1px solid var(--color-border-light)",
          }}
        >
          {/* GRID DE TARJETAS */}
          <div
            style={{
              width: "100%",
              maxWidth: "1100px",
              display: "flex",
              justifyContent: "center",
              gap: "2.5rem",
              flexWrap: "wrap",
            }}
          >
            {modulos.map((modulo) => (
              <div
                key={modulo.id}
                onClick={() => handleNavigate(modulo.path)}
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
                {/* NOMBRE */}
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

          {/* INFORMACIÓN DE SALONES (opcional - para mostrar los datos) */}
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "2rem",
              padding: "1rem",
              background: "#F5F5F5",
              borderRadius: "0.8rem",
              maxWidth: "300px",
              fontSize: "0.9rem",
              color: "#666",
            }}
          >
            <h4>Salones disponibles: {salones.length}</h4>
            {salones.slice(0, 3).map((salon) => (
              <p key={salon.id_salon}>
                Grado: {salon.grado} - Grupo: {salon.grupo}
              </p>
            ))}
            {salones.length > 3 && <p>... y más</p>}
          </div>
        </div>
      </div>
    </div>
  );
}