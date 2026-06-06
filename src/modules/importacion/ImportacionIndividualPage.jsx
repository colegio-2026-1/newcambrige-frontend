import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import ModuleLayout from "../../components/layout/ModuleLayout";
import ImportacionSidebar from "./ImportacionSidebar";
import Header from "../../components/layout/header";
import { useAuth } from "../../api/useAuth";
import { sincronizarEstudiantesRequest, sincronizarDocentesRequest } from "../../api/importacionService";

import styles from "./ImportacionIndividualPage.module.css";

import Icon from "../../components/common/Icon";
import { mdiHome, mdiRobot, mdiServer, mdiCardAccountDetails } from '@mdi/js';

export default function ImportacionIndividualPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tipo } = useParams(); // 'estudiante' o 'docente'
  
  const [fileData, setFileData] = useState([]);
  const [salones, setSalones] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const initialForm = { 
    codigo: "", 
    primerNombre: "", 
    segundoNombre: "", 
    primerApellido: "", 
    segundoApellido: "", 
    grado: "", 
    grupo: "", 
    contacto: "" 
  };
  const [form, setForm] = useState(initialForm);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const tituloBandera = tipo ? tipo.toUpperCase() : "INDIVIDUAL";
  const isEstudiante = tipo === "estudiante";
  const sidebarUser = user ? { ...user, rol: user.roles?.[0]?.toUpperCase() || "TITULAR" } : null;

  const menuItems = [
    { label: "Inicio", path: "/home", icon: <Icon icon={mdiHome} size={1.5} /> },
    { label: "Conexión", path: `/importacion/${tipo}`, icon: <Icon icon={mdiRobot} size={1.5} /> },
    { label: "Carga Masiva", path: `/importacion/masiva/${tipo}`, icon: <Icon icon={mdiServer} size={1.5} /> },
    { label: "Carga Individual", path: `/importacion/individual/${tipo}`, icon: <Icon icon={mdiCardAccountDetails} size={1.5} /> }
  ];

  // Reset CSS background
  useEffect(() => {
    const moduleContent = document.querySelector('.module-content');
    if (moduleContent) {
      moduleContent.style.backgroundColor = '#FFFFFF';
      moduleContent.style.margin = '0';
      moduleContent.style.borderRadius = '0';
    }
    return () => {
      if (moduleContent) {
        moduleContent.style.backgroundColor = '';
        moduleContent.style.margin = '';
        moduleContent.style.borderRadius = '';
      }
    };
  }, []);

  // Fetch Salones
  useEffect(() => {
    const fetchSalones = async () => {
      try {
        const res = await axiosClient.get("/api/salones");
        setSalones(res.data);
      } catch (error) {
        // Error silencioso al cargar salones
      }
    };
    fetchSalones();
  }, []);

  // Derived Options
  const gradosUnicos = [...new Set(salones.map(s => s.grado))].sort();
  const gruposDelGrado = salones.filter(s => s.grado === form.grado).map(s => s.grupo).sort();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "grupo" && value === "AGREGAR") {
      if (!form.grado) return; // Validación preventiva
      // Calcular siguiente grupo
      let nextGroup = "A";
      if (gruposDelGrado.length > 0) {
        const lastGroup = gruposDelGrado[gruposDelGrado.length - 1];
        if (/^[a-zA-Z]+$/.test(lastGroup)) {
          // Es una letra (ej. A -> B)
          nextGroup = String.fromCharCode(lastGroup.charCodeAt(0) + 1);
        } else if (!isNaN(lastGroup)) {
          // Es numero (ej. 1 -> 2)
          nextGroup = (parseInt(lastGroup) + 1).toString();
        }
      }
      setForm({ ...form, grupo: nextGroup });
      // Añadir temporalmente al arreglo para que se visualice
      gruposDelGrado.push(nextGroup);
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleAdd = () => {
    if (!form.codigo || !form.primerNombre || !form.primerApellido || !form.grado || !form.grupo) {
      alert("Por favor diligencia al menos Código, Primer Nombre, Primer Apellido, Grado y Grupo.");
      return;
    }

    // Construir el nombre completo de forma limpia, ignorando campos vacíos
    const partesNombre = [
      form.primerNombre.trim(),
      form.segundoNombre.trim(),
      form.primerApellido.trim(),
      form.segundoApellido.trim()
    ].filter(Boolean); // filtra los que sean falsy (vacíos)

    const nombreCompleto = partesNombre.join(" ");

    let newRecord = {};
    if (isEstudiante) {
      newRecord = {
        documento: form.codigo,
        nombre: nombreCompleto,
        grado: form.grado,
        curso: form.grupo,
        observaciones: form.contacto // Viaja a telefono_acudiente
      };
    } else {
      newRecord = {
        documento: form.codigo,
        nombre: nombreCompleto,
        grado_titular: form.grado,
        curso_titular: form.grupo
      };
    }

    setFileData([...fileData, newRecord]);
    setForm(initialForm); // Limpiar formulario
    setCurrentPage(1); // Resetear paginación
  };

  const handleValidarGuardar = async () => {
    if (fileData.length === 0) return;
    setIsUploading(true);

    try {
      // 1. Carga Masiva (Inserción en Staging secuencial)
      const resCarga = await axiosClient.post("/api/importacion/carga-masiva", {
        tipo: tipo,
        datos: fileData
      });

      const ejecucionId = resCarga.data.ejecucion_id;

      // 2. Sincronización oficial
      let resSync;
      if (tipo === "estudiante") {
         resSync = await sincronizarEstudiantesRequest(ejecucionId);
      } else {
         resSync = await sincronizarDocentesRequest(ejecucionId);
      }

      alert(`¡Sincronización exitosa!\nInsertados: ${resSync.data.insertados} | Actualizados: ${resSync.data.actualizados} | Rechazados: ${resSync.data.rechazados}`);
      setFileData([]);
    } catch (e) {
      alert("Error durante la validación y guardado.");
    } finally {
      setIsUploading(false);
    }
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = fileData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(fileData.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL" />
      <ModuleLayout sidebar={<ImportacionSidebar menuItems={menuItems} selectedMenu="Carga Individual" user={sidebarUser} />}>
        <div className={styles.container}>
          
          <div className={styles.topSection}>
            <div className={styles.titleSection}>
              <h3>CARGA INDIVIDUAL</h3>
              <p>Carga {tipo}s manualmente</p>
              
              {/* INLINE FORM */}
              <div className={styles.formArea}>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{flex: 0.8}}>
                    <label>Código</label>
                    <input type="text" name="codigo" value={form.codigo} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Primer Nombre</label>
                    <input type="text" name="primerNombre" value={form.primerNombre} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Segundo Nombre</label>
                    <input type="text" name="segundoNombre" value={form.segundoNombre} onChange={handleInputChange} />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Primer Apellido</label>
                    <input type="text" name="primerApellido" value={form.primerApellido} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Segundo Apellido</label>
                    <input type="text" name="segundoApellido" value={form.segundoApellido} onChange={handleInputChange} />
                  </div>
                  <div className={styles.formGroup} style={{flex: 0.5}}></div> {/* Espaciador para alinear */}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Grado</label>
                    <select name="grado" value={form.grado} onChange={handleInputChange}>
                      <option value="">Seleccione...</option>
                      {gradosUnicos.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Grupo</label>
                    <select name="grupo" value={form.grupo} onChange={handleInputChange} disabled={!form.grado}>
                      <option value="">Seleccione...</option>
                      {/* Mostrar el grupo autocalculado si fue seleccionado */}
                      {form.grupo && !gruposDelGrado.includes(form.grupo) && (
                         <option value={form.grupo}>{form.grupo}</option>
                      )}
                      {gruposDelGrado.map((g, i) => (
                        <option key={i} value={g}>{g}</option>
                      ))}
                      <option value="AGREGAR" style={{fontWeight: "bold", color: "#4a6ea8"}}>+ Agregar Grupo</option>
                    </select>
                  </div>

                  {isEstudiante && (
                    <div className={styles.formGroup}>
                      <label>Contacto del Padre</label>
                      <input type="text" name="contacto" value={form.contacto} onChange={handleInputChange} />
                    </div>
                  )}
                </div>

                <div className={styles.addBtnContainer}>
                  <button className={styles.addBtn} onClick={handleAdd}>Agregar {tipo}</button>
                </div>
              </div>

            </div>

            <div className={styles.badgeSection}>
              <div className={styles.badgeFlag}>{tituloBandera}</div>
            </div>
          </div>

          <div className={styles.tableSection}>
            <table className={styles.previewTable}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre Completo</th>
                  <th>Grado</th>
                  <th>Grupo</th>
                  {isEstudiante && <th>Contacto del Padre</th>}
                </tr>
              </thead>
              <tbody>
                {fileData.length > 0 ? (
                  currentRecords.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.documento}</td>
                      <td>{row.nombre}</td>
                      <td>{isEstudiante ? row.grado : row.grado_titular}</td>
                      <td>{isEstudiante ? row.curso : row.curso_titular}</td>
                      {isEstudiante && <td>{row.observaciones}</td>}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    {isEstudiante && <td></td>}
                  </tr>
                )}
              </tbody>
            </table>

            {fileData.length > 0 && (
              <div className={styles.paginationSection}>
                <button onClick={handlePrevPage} disabled={currentPage === 1} className={styles.pageBtn}>
                  Anterior
                </button>
                <span className={styles.pageInfo}>
                  Página {currentPage} de {totalPages || 1} ({fileData.length} registros totales)
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className={styles.pageBtn}>
                  Siguiente
                </button>
              </div>
            )}
          </div>

          <div className={styles.actionSection} style={{ marginBottom: "20px" }}>
            <button 
              className={styles.saveBtn} 
              disabled={fileData.length === 0 || isUploading}
              onClick={handleValidarGuardar}
            >
              {isUploading ? "Guardando..." : "Validar y Guardar"}
            </button>
          </div>

        </div>
      </ModuleLayout>
    </div>
  );
}
