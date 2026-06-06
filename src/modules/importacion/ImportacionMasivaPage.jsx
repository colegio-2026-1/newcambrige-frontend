import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaDownload, FaCloudUploadAlt } from "react-icons/fa";
import * as XLSX from "xlsx";
import axiosClient from "../../api/axiosClient";

import ModuleLayout from "../../components/layout/ModuleLayout";
import ImportacionSidebar from "./ImportacionSidebar";
import Header from "../../components/layout/header";
import { useAuth } from "../../api/useAuth";

import {
  sincronizarEstudiantesRequest,
  sincronizarDocentesRequest,
  cancelarScrapingRequest
} from "../../api/importacionService";

import styles from "./ImportacionMasivaPage.module.css";

import Icon from "../../components/common/Icon";
import { mdiHome, mdiRobot, mdiServer, mdiCardAccountDetails } from '@mdi/js';

export default function ImportacionMasivaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tipo } = useParams(); // 'estudiante' o 'docente'
  
  const [fileData, setFileData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [ejecucionInfo, setEjecucionInfo] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [syncDone, setSyncDone] = useState(false);

  const tituloBandera = tipo ? tipo.toUpperCase() : "MASIVA";
  const isEstudiante = tipo === "estudiante";

  const sidebarUser = user ? { ...user, rol: user.roles?.[0]?.toUpperCase() || "TITULAR" } : null;

  const menuItems = [
    { label: "Inicio", path: "/home", icon: <Icon icon={mdiHome} size={1.5} /> },
    { label: "Conexión", path: `/importacion/${tipo}`, icon: <Icon icon={mdiRobot} size={1.5} /> },
    { label: "Carga Masiva", path: `/importacion/masiva/${tipo}`, icon: <Icon icon={mdiServer} size={1.5} /> },
    { label: "Carga Individual", path: `/importacion/individual/${tipo}`, icon: <Icon icon={mdiCardAccountDetails} size={1.5} /> }
  ];

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

  const handleDownloadTemplate = () => {
    // Apunta a la carpeta public o assets. Idealmente desde /plantillas/
    const url = isEstudiante ? "/plantillas/Plantilla_Estudiantes.xlsx" : "/plantillas/Plantilla_Docentes.xlsx";
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plantilla_${tituloBandera}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- DRAG AND DROP ---
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => {
    setIsDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      // Filtrar filas vacías
      const filteredData = data.filter(row => row.length > 0 && row.some(cell => cell !== null && cell !== ""));
      
      // Remover cabeceras y mapear a un arreglo de objetos según el tipo
      const rows = filteredData.slice(1).map(row => {
        if (isEstudiante) {
          return {
            documento: row[0]?.toString(),
            nombre: row[1]?.toString(),
            grado: row[2]?.toString(),
            curso: row[3]?.toString(),
            observaciones: row[4]?.toString() // Contacto del Padre
          };
        } else {
          return {
            documento: row[0]?.toString(),
            nombre: row[1]?.toString(),
            grado_titular: row[2]?.toString(),
            curso_titular: row[3]?.toString()
          };
        }
      }).filter(item => item.documento && item.nombre); // Solo items con documento y nombre

      setFileData(rows.slice(0, 500)); // Máximo 500
      setCurrentPage(1); // Reset pagination
    };
    reader.readAsBinaryString(file);
  };

  // --- UPLOAD TO BACKEND ---
  const handleUpload = async () => {
    if (fileData.length === 0) return;
    
    setIsUploading(true);
    try {
      const response = await axiosClient.post("/api/importacion/carga-masiva", {
        tipo: tipo,
        datos: fileData
      });
      
      setEjecucionInfo({
        id: response.data.ejecucion_id,
        registros: response.data.insertados
      });
      setModalMessage("");
      setSyncDone(false);
      setShowModal(true);
      
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- PAGINATION LOGIC ---
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

  // --- MODAL ACTIONS ---
  const handleAceptar = async () => {
    setModalMessage("Sincronizando datos en el sistema...");
    try {
      let resSync;
      if (tipo === "estudiante") {
         resSync = await sincronizarEstudiantesRequest(ejecucionInfo.id);
      } else {
         resSync = await sincronizarDocentesRequest(ejecucionInfo.id);
      }
      setSyncDone(true);
      setModalMessage(`¡Sincronización exitosa!\\nInsertados: ${resSync.data.insertados} | Actualizados: ${resSync.data.actualizados} | Rechazados: ${resSync.data.rechazados}`);
      setFileData([]); // Limpiar la vista
    } catch (e) {
      setModalMessage("Error al sincronizar los datos.");
    }
  };

  const handleCancelar = async () => {
    if (syncDone) {
      setShowModal(false);
      return;
    }
    const confirmar = window.confirm("¿Seguro que deseas cancelar? Se truncarán los datos de esta ejecución.");
    if (confirmar) {
      setModalMessage("Cancelando ejecución y limpiando datos...");
      try {
        await cancelarScrapingRequest(ejecucionInfo.id, tipo);
        setShowModal(false);
        alert("Operación cancelada. Datos truncados.");
      } catch (e) {
        alert("Error al cancelar la operación.");
        setShowModal(false);
      }
    }
  };

  return (
    <div>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL" />
      <ModuleLayout
        sidebar={
          <ImportacionSidebar
            menuItems={menuItems}
            selectedMenu="Carga Masiva"
            user={sidebarUser}
          />
        }
      >
        <div className={styles.container}>
          
          <div className={styles.topSection}>
            <div className={styles.titleSection}>
              <h3>CARGA MASIVA</h3>
              <p>Carga {tipo}s desde un archivo .xlsx</p>
              <button className={styles.downloadBtn} onClick={handleDownloadTemplate}>
                <FaDownload /> Descargar plantilla
              </button>
            </div>

            <div 
              className={`${styles.dropzoneArea} ${isDragging ? styles.dragActive : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <FaCloudUploadAlt className={styles.uploadIcon} />
              <p className={styles.dropzoneText}>Arrastra tu archivo aquí o <u>seleccionar</u></p>
              <p className={styles.dropzoneSubText}>.xlsx máximo 500 registros</p>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                onChange={onFileInputChange} 
              />
            </div>

            <div className={styles.badgeSection}>
              <div className={styles.badgeFlag}>{tituloBandera}</div>
            </div>
          </div>

          <div className={styles.actionSection}>
            <button 
              className={styles.loadBtn} 
              disabled={fileData.length === 0 || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? "Cargando..." : "Cargar"}
            </button>
          </div>

          <div className={styles.tableSection}>
            <h4 className={styles.tableTitle}>FORMATO DEL ARCHIVO (HORIZONTAL)</h4>
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
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  Anterior
                </button>
                <span className={styles.pageInfo}>
                  Página {currentPage} de {totalPages || 1} ({fileData.length} registros totales)
                </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={styles.pageBtn}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>

          {/* MODAL EMERGENTE */}
          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <span>CARGA MASIVA</span>
                  <button type="button" className={styles.closeButton} onClick={handleCancelar}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                  {modalMessage ? (
                     <p style={{ whiteSpace: "pre-line" }}>{modalMessage}</p>
                  ) : (
                    <>
                      <p>Información que se cargó.</p>
                      <p>ID de Ejecución: <strong>{ejecucionInfo?.id}</strong></p>
                      <p>Registros validados: <strong>{ejecucionInfo?.registros}</strong></p>
                      <p>¿Desea validar e insertar los datos?</p>
                    </>
                  )}
                </div>
                <div className={styles.modalActions}>
                  {!syncDone && <button type="button" className={styles.btnAceptar} onClick={handleAceptar}>Aceptar</button>}
                  <button type="button" className={styles.btnCancelar} onClick={handleCancelar}>
                    {syncDone ? "Cerrar" : "Cancelar"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </ModuleLayout>
    </div>
  );
}
