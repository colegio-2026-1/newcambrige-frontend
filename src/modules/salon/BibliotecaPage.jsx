import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoUni from "../../assets/UP.png";
import logoNCS from "../../assets/NCS.png";

export default function BibliotecaPage() {

  const navigate = useNavigate();

  // ================= VISTAS =================

  const [vista, setVista] = useState("inicio");

  // ================= MODALES =================

  const [showAsignar, setShowAsignar] = useState(false);
  const [showDevolver, setShowDevolver] = useState(false);
  const [showAgregar, setShowAgregar] = useState(false);

  // ================= FILAS =================

  const filas = Array(16).fill({});

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

          <div>

            <div
              style={
                vista === "inicio"
                  ? styles.activeTab
                  : styles.inactiveSidebarTab
              }
              onClick={() => setVista("inicio")}
            >
              <span>⊞</span>
              Inicio
            </div>

            <div
              style={
                vista === "inventario"
                  ? styles.activeTab
                  : styles.inactiveSidebarTab
              }
              onClick={() => setVista("inventario")}
            >
              Inventario
              <br />
              Libros
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

          {/* ================================================= */}
          {/* ================= VISTA INICIO ================== */}
          {/* ================================================= */}

          {vista === "inicio" && (

            <>

              {/* ================= FILTROS ================= */}

              <div style={styles.filterBar}>

                <div style={styles.filtersInicio}>

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

                      <th style={styles.th}>
                        <input type="checkbox" />
                      </th>

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
                        TÍTULO DEL LIBRO
                      </th>

                      <th style={styles.th}>
                        FECHA DE ENTREGA
                      </th>

                      <th style={styles.th}>
                        ESTADO
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filas.map((_, i) => (

                      <tr
                        key={i}
                        style={{
                          backgroundColor:
                            i % 2 === 0
                              ? "#EFEFEF"
                              : "#FFFFFF",
                        }}
                      >

                        <td style={styles.td}>
                          <input type="checkbox" />
                        </td>

                        <td style={styles.td}></td>
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
                        ></td>

                      </tr>

                    ))}

                  </tbody>

                </table>

                {/* ================= BOTONES ================= */}

                <div style={styles.sideButtons}>

                  <button
                    style={styles.assignBtn}
                    onClick={() => setShowAsignar(true)}
                  >
                    Asignar Libro
                  </button>

                  <button
                    style={styles.returnBtn}
                    onClick={() => setShowDevolver(true)}
                  >
                    Devolver Libro
                  </button>

                </div>

              </div>

            </>

          )}

          {/* ===================================================== */}
          {/* ================= VISTA INVENTARIO ================== */}
          {/* ===================================================== */}

          {vista === "inventario" && (

            <>

              {/* ================= FILTROS ================= */}

              <div style={styles.filterBar}>

                <div style={styles.filtersInventario}>

                  <label style={styles.label}>
                    Código
                  </label>

                  <input style={styles.input} />

                  <label style={styles.label}>
                    Título del Libro
                  </label>

                  <input style={styles.inputVeryWide} />

                  <label style={styles.label}>
                    Edición
                  </label>

                  <input style={styles.input} />

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

                      <th style={styles.th}>
                        <input type="checkbox" />
                      </th>

                      <th style={styles.th}>
                        ID
                      </th>

                      <th style={styles.th}>
                        TÍTULO DEL LIBRO
                      </th>

                      <th style={styles.th}>
                        AUTOR
                      </th>

                      <th style={styles.th}>
                        EDICIÓN
                      </th>

                      <th style={styles.th}>
                        DISPONIBILIDAD
                      </th>

                      <th style={styles.th}>
                        ESTADO FÍSICO
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filas.map((_, i) => (

                      <tr
                        key={i}
                        style={{
                          backgroundColor:
                            i % 2 === 0
                              ? "#EFEFEF"
                              : "#FFFFFF",
                        }}
                      >

                        <td style={styles.td}>
                          <input type="checkbox" />
                        </td>

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

                {/* ================= BOTONES ================= */}

                <div style={styles.sideButtons}>

                  <button
                    style={styles.addBtn}
                    onClick={() => setShowAgregar(true)}
                  >
                    Agregar Libro
                  </button>

                  <button style={styles.editBtn}>
                    Editar Libro
                  </button>

                  <button style={styles.deleteBtn}>
                    Eliminar Libro
                  </button>

                </div>

              </div>

            </>

          )}

        </main>

      </div>

      {/* ================================================= */}
      {/* ================= MODAL ASIGNAR ================= */}
      {/* ================================================= */}

      {showAsignar && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <button
              style={styles.closeBtn}
              onClick={() => setShowAsignar(false)}
            >
              ×
            </button>

            <h2 style={styles.modalTitle}>
              ASIGNAR LIBRO
            </h2>

            <div style={styles.modalGrid}>

              <div style={styles.modalField}>
                <label>Título del Libro</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Edición</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Fecha de Entrega</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Estado del Libro</label>
                <input style={styles.modalInput} />
              </div>

            </div>

            <div style={styles.observationField}>

              <label>
                Observación
              </label>

              <input style={styles.observationInput} />

            </div>

            <div style={styles.modalButtons}>

              <button style={styles.acceptBtn}>
                Aceptar
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowAsignar(false)}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================================================== */}
      {/* ================= MODAL DEVOLVER ================= */}
      {/* ================================================== */}

      {showDevolver && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <button
              style={styles.closeBtn}
              onClick={() => setShowDevolver(false)}
            >
              ×
            </button>

            <h2 style={styles.modalTitle}>
              DEVOLVER LIBRO
            </h2>

            <div style={styles.modalGrid}>

              <div style={styles.modalField}>
                <label>Título del Libro</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Edición</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Fecha de Entrega</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Fecha Devolución</label>
                <input style={styles.modalInput} />
              </div>

            </div>

            <div style={styles.modalButtons}>

              <button style={styles.acceptBtn}>
                Aceptar
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowDevolver(false)}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* ================= MODAL AGREGAR ================= */}
      {/* ================================================= */}

      {showAgregar && (

        <div style={styles.modalOverlay}>

          <div style={styles.modal}>

            <button
              style={styles.closeBtn}
              onClick={() => setShowAgregar(false)}
            >
              ×
            </button>

            <h2 style={styles.modalTitle}>
              AGREGAR LIBRO
            </h2>

            <div style={styles.modalGrid}>

              <div style={styles.modalField}>
                <label>Título del Libro</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Edición</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Autor</label>
                <input style={styles.modalInput} />
              </div>

              <div style={styles.modalField}>
                <label>Fecha Registro</label>
                <input style={styles.modalInput} />
              </div>

            </div>

            <div style={styles.modalButtons}>

              <button style={styles.acceptBtn}>
                Aceptar
              </button>

              <button
                style={styles.cancelBtn}
                onClick={() => setShowAgregar(false)}
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
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "170px",
  },

  logo: {
    height: "65px",
  },

  logoUni: {
    height: "65px",
  },

  title: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: "26px",
    fontWeight: "700",
    fontFamily: "serif",
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

  activeTab: {
    margin: "0 18px 12px",
    height: "48px",
    backgroundColor: "#DDD6C4",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#5A1D1A",
    textAlign: "center",
  },

  inactiveSidebarTab: {
    margin: "0 18px",
    height: "48px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#333333",
    textAlign: "center",
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
  },

  userName: {
    margin: "3px 0 12px",
    fontSize: "14px",
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

  filtersInicio: {
    display: "grid",
    gridTemplateColumns:
      "auto 1fr auto 2fr auto 1fr auto 1fr auto 1fr auto",
    alignItems: "center",
    gap: "12px",
    width: "100%",
  },

  filtersInventario: {
    display: "grid",
    gridTemplateColumns:
      "auto 1fr auto 3fr auto 1fr auto",
    alignItems: "center",
    gap: "12px",
    width: "100%",
  },

  label: {
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  input: {
    width: "100%",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid #BBBBBB",
    backgroundColor: "#F2F2F2",
    padding: "0 10px",
  },

  inputWide: {
    width: "100%",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid #BBBBBB",
    backgroundColor: "#F2F2F2",
    padding: "0 10px",
  },

  inputVeryWide: {
    width: "100%",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid #BBBBBB",
    backgroundColor: "#F2F2F2",
    padding: "0 10px",
  },

  select: {
    width: "100%",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid #BBBBBB",
    backgroundColor: "#F2F2F2",
    padding: "0 6px",
  },

  searchBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "18px",
    padding: "8px 24px",
    cursor: "pointer",
  },

  tableArea: {
    flex: 1,
    display: "flex",
    gap: "18px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #CFCFCF",
    borderTop: "none",
    borderRadius: "0 0 14px 14px",
    padding: "10px",
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
  },

  td: {
    height: "32px",
    border: "1px solid #D6D6D6",
  },

  sideButtons: {
    width: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "18px",
  },

  assignBtn: {
    backgroundColor: "#C9A646",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "24px",
    padding: "14px 18px",
    fontSize: "16px",
    cursor: "pointer",
  },

  returnBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "24px",
    padding: "14px 18px",
    fontSize: "16px",
    cursor: "pointer",
  },

  addBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "24px",
    padding: "14px 18px",
    fontSize: "16px",
    cursor: "pointer",
  },

  editBtn: {
    backgroundColor: "#B8B8B8",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "24px",
    padding: "14px 18px",
    fontSize: "16px",
    cursor: "pointer",
  },

  deleteBtn: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "24px",
    padding: "14px 18px",
    fontSize: "16px",
    cursor: "pointer",
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
    width: "700px",
    backgroundColor: "#FFFFFF",
    borderRadius: "24px",
    padding: "40px",
    position: "relative",
  },

  closeBtn: {
    position: "absolute",
    right: "18px",
    top: "14px",
    border: "none",
    background: "none",
    fontSize: "28px",
    cursor: "pointer",
  },

  modalTitle: {
    textAlign: "center",
    marginBottom: "35px",
    fontSize: "30px",
    fontFamily: "serif",
  },

  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px 28px",
  },

  modalField: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  modalInput: {
    flex: 1,
    height: "30px",
    border: "1px solid #BBBBBB",
  },

  observationField: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "18px",
  },

  observationInput: {
    width: "300px",
    height: "30px",
    border: "1px solid #BBBBBB",
  },

  modalButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    marginTop: "30px",
  },

  acceptBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "20px",
    padding: "10px 28px",
    cursor: "pointer",
  },

  cancelBtn: {
    backgroundColor: "#2E5FA7",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "20px",
    padding: "10px 28px",
    cursor: "pointer",
  },

};