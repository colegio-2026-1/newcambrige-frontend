import React from "react";

// ===== IMPORTACIÓN DE IMÁGENES =====
import logoUni from "../../assets/UP.png";
import logoNCS from "../../assets/NCS.png";

import pupitresIcon from "../../assets/pupitres.png";
import bibliotecaIcon from "../../assets/biblioteca.png";
import pruebasIcon from "../../assets/pruebas.png";

export default function SalonPage() {
  return (
    <div style={styles.container}>
      
      {/* ================= HEADER ================= */}
      <header style={styles.header}>

        <div style={styles.logoArea}>
          <img src={logoNCS} alt="Colegio" style={styles.logo} />
          <div style={styles.logoDivider} />
          <img src={logoUni} alt="Unipamplona" style={styles.logo} />
        </div>

        {/* TITULO ABAJO */}
        <h1 style={styles.titulo}>
          SISTEMA DE PAZ Y SALVO — NEW CAMBRIDGE SCHOOL
        </h1>
      </header>

      {/* ================= CONTENIDO ================= */}
      <div style={styles.mainContent}>

        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <nav style={styles.navMenu}>
            <div style={styles.navItem}>
              <div style={styles.navIcon}>👤</div>

              <div style={styles.navLabel}>
                <p style={styles.navLabelTitle}>TITULAR</p>
                <p style={styles.navLabelSubtitle}>Nombre usuario</p>
              </div>
            </div>

            <button style={styles.logoutBtn}>➜</button>
          </nav>
        </aside>

        {/* CARDS */}
        <main style={styles.cardsContainer}>
          
          <h2 style={styles.sectionTitle}>Inicio</h2>
          
          <div style={styles.cardsGrid}>

            {/* CARD 1 */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Pupitres</h3>

              <div style={styles.cardIcon}>
                <img src={pupitresIcon} alt="Pupitres" style={styles.iconImage} />
              </div>
            </div>

            {/* CARD 2 */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Biblioteca</h3>

              <div style={styles.cardIcon}>
                <img src={bibliotecaIcon} alt="Biblioteca" style={styles.iconImage} />
              </div>
            </div>

            {/* CARD 3 */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Pruebas</h3>

              <div style={styles.cardIcon}>
                <img src={pruebasIcon} alt="Pruebas" style={styles.iconImage} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////

const styles = {

  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  
  // HEADER
  header: {
    backgroundColor: "#8E2A25",
    height: "120px",
    display: "flex",
    alignItems: "flex-end", // 👈 baja contenido
    paddingLeft: "24px",
    paddingRight: "32px",
    paddingBottom: "20px", // 👈 espacio abajo
    gap: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    position: "relative",
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    zIndex: 1,
  },

  logo: {
    height: "45px",
    width: "auto",
    objectFit: "contain",
  },

  logoDivider: {
    width: "1px",
    height: "55px",
    backgroundColor: "rgba(255,255,255,0.4)",
  },

  // TITULO ABAJO
  titulo: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "20px", // 👈 clave para bajarlo

    color: "#FFFFFF",
    fontSize: "22px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    fontFamily: "'Georgia', serif",
    margin: 0,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },

  sidebar: {
    width: "235px",
    backgroundColor: "#f0f0f0",
    borderRight: "1px solid #ddd",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  navMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },

  navIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  navLabel: {
    display: "flex",
    flexDirection: "column",
  },

  navLabelTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#333",
    margin: 0,
  },

  navLabelSubtitle: {
    fontSize: "12px",
    color: "#666",
    margin: 0,
  },

  logoutBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "20px",
  },

  cardsContainer: {
    flex: 1,
    padding: "70px",
    overflowY: "auto",
  },

  sectionTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "30px",
    margin: 0,
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "30px",
  },

  // CARD con tus medidas
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    cursor: "pointer",
    position: "relative",
    border: "9px solid transparent",
    borderRight: "12px solid #8E2A25",
    borderBottom: "12px solid #8E2A25",
  },

  cardIcon: {
    width: "100px",
    height: "100px",
    margin: "0 auto 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  iconImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  cardTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#333",
    margin: "10px",
  },
};