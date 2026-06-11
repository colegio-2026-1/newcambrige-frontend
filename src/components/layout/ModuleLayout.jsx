import { useEffect } from "react";
import "./ModuleLayout.css";
import { checkSessionRequest } from "../../api/authService";

export default function ModuleLayout({ sidebar, actions, children }) {

  // VALIDACIÓN DE SESIÓN (aqui se cambia el tiempo de cada cuanto se manda el checkeo)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await checkSessionRequest();
      } catch (error) {
        console.log("Sesión expirada");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="module-layout">
      {/* SIDEBAR IZQUIERDO */}
      <div className="module-sidebar">{sidebar}</div>

      {/* CONTENIDO CENTRAL */}
      <div className="module-content">
        <div className="module-body">
          <div className="module-children">{children}</div>
          {/* BOTONES DERECHA */}
          {actions && (
            <div className="module-actions">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
}