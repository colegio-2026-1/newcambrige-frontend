import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoUni from "../../assets/UP.png";
import logoNCS from "../../assets/NCS.png";

export default function PupitrePage() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const alumnos = [
    {
      id: 1,
      codigo: "1234",
      nombre: "María Paz Castro P.",
      grado: "Sexto",
      grupo: "A",
      pago: "Completo",
      fecha: "01 - 06 - 2026",
    },

    {
      id: 2,
      codigo: "",
      nombre: "",
      grado: "",
      grupo: "",
      pago: "Pendiente",
      fecha: "",
    },

    {
      id: 3,
      codigo: "",
      nombre: "",
      grado: "",
      grupo: "",
      pago: "Crítico",
      fecha: "",
    },

    ...Array(10).fill({}),
  ];

  const getStatusStyle = (status) => {

    if (status === "Completo") {

      return {
        color: "#456450",
        fontWeight: "600",
      };

    }

    if (status === "Pendiente") {

      return {
        color: "#C9A646",
        fontWeight: "600",
      };

    }

    if (status === "Crítico") {

      return {
        color: "#8E2A25",
        fontWeight: "600",
      };

    }

    return {};
  };

  return (

    <div style={styles.container}>

      {/* ================= HEADER ================= */}

      <header style={styles.header}>

        <div style={styles.logoContainer}>

          <img
            src={logoNCS}
            alt="Colegio"
            style={styles.logo}
          />

          <img
            src={logoUni}
            alt="Unipamplona"
            style={styles.logoUni}
          />

        </div>

        <h1 style={styles.title}>
          SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL
        </h1>

      </header>

      {/* ================= MAIN ================= */}

      <div style={styles.mainContent}>

        {/* ================= SIDEBAR ================= */}

        <aside style={styles.sidebar}>

          <div style={styles.sidebarTop}>

            <div
              style={styles.inicioBtn}
              onClick={() => navigate("/salon")}
            >
              <span style={{ fontSize: "18px" }}>⊞</span>
              Inicio
            </div>

          </div>

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

              <input
                type="text"
                style={styles.input}
              />

              <label style={styles.label}>
                Nombre
              </label>

              <input
                type="text"
                style={styles.input}
              />

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

          {/* ================= TABLE ================= */}

          <div style={styles.tableContainer}>

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
                    PAGO
                  </th>

                  <th style={styles.th}>
                    FECHA DE PAGO
                  </th>

                </tr>

              </thead>

              <tbody>

                {alumnos.map((alum, i) => (

                  <tr
                    key={i}
                    style={{
                      ...styles.tr,

                      backgroundColor:
                        i % 2 === 0
                          ? "#E9E9E7"
                          : "#FFFFFF",
                    }}
                  >

                    <td style={styles.td}>

                      {alum.id && (
                        <input
                          type="checkbox"
                          defaultChecked={i === 0}
                        />
                      )}

                    </td>

                    <td style={styles.td}>
                      {alum.codigo}
                    </td>

                    <td style={styles.td}>
                      {alum.nombre}
                    </td>

                    <td style={styles.td}>
                      {alum.grado}
                    </td>

                    <td style={styles.td}>
                      {alum.grupo}
                    </td>

                    <td style={styles.td}>

                      {alum.pago && (

                        <span style={getStatusStyle(alum.pago)}>
                          {alum.pago}
                        </span>

                      )}

                    </td>

                    <td style={styles.td}>
                      {alum.fecha}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* ================= BUTTON ================= */}

          <div style={styles.footerAction}>

            <button
              style={{
                ...styles.btnValidar,

                backgroundColor:
                  (isHovered || isPressing)
                    ? "#C9A646"
                    : "#2E5FA7",

                transform:
                  (isHovered || isPressing)
                    ? "translateY(3px)"
                    : "translateY(0)",

                boxShadow:
                  (isHovered || isPressing)
                    ? "none"
                    : "0 4px #1B3C68",
              }}

              onMouseEnter={() => setIsHovered(true)}

              onMouseLeave={() => {
                setIsHovered(false);
                setIsPressing(false);
              }}

              onMouseDown={() => setIsPressing(true)}

              onMouseUp={() => {
                setIsPressing(false);
                setShowModal(true);
              }}
            >
              Validar Pago
            </button>

          </div>

        </main>

      </div>

      {/* ================= MODAL ================= */}

      {showModal && (

        <div style={styles.modalOverlay}>

          <div style={styles.modalBox}>

            <button
              style={styles.closeModal}
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <div style={styles.modalIcon}>
              ⓘ
            </div>

            <p style={styles.modalText}>

              ¿CONFIRMAS QUE EL ESTUDIANTE
              <br />

              <strong>
                MARÍA PAZ CASTRO P.
              </strong>

              <br />

              HA CUMPLIDO CON EL PAGO
              <br />

              DEL CONCEPTO DE PUPITRES?

            </p>

            <div style={styles.modalButtons}>

              <button
                style={styles.btnAceptar}
                onClick={() => setShowModal(false)}
              >
                Aceptar
              </button>

              <button
                style={styles.btnCancelar}
                onClick={() => setShowModal(false)}
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
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "170px",
  },

  logo: {
    height: "65px",
    objectFit: "contain",
  },

  logoUni: {
    height: "65px",
    objectFit: "contain",
  },

  title: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: "26px",
    fontWeight: "700",
    fontFamily: "serif",
    letterSpacing: "1px",
  },

  mainContent: {
    display: "flex",
    flex: 1,
  },

  sidebar: {
    width: "210px",
    backgroundColor: "#ECECEB",
    borderRight: "1px solid #CFCFCF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 0",
  },

  sidebarTop: {
    padding: "0 18px",
  },

  inicioBtn: {
    width: "100%",
    height: "42px",
    backgroundColor: "#F1F1F1",
    border: "1px solid #D5D5D5",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#5A1D1A",
  },

  userSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "15px",
  },

  avatarCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    backgroundColor: "#F5F5F5",
    border: "1px solid #D0D0D0",
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
    margin: "3px 0 12px",
    fontSize: "14px",
    color: "#333333",
  },

  logoutBtn: {
    border: "none",
    background: "none",
    color: "#2E5FA7",
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
    backgroundColor: "#F5F5F5",
    border: "1px solid #CFCFCF",
    borderRadius: "12px 12px 0 0",
    padding: "10px 14px",
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "auto 1.1fr auto 2fr auto 1fr auto 1fr auto 1fr auto",
    alignItems: "center",
    gap: "12px",
    width: "100%",
  },

  label: {
    fontSize: "14px",
    color: "#333333",
    whiteSpace: "nowrap",
  },

  input: {
    width: "100%",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid #BBBBBB",
    backgroundColor: "#F2F2F2",
    padding: "0 10px",
    outline: "none",
  },

  select: {
    width: "100%",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid #BBBBBB",
    backgroundColor: "#F2F2F2",
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
    fontSize: "14px",
    boxShadow: "0 2px #1B3C68",
  },

  tableContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    border: "1px solid #CFCFCF",
    borderTop: "none",
    borderRadius: "0 0 14px 14px",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    height: "36px",
    backgroundColor: "#EFEFEF",
    border: "1px solid #CFCFCF",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: "700",
    color: "#333333",
  },

  tr: {
    height: "32px",
  },

  td: {
    height: "32px",
    border: "1px solid #D6D6D6",
    textAlign: "center",
    fontSize: "13px",
    color: "#333333",
    padding: "3px 6px",
  },

  footerAction: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "14px",
  },

  btnValidar: {
    border: "none",
    borderRadius: "28px",
    padding: "12px 30px",
    color: "#FFFFFF",
    fontSize: "17px",
    cursor: "pointer",
    transition: "all 0.1s ease",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalBox: {
    width: "420px",
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    padding: "30px",
    position: "relative",
    textAlign: "center",
  },

  closeModal: {
    position: "absolute",
    top: "10px",
    right: "16px",
    border: "none",
    background: "none",
    fontSize: "28px",
    cursor: "pointer",
  },

  modalIcon: {
    fontSize: "42px",
    marginBottom: "12px",
  },

  modalText: {
    fontSize: "17px",
    lineHeight: "1.6",
    color: "#333333",
  },

  modalButtons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },

  btnAceptar: {
    backgroundColor: "#C9A646",
    border: "none",
    borderRadius: "18px",
    padding: "10px 28px",
    cursor: "pointer",
    fontWeight: "600",
  },

  btnCancelar: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "18px",
    padding: "10px 28px",
    cursor: "pointer",
    fontWeight: "600",
  },

};