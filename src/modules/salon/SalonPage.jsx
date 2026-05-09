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
          <img src={logoUni} alt="Unipamplona" style={styles.logoUni} />
        </div>

        <h1 style={styles.titulo}>
          SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL
        </h1>
      </header>

      {/* ================= CONTENIDO ================= */}
      <div style={styles.mainContent}>

        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.topSidebar}>
            <div style={styles.activeTab}>
               <span style={styles.tabIcon}>⊞</span> 
               <span style={styles.tabText}>Inicio</span>
            </div>
          </div>

          <div style={styles.userSection}>
            <div style={styles.userAvatar}>
              <div style={styles.avatarCircle}>👤</div>
            </div>
            <p style={styles.navLabelTitle}>TITULAR</p>
            <p style={styles.navLabelSubtitle}>Nombre usuario</p>
            <button style={styles.logoutBtn}>LogoutIcon</button> {/* Sustituir por icono de salida azul */}
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main style={styles.cardsContainer}>
          <div style={styles.cardsGrid}>

            {/* CARD 1 */}
            <div style={styles.cardWrapper}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Pupitres</h3>
                    <div style={styles.cardIcon}>
                        <img src={pupitresIcon} alt="Pupitres" style={styles.iconImage} />
                    </div>
                </div>
                <div style={styles.cardShadow}></div>
            </div>

            {/* CARD 2 */}
            <div style={styles.cardWrapper}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Biblioteca</h3>
                    <div style={styles.cardIcon}>
                        <img src={bibliotecaIcon} alt="Biblioteca" style={styles.iconImage} />
                    </div>
                </div>
                <div style={styles.cardShadow}></div>
            </div>

            {/* CARD 3 */}
            <div style={styles.cardWrapper}>
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Pruebas</h3>
                    <div style={styles.cardIcon}>
                        <img src={pruebasIcon} alt="Pruebas" style={styles.iconImage} />
                    </div>
                </div>
                <div style={styles.cardShadow}></div>
            </div>

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
    backgroundColor: "#8E2A25", // Rojo vino de la imagen
    height: "100px",
    display: "flex",
    alignItems: "center",
    padding: "0 40px",
    gap: "30px",
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logo: {
    height: "65px",
    width: "auto",
  },

  logoUni: {
    height: "65px",
    width: "auto",
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: "24px",
    fontWeight: "400",
    letterSpacing: "1px",
    margin: 0,
    fontFamily: "serif", // Para dar el toque elegante de la imagen
  },

  mainContent: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },

  sidebar: {
    width: "180px",
    backgroundColor: "#F8F8F8",
    borderRight: "1px solid #E0E0E0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: "20px",
  },

  activeTab: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#FFFFFF",
    borderTop: "1px solid #E0E0E0",
    borderBottom: "1px solid #E0E0E0",
    gap: "10px",
  },

  tabIcon: {
    color: "#8E2A25",
    fontSize: "20px",
  },

  tabText: {
    color: "#8E2A25",
    fontWeight: "600",
    fontSize: "16px",
  },

  userSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "30px",
    textAlign: "center",
  },

  avatarCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "10px",
  },

  navLabelTitle: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#555",
    margin: "0",
    textTransform: "uppercase",
  },

  navLabelSubtitle: {
    fontSize: "14px",
    color: "#777",
    margin: "2px 0 10px 0",
  },

  logoutBtn: {
    background: "none",
    border: "none",
    color: "#0056b3",
    cursor: "pointer",
    fontSize: "18px",
  },

  cardsContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#fff",
  },

  cardsGrid: {
    display: "flex",
    gap: "50px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  /* EFECTO DE SOMBRA SÓLIDA TIPO CARD */
  cardWrapper: {
    position: "relative",
    width: "200px",
    height: "280px",
  },

  card: {
    position: "absolute",
    zIndex: 2,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // Sombra suave superior
    border: "1px solid #eee",
  },

  cardShadow: {
    position: "absolute",
    zIndex: 1,
    top: "15px",
    left: "15px",
    width: "100%",
    height: "100%",
    backgroundColor: "#8E2A25", // El color rojo que sobresale
    borderRadius: "15px",
  },

  cardTitle: {
    fontSize: "22px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "30px",
    fontFamily: "serif",
  },

  cardIcon: {
    width: "80px",
    height: "80px",
  },

  iconImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    filter: "sepia(0.5) saturate(2) hue-rotate(-10deg)", // Para dar ese tono dorado a los iconos si son negros
  },
};