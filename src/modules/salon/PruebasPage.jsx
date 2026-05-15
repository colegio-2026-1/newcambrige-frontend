import React, { useEffect, useState } from "react";
import logoUni from "../../assets/UP.png";
import logoNCS from "../../assets/NCS.png";

export default function PruebasPage() {

  const [showValidar, setShowValidar] = useState(false);
  const [showError, setShowError] = useState(false);

  // ================= LOGOS HEADER =================

  const logos = [logoNCS, logoUni];

  const [index, setIndex] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setIndex((prev) => (prev + 1) % logos.length);

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const filas = Array(14).fill({});

  return (

    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <header style={styles.header}>

        {/* LOGOS CON TRANSICIÓN */}

        <div style={styles.logoContainer}>

          {logos.map((logo, i) => (

            <img
              key={i}
              src={logo}
              alt="logo"
              style={{
                ...styles.logoFade,
                opacity: index === i ? 1 : 0,
              }}
            />

          ))}

        </div>

        <h1 style={styles.title}>
          SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL
        </h1>

      </header>

      {/* ================= MAIN ================= */}

      <div style={styles.mainContent}>

        {/* ================= SIDEBAR ================= */}

        <aside style={styles.sidebar}>

          <div>

            <div style={styles.inactiveTab}>
              <span style={styles.tabIcon}>⊞</span>
              Inicio
            </div>

            <div style={styles.activeTab}>
              <span style={styles.tabIcon}>▣</span>
              Pruebas
            </div>

          </div>

          {/* ================= USER ================= */}

          <div style={styles.userSection}>

            <div style={styles.avatarCircle}>
              👤
            </div>

            <p style={styles.userTitle}>
              TITULAR
            </p>

            <p style={styles.userName}>
              Nombre usuario
            </p>

            <button style={styles.logoutBtn}>
              ↪
            </button>

          </div>

        </aside>

        {/* ================= CONTENT ================= */}

        <main style={styles.contentArea}>

          {/* ================= FILTERS ================= */}

          <div style={styles.filterBar}>

            <div style={styles.filters}>

              <label style={styles.label}>
                Código
              </label>

              <input style={styles.input} />

              <label style={styles.label}>
                Nombre
              </label>

              <input style={styles.inputWide} />

              <label style={styles.label}>
                Grado
              </label>

              <select style={styles.select}>
                <option></option>
              </select>

              <label style={styles.label}>
                Grupo
              </label>

              <select style={styles.select}>
                <option></option>
              </select>

              <label style={styles.label}>
                Año
              </label>

              <select style={styles.select}>
                <option></option>
              </select>

              <button style={styles.searchBtn}>
                Buscar
              </button>

            </div>

          </div>

          {/* ================= TABLA ================= */}

          <div style={styles.tableArea}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th style={styles.th}></th>

                  <th style={styles.th}>
                    CÓDIGO
                  </th>

                  <th style={styles.th}>
                    NOMBRE COMPLETO
                  </th>

                  <th style={styles.th}>
                    GRADO
                  </th>

                  <th style={styles.th}>
                    GRUPO
                  </th>

                  <th style={styles.th}>
                    TIPO DE PRUEBA
                  </th>

                  <th style={styles.th}>
                    PAGO
                  </th>

                  <th style={styles.th}>
                    FECHA DE PAGO
                  </th>

                </tr>

              </thead>

              <tbody>

  <tr style={{ backgroundColor: "#E9E9E7" }}>

    <td style={styles.tdCenter}>

      <input
        type="checkbox"
        defaultChecked
      />

    </td>

    <td style={styles.td}>
      1234
    </td>

    <td style={styles.td}>
      María Paz Castro P.
    </td>

    <td style={styles.td}>
      Sexto
    </td>

    <td style={styles.td}>
      A
    </td>

    <td style={styles.td}>
      Saber
    </td>

    <td
      style={{
        ...styles.td,
        color: "#456450",
        fontWeight: "600",
      }}
    >
      Completo
    </td>

    <td
      style={{
        ...styles.td,
        color: "#456450",
      }}
    >
      01 - 06 - 2026
    </td>

  </tr>

  <tr style={{ backgroundColor: "#FFFFFF" }}>

    <td style={styles.tdCenter}>

      <input type="checkbox" />

    </td>

    <td style={styles.td}></td>
    <td style={styles.td}></td>
    <td style={styles.td}></td>
    <td style={styles.td}></td>
    <td style={styles.td}></td>

    <td
      style={{
        ...styles.td,
        color: "#C9A646",
        fontWeight: "600",
      }}
    >
      Pendiente
    </td>

    <td style={styles.td}></td>

  </tr>

  <tr style={{ backgroundColor: "#E9E9E7" }}>

    <td style={styles.tdCenter}>

      <input type="checkbox" />

    </td>

    <td style={styles.td}></td>
    <td style={styles.td}></td>
    <td style={styles.td}></td>
    <td style={styles.td}></td>
    <td style={styles.td}></td>

    <td
      style={{
        ...styles.td,
        color: "#8E2A25",
        fontWeight: "600",
      }}
    >
      Crítico
    </td>

    <td style={styles.td}></td>

  </tr>

  {filas.map((_, i) => (

    <tr
      key={i}
      style={{
        backgroundColor:
          i % 2 === 0
            ? "#FFFFFF"
            : "#E9E9E7",
      }}
    >

      <td style={styles.tdCenter}>

        <input type="checkbox" />

      </td>

      <td style={styles.td}></td>
      <td style={styles.td}></td>
      <td style={styles.td}></td>
      <td style={styles.td}></td>
      <td style={styles.td}></td>
      <td style={styles.td}></td>
      <td style={styles.td}></td>

    </tr>

  ))}

</tbody>

            </table>

            {/* ================= BOTÓN ================= */}

            <div style={styles.sideButtons}>

              <button
                style={styles.validarBtn}
                onClick={() => setShowValidar(true)}
              >
                Validar Pago
              </button>

            </div>

          </div>

        </main>

      </div>

      {/* ================= MODAL VALIDAR ================= */}

      {showValidar && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <button
              style={styles.closeBtn}
              onClick={() => setShowValidar(false)}
            >
              ×
            </button>

            <div style={styles.modalContent}>

              ¿CONFIRMAS QUE EL ESTUDIANTE
              <br />

              [NOMBRE], HA CUMPLIDO CON EL PAGO DEL
              <br />

              CONCEPTO DE PRUEBAS?

            </div>

            <div style={styles.modalButtons}>

              <button style={styles.acceptBtn}>
                Aceptar
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowValidar(false)}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

const styles = {

  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#E9E9E7",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
  },

  header: {
    height: "100px",
    backgroundColor: "#8E2A25",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    position: "relative",
  },

  // ================= LOGOS FADE =================

  logoContainer: {
    width: "170px",
    height: "65px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  logoFade: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "opacity 0.6s ease-in-out",
  },

  title: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#FFFFFF",
    fontSize: "26px",
    fontWeight: "700",
    fontFamily: "serif",
    whiteSpace: "nowrap",
  },

  mainContent: {
    display: "flex",
    flex: 1,
  },

  sidebar: {
    width: "210px",
    backgroundColor: "#E9E9E7",
    borderRight: "1px solid #DCD4BE",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 0",
  },

  activeTab: {
    marginBottom: "8px",
    height: "48px",
    backgroundColor: "#8E2A25",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingLeft: "22px",
    color: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
  },

  inactiveTab: {
    marginBottom: "8px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingLeft: "22px",
    color: "#333333",
    fontWeight: "500",
    cursor: "pointer",
    backgroundColor: "#DCD4BE",
  },

  tabIcon: {
    fontSize: "18px",
  },

  userSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "15px",
  },

  avatarCircle: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    backgroundColor: "#FFFFFF",
    border: "3px solid #8E2A25",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    marginBottom: "10px",
  },

  userTitle: {
    margin: 0,
    fontSize: "12px",
    fontWeight: "700",
    color: "#333333",
  },

  userName: {
    margin: "4px 0 12px",
    fontSize: "14px",
    color: "#333333",
  },

  logoutBtn: {
    border: "none",
    background: "none",
    color: "#333333",
    fontSize: "24px",
    cursor: "pointer",
  },

  contentArea: {
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
  },

  filterBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: "14px 14px 0 0",
    padding: "12px 14px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "auto 1fr auto 2fr auto 1fr auto 1fr auto 1fr auto",
    alignItems: "center",
    gap: "12px",
    width: "100%",
  },

  label: {
    fontSize: "15px",
    color: "#333333",
    whiteSpace: "nowrap",
  },

  input: {
    width: "100%",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid #8E2A25",
    backgroundColor: "#FFFFFF",
    padding: "0 10px",
    outline: "none",
  },

  inputWide: {
    width: "100%",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid #8E2A25",
    backgroundColor: "#FFFFFF",
    padding: "0 10px",
    outline: "none",
  },

  select: {
    width: "100%",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid #8E2A25",
    backgroundColor: "#FFFFFF",
    padding: "0 6px",
    outline: "none",
  },

  searchBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "18px",
    padding: "8px 24px",
    cursor: "pointer",
    boxShadow: "0 3px #1B3C68",
  },

  tableArea: {
    flex: 1,
    display: "flex",
    gap: "18px",
    backgroundColor: "#FFFFFF",
    borderRadius: "0 0 14px 14px",
    padding: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    height: "36px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #8E2A25",
    textAlign: "center",
    fontSize: "11px",
    fontWeight: "700",
    color: "#333333",
  },

  td: {
    height: "32px",
    border: "1px solid #CFCFCF",
    textAlign: "center",
    fontSize: "13px",
    color: "#333333",
  },

    tdCenter: {
    height: "32px",
    border: "1px solid #CFCFCF",
    textAlign: "center",
    verticalAlign: "middle",
},

  sideButtons: {
    width: "170px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    paddingBottom: "10px",
  },

  validarBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "28px",
    padding: "14px 18px",
    fontSize: "17px",
    cursor: "pointer",
    boxShadow: "0 4px #1B3C68",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    width: "560px",
    backgroundColor: "#FFFFFF",
    border: "3px solid #8E2A25",
    borderRadius: "28px",
    padding: "40px 35px",
    position: "relative",
    boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
  },

  closeBtn: {
    position: "absolute",
    right: "18px",
    top: "12px",
    border: "none",
    background: "none",
    fontSize: "28px",
    color: "#333333",
    cursor: "pointer",
  },

  modalContent: {
    textAlign: "center",
    fontSize: "20px",
    lineHeight: "1.8",
    color: "#333333",
    fontWeight: "500",
    marginTop: "10px",
  },

  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    marginTop: "35px",
  },

  acceptBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "22px",
    padding: "10px 30px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px #1B3C68",
  },

  cancelBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "22px",
    padding: "10px 30px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px #1B3C68",
  },

};