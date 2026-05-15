import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ===== IMPORTACIÓN DE IMÁGENES =====
import logoUni from "../../assets/UP.png";
import logoNCS from "../../assets/NCS.png";
import pupitresIcon from "../../assets/pupitres.png";
import bibliotecaIcon from "../../assets/biblioteca.png";
import pruebasIcon from "../../assets/pruebas.png";

export default function SalonPage() {

  const navigate = useNavigate();

  const [hoveredCard, setHoveredCard] = useState(null);

  // ===== TRANSICIÓN LOGOS =====

  const logos = [logoNCS, logoUni];

  const [logoIndex, setLogoIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setLogoIndex((prev) => (prev + 1) % logos.length);

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const cards = [

    {
      id: "pupitres",
      title: "Pupitres",
      icon: pupitresIcon,
      path: "/pupitres",
    },

    {
      id: "biblioteca",
      title: "Biblioteca",
      icon: bibliotecaIcon,
      path: "/biblioteca",
    },

    {
      id: "pruebas",
      title: "Pruebas",
      icon: pruebasIcon,
      path: "/pruebas",
    },

  ];

  return (

    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <header style={styles.header}>

        {/* ===== LOGOS CON TRANSICIÓN ===== */}

        <div style={styles.logoArea}>

          {logos.map((logo, i) => (

            <img
              key={i}
              src={logo}
              alt="logo"
              style={{
                ...styles.logo,
                opacity: logoIndex === i ? 1 : 0,
              }}
            />

          ))}

        </div>

        <h1 style={styles.titulo}>
          SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL
        </h1>

        <div style={{ width: "150px" }}></div>

      </header>

      {/* ================= MAIN ================= */}

      <div style={styles.mainContent}>

        {/* ================= SIDEBAR ================= */}

        <aside style={styles.sidebar}>

          <div style={styles.topSidebar}>

            <div style={styles.activeTab}>

              <span style={styles.tabIcon}>
                ⊞
              </span>

              <span style={styles.tabText}>
                Inicio
              </span>

            </div>

          </div>

          <div style={styles.userSection}>

            <div style={styles.userAvatar}>

              <div style={styles.avatarCircle}>
                👤
              </div>

            </div>

            <p style={styles.navLabelTitle}>
              TITULAR
            </p>

            <p style={styles.navLabelSubtitle}>
              Nombre usuario
            </p>

            <button style={styles.logoutBtn}>
              ⏻
            </button>

          </div>

        </aside>

        {/* ================= CONTENIDO ================= */}

        <main style={styles.cardsContainer}>

          <div style={styles.cardsGrid}>

            {cards.map((card) => (

              <div
                key={card.id}
                style={styles.cardWrapper}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(card.path)}
              >

                <div
                  style={{
                    ...styles.card,

                    transform:
                      hoveredCard === card.id
                        ? "translate(10px, 10px)"
                        : "translate(0, 0)",

                    backgroundColor:
                      hoveredCard === card.id
                        ? "#DCD4BE"
                        : "#FFFFFF",

                    boxShadow:
                      hoveredCard === card.id
                        ? "none"
                        : "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >

                  <h3 style={styles.cardTitle}>
                    {card.title}
                  </h3>

                  <div style={styles.cardIcon}>

                    <img
                      src={card.icon}
                      alt={card.title}
                      style={styles.iconImage}
                    />

                  </div>

                </div>

                <div style={styles.cardShadow}></div>

              </div>

            ))}

          </div>

        </main>

      </div>

    </div>

  );
}

const styles = {

  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#FFFFFF",
    fontFamily: "'Inter', sans-serif",
  },

  header: {
    backgroundColor: "#8E2A25",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    position: "relative",
  },

  // ===== CONTENEDOR LOGOS =====

  logoArea: {
    width: "150px",
    height: "65px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // ===== LOGOS ENCIMADOS =====

  logo: {
    position: "absolute",
    height: "65px",
    width: "100%",
    objectFit: "contain",
    transition: "opacity 0.6s ease-in-out",
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: "22px",
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
    margin: 0,
    fontFamily: "serif",
  },

  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },

  sidebar: {
    width: "180px",
    backgroundColor: "#E9E9E7",
    borderRight: "1px solid #DCD4BE",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: "20px",
  },

  topSidebar: {
    width: "100%",
  },

  activeTab: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#DCD4BE",
    borderTop: "1px solid #CCC",
    borderBottom: "1px solid #CCC",
    gap: "10px",
  },

  tabIcon: {
    color: "#8E2A25",
    fontSize: "20px",
  },

  tabText: {
    color: "#8E2A25",
    fontWeight: "600",
  },

  userSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
  },

  userAvatar: {
    marginBottom: "5px",
  },

  avatarCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    border: "2px solid #2E5FA7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "10px",
  },

  navLabelTitle: {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#333333",
    margin: 0,
  },

  navLabelSubtitle: {
    fontSize: "13px",
    color: "#555",
    margin: "2px 0 15px 0",
  },

  logoutBtn: {
    background: "none",
    border: "none",
    color: "#2E5FA7",
    cursor: "pointer",
    transition: "transform 0.2s",
    fontSize: "22px",
  },

  cardsContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#FFFFFF",
  },

  cardsGrid: {
    display: "flex",
    gap: "60px",
    justifyContent: "center",
  },

  cardWrapper: {
    position: "relative",
    width: "200px",
    height: "260px",
    cursor: "pointer",
  },

  card: {
    position: "absolute",
    zIndex: 2,
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    border: "1px solid #E0E0E0",
    transition: "all 0.2s ease-out",
  },

  cardShadow: {
    position: "absolute",
    zIndex: 1,
    top: "12px",
    left: "12px",
    width: "100%",
    height: "100%",
    backgroundColor: "#8E2A25",
    borderRadius: "12px",
  },

  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333333",
    marginBottom: "25px",
    fontFamily: "serif",
  },

  cardIcon: {
    width: "70px",
    height: "70px",
  },

  iconImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

};