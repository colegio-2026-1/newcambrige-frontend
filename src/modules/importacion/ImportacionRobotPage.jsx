import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/header";
import { useAuth } from "../../api/useAuth";

import {
  obtenerCredencialesRequest,
  actualizarCredencialesRequest,
  iniciarScrapingEstudiantesRequest,
  iniciarScrapingDocentesRequest,
  sincronizarEstudiantesRequest,
  sincronizarDocentesRequest,
  cancelarScrapingRequest
} from "../../api/importacionService";

import styles from "./ImportacionRobotPage.module.css";

import iconHome from "../../assets/importacion/Icons/Home.svg";
import iconRobot from "../../assets/importacion/Icons/Robot.svg";
import iconCargaMasiva from "../../assets/importacion/Icons/Carga_Masiva.svg";
import iconCargaIndividual from "../../assets/importacion/Icons/Carga_Individual.svg";

// Videos MP4 locales
import videoIdle from "../../assets/importacion/GIF/Robot.mp4";
import videoTrabajando from "../../assets/importacion/GIF/Robot_Trabajando.mp4";
import videoTerminado from "../../assets/importacion/GIF/Robot_Terminado.mp4";
import videoError from "../../assets/importacion/GIF/Robot_Error.mp4";

export default function ImportacionRobotPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // :tipo vendrá en la URL (ej. 'estudiante' o 'docente')
  const { tipo } = useParams();
  const tituloBandera = tipo ? tipo.toUpperCase() : "ROBOT";

  // Formulario y Estados
  const [url, setUrl] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  
  // Estado del robot: 'idle', 'loading', 'success', 'error'
  const [robotState, setRobotState] = useState("idle");
  const [mensaje, setMensaje] = useState("Aún no se ha conectado el robot");
  const [progress, setProgress] = useState(0);

  // Estados del Modal
  const [showModal, setShowModal] = useState(false);
  const [ejecucionInfo, setEjecucionInfo] = useState(null);

  // Timer para progreso simulado
  useEffect(() => {
    let intervalId;
    if (robotState === "loading") {
      setProgress(0);
      // Avanzar hasta 90% en ~60 segundos. 60s = 60000ms. 60000ms / 90 pasos = ~666ms por paso
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 1;
          return prev;
        });
      }, 666);
    } else if (robotState === "success") {
      setProgress(100);
    } else if (robotState === "idle") {
      setProgress(0);
    }
    
    return () => clearInterval(intervalId);
  }, [robotState]);

  const sidebarUser = user ? { ...user, rol: user.roles?.[0]?.toUpperCase() || "TITULAR" } : null;

  const menuItems = [
    { label: "Inicio", path: "/importacion", icon: iconHome },
    { label: "Conexión", path: `/importacion/${tipo}`, icon: iconRobot },
    { label: "Carga Masiva", path: `/importacion/masiva/${tipo}`, icon: iconCargaMasiva },
    { label: "Carga Individual", path: `/importacion/individual/${tipo}`, icon: iconCargaIndividual },
  ];

  // 1. Cargar credenciales al iniciar
  useEffect(() => {
    // Forzar el fondo blanco en este componente
    const moduleContent = document.querySelector('.module-content');
    if (moduleContent) {
      moduleContent.style.backgroundColor = '#FFFFFF';
      moduleContent.style.margin = '0';
      moduleContent.style.borderRadius = '0';
    }

    cargarCredenciales();

    return () => {
      if (moduleContent) {
        moduleContent.style.backgroundColor = '';
        moduleContent.style.margin = '';
        moduleContent.style.borderRadius = '';
      }
    };
  }, []);

  const cargarCredenciales = async () => {
    try {
      const res = await obtenerCredencialesRequest();
      setUrl(res.data.url);
      setUsuario(res.data.nombre_usuario);
      setPassword(res.data.password_hash);
    } catch (error) {
      // Credenciales no existen o no cargadas
    }
  };

  // 2. Acción de Conectar
  const handleConectar = async (e) => {
    e.preventDefault();
    
    // Primero, guardar las credenciales (por si las cambiaron)
    setRobotState("loading");
    setMensaje("Robot conectando y verificando credenciales...");

    try {
      await actualizarCredencialesRequest({
        url,
        nombre_usuario: usuario,
        password
      });

      // Segundo, encender el robot
      setMensaje(`Robot trabajando... descargando información de ${tipo}s`);
      
      let resScraping;
      if (tipo === "estudiante") {
        resScraping = await iniciarScrapingEstudiantesRequest();
      } else {
        resScraping = await iniciarScrapingDocentesRequest();
      }

      if (resScraping.data.estado === "error") {
        setRobotState("error");
        setMensaje("El robot se ha tropezado. Revisa la consola o los logs.");
      } else if (resScraping.data.estado === "completado_con_errores") {
        setRobotState("error");
        setMensaje("Scraping finalizado, pero hubo algunos errores de extracción.");
      } else {
        setRobotState("success");
        setMensaje("Scraping finalizado. Esperando validación...");
        setEjecucionInfo({
          id: resScraping.data.ejecucion_id,
          registros: tipo === 'estudiante' ? resScraping.data.registros_estudiantes : resScraping.data.registros_docentes
        });
        setShowModal(true);
      }

    } catch (error) {
      alert("Ocurrió un error al contactar al servidor.");
      setMensaje("Error crítico de conexión. Asegúrate de que las credenciales sean correctas.");
    }
  };

  const handleAceptar = async () => {
    setShowModal(false);
    setRobotState("loading");
    setMensaje("Sincronizando datos en el sistema...");
    try {
      let resSync;
      if (tipo === "estudiante") {
         resSync = await sincronizarEstudiantesRequest(ejecucionInfo.id);
      } else {
         resSync = await sincronizarDocentesRequest(ejecucionInfo.id);
      }
      setRobotState("success");
      setMensaje(`¡Sincronización exitosa!\\nInsertados: ${resSync.data.insertados} | Actualizados: ${resSync.data.actualizados} | Rechazados: ${resSync.data.rechazados}`);
    } catch (e) {
      setRobotState("error");
      setMensaje("Error al sincronizar los datos.");
    }
  };

  const handleCancelar = async () => {
    const confirmar = window.confirm("¿Seguro que deseas cancelar? Se truncarán los datos descargados en esta ejecución.");
    if (confirmar) {
      setShowModal(false);
      setRobotState("loading");
      setMensaje("Cancelando ejecución y limpiando datos temporales...");
      try {
        await cancelarScrapingRequest(ejecucionInfo.id, tipo);
        setRobotState("idle");
        setMensaje("Operación cancelada. Datos truncados exitosamente.");
        setProgress(0);
      } catch (e) {
        setRobotState("error");
        setMensaje("Error al cancelar la operación.");
      }
    }
  };

  // Selector dinámico del video
  const getVideoSource = () => {
    switch (robotState) {
      case "loading": return videoTrabajando;
      case "success": return videoTerminado;
      case "error": return videoError;
      default: return videoIdle;
    }
  };

  return (
    <div>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL" />
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu="Conexión"
            user={sidebarUser}
          />
        }
      >
        <div className={styles.container}>
          
          {/* CABECERA: Formulario + Bandera */}
          <div className={styles.topSection}>
            <form className={styles.formSection} onSubmit={handleConectar}>
              <div className={styles.inputGroup}>
                <label>Url</label>
                <input 
                  type="text" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  required 
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Usuario</label>
                <input 
                  type="text" 
                  value={usuario} 
                  onChange={(e) => setUsuario(e.target.value)} 
                  required 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button type="submit" className={styles.connectBtn} disabled={robotState === "loading"}>
                  {robotState === "loading" ? "Conectando..." : "Conectar"}
                </button>
              </div>
            </form>

            <div className={styles.badgeSection}>
              <div className={styles.badgeFlag}>{tituloBandera}</div>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* ÁREA DEL ROBOT */}
          <div className={styles.robotArea}>
            <div className={styles.progressContainerWrapper}>
              {robotState === "idle" && (
                <p className={styles.robotMessage}>{mensaje}</p>
              )}
              {robotState !== "idle" && (
                <div className={styles.progressLayout}>
                  <p className={styles.robotMessage}>
                    {robotState === "loading" ? (
                      <>El robot está haciendo su trabajo,<br />ten un poco de paciencia...</>
                    ) : mensaje}
                  </p>
                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarBackground}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${progress}%`, backgroundColor: robotState === "error" ? "#e74c3c" : "#F6C83B" }}
                      ></div>
                    </div>
                    <span className={styles.progressText}>{progress}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.videoWrapper}>
              <video key={robotState} autoPlay loop muted playsInline className={styles.robotVideo}>
                <source src={getVideoSource()} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
              </video>
            </div>
          </div>

          {/* MODAL EMERGENTE */}
          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <span>CONEXIÓN DEL ROBOT</span>
                  <button type="button" className={styles.closeButton} onClick={handleCancelar}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                  <p>Información que se cargó.</p>
                  <p>ID de Ejecución: <strong>{ejecucionInfo?.id}</strong></p>
                  <p>Registros listos: <strong>{ejecucionInfo?.registros}</strong></p>
                  <p>¿Desea validar e insertar los datos?</p>
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.btnAceptar} onClick={handleAceptar}>Aceptar</button>
                  <button type="button" className={styles.btnCancelar} onClick={handleCancelar}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </ModuleLayout>
    </div>
  );
}
