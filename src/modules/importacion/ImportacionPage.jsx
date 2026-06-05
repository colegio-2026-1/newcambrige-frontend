import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

import ModuleLayout from "../../components/layout/ModuleLayout";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/header";

import styles from "./ImportacionPage.module.css";
import { useAuth } from "../../api/useAuth";

// Eliminamos lucide-react y prepararemos las imágenes que enviaste
// Por favor, guarda las dos imágenes en la carpeta src/assets/importacion/ con estos nombres:
import iconEstudiante from "../../assets/importacion/estudiante.svg";
import iconDocente from "../../assets/importacion/docente.svg";

export default function ImportacionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { label: "Inicio", path: "/importacion", icon: <Home /> },
  ];

  const handleEstudianteClick = () => {
    navigate("/importacion/estudiante");
  };

  const handleDocenteClick = () => {
    navigate("/importacion/docente");
  };

  // useEffect para forzar el fondo blanco en el contenedor padre (module-content)
  React.useEffect(() => {
    const moduleContent = document.querySelector('.module-content');
    if (moduleContent) {
      moduleContent.style.backgroundColor = '#FFFFFF';
      moduleContent.style.margin = '0';
      moduleContent.style.borderRadius = '0';
    }
    return () => {
      // Limpiar al salir
      if (moduleContent) {
        moduleContent.style.backgroundColor = '';
        moduleContent.style.margin = '';
        moduleContent.style.borderRadius = '';
      }
    };
  }, []);

  return (
    <div>
      <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIGDE SCHOOL" />
      <ModuleLayout
        sidebar={
          <Sidebar
            menuItems={menuItems}
            selectedMenu="Inicio"
            user={user}
          />
        }
      >
        <div className={styles.container}>
          <div className={styles.cardsWrapper}>
            
            {/* Tarjeta Estudiante */}
            <button className={styles.cardBtn} onClick={handleEstudianteClick}>
              <h2 className={styles.cardTitle}>Estudiante</h2>
              <div className={styles.iconWrapper}>
                {/* Aquí cargamos la imagen en lugar del ícono */}
                <img src={iconEstudiante} alt="Estudiante" className={styles.customIcon} />
              </div>
            </button>

            {/* Tarjeta Docente */}
            <button className={styles.cardBtn} onClick={handleDocenteClick}>
              <h2 className={styles.cardTitle}>Docente</h2>
              <div className={styles.iconWrapper}>
                <img src={iconDocente} alt="Docente" className={styles.customIcon} />
              </div>
            </button>

          </div>
        </div>
      </ModuleLayout>
    </div>
  );
}
