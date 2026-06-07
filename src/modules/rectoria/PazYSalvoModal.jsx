import "./PazYSalvoModal.css";


export default function PazYSalvoModal({
  isOpen,
  onClose,
  estudiante,
  firmas,
  selloUrl
}) {
  if (!isOpen) return null;

  const mostrarSello = (estado) =>
    estado ? (
      <img
        src={selloUrl}
        alt="Sello"
        className="paz-salvo-sello"
      />
    ) : null;

  return (
    <div className="paz-salvo-overlay">
      <div className="paz-salvo-modal">

        <div className="paz-salvo-header">
          <h2>PAZ Y SALVO</h2>

          <button
            className="paz-salvo-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="paz-salvo-info">

          <div className="paz-salvo-dato">
            <span>Nombre:</span>

            <div className="paz-salvo-linea">
              {estudiante?.nombre}
            </div>
          </div>

          <div className="paz-salvo-dato">
            <span>Código:</span>

            <div className="paz-salvo-linea">
              {estudiante?.documento}
            </div>
          </div>

        </div>

        <div className="paz-salvo-grid">

        <div className="firma-item">
            {mostrarSello(firmas?.rectoria)}
            <div className="firma-linea" />
            
            <span>Rectoría</span>
        </div>

        <div className="firma-item">
            {mostrarSello(firmas?.salon)}
            <div className="firma-linea" />
            
            <span>Coordinación</span>
        </div>

        <div className="firma-item">
            {mostrarSello(firmas?.tesoreria)}
            <div className="firma-linea" />
            
            <span>Tesorería</span>
        </div>

        <div className="firma-item">
            {mostrarSello(firmas?.banda)}
            <div className="firma-linea" />
            
            <span>Banda</span>
        </div>

        <div className="firma-item">
            {mostrarSello(firmas?.uniforme)}
            <div className="firma-linea" />
            
            <span>Uniformes</span>
        </div>

        <div className="firma-item">
            {mostrarSello(firmas?.secretaria)}
            <div className="firma-linea" />
            
            <span>Secretaría</span>
        </div>

        </div>

        <div className="paz-salvo-footer">

          <button
            className="paz-btn"
            onClick={onClose}
          >
            Aceptar
          </button>

          <button
            className="paz-btn"
            onClick={onClose}
          >
            Cancelar
          </button>

        </div>

      </div>
    </div>
  );
}