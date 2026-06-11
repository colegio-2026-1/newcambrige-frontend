import "./PazYSalvoModal.css";


export default function PazYSalvoModal({
  isOpen,
  onClose,
  estudiante,
  firmas,
  selloUrl,
  firmasUrls,
  tipo = "estudiante"
}){
  const esDocente = tipo === "docente";
  if (!isOpen) return null;
  const detalleMap = {};
  estudiante?.detalle_firmas?.forEach((item) => {
    detalleMap[item.nombre] = item;
  });
  const renderFirma = (nombreModulo, firmaUrl) => {
  const detalle = detalleMap[nombreModulo];
  if (!detalle) {
    return <div className="firma-placeholder" />;
  }
  if (detalle.no_aplica) {
    return (
      <img
        src={selloUrl}
        alt="Sello"
        className="paz-salvo-sello"
      />
    );
  }
  if (detalle.firmado) {
    return (
      <img
        src={firmaUrl}
        alt="Firma"
        className="paz-salvo-firma"
      />
    );
  }
  return <div className="firma-placeholder" />;
};
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
        <div className={esDocente ? "paz-salvo-grid-docente" : "paz-salvo-grid"}>
          {esDocente ? (
              <div className="firma-item">
                <div className="firma-imagen-container">
                  {renderFirma(
                    "Rectoría",
                    firmasUrls?.Rectoría
                  )} 
                </div>
                <div className="firma-linea" />
                <span>Rectoría</span>
              </div>
          ) : (
            <>
              <div className="firma-item">
                <div className="firma-imagen-container">
                  {renderFirma(
                    "Rectoría",
                    firmasUrls?.Rectoría
                  )}
                </div>
                <div className="firma-linea" />
                <span>Rectoría</span>
              </div>
              <div className="firma-item">
                <div className="firma-imagen-container">
                  {renderFirma(
                    "Coordinadora",
                    firmasUrls?.Coordinadora
                  )}
                </div>
                <div className="firma-linea" />
                <span>Coordinadora</span>
              </div>
              <div className="firma-item">
                <div className="firma-imagen-container">
                  {renderFirma(
                    "Titular",
                    firmasUrls?.Titular
                  )}
                </div>
                <div className="firma-linea" />
                <span>Titular</span>
              </div>
              <div className="firma-item">
                <div className="firma-imagen-container">
                  {renderFirma(
                    "Banda",
                    firmasUrls?.Banda
                  )}
                </div>
                <div className="firma-linea" />
                <span>Banda</span>
              </div>

              <div className="firma-item">
                <div className="firma-imagen-container">
                  {renderFirma(
                    "Uniforme",
                    firmasUrls?.Uniforme
                  )}
                </div>

                <div className="firma-linea" />
                <span>Uniforme</span>
              </div>

              <div className="firma-item">
                <div className="firma-imagen-container">
                  {renderFirma(
                    "Secretaría",
                    firmasUrls?.Secretaría
                  )}
                </div>

                <div className="firma-linea" />
                <span>Secretaría</span>
              </div>
            </>
          )}
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