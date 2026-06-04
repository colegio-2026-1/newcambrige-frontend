import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-root">
      <div className="notfound-bg-number">404</div>

      <div className="notfound-content">
        <div className="notfound-badge">Error de navegación</div>

        <h1 className="notfound-title">Página no<br />encontrada</h1>

        <div className="notfound-divider">
          <span></span><span className="notfound-diamond">◆</span><span></span>
        </div>

        <p className="notfound-subtitle">
          La ruta que buscas no existe o fue movida.<br />
          Regresa al inicio para continuar.
        </p>

        <button className="notfound-btn" onClick={() => navigate("/home")}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;