import "./Alert.css";

/**
 * Alert — componente reutilizable para mensajes al usuario
 *
 * Props:
 *  type       {String}   — 'success' | 'error' | 'warning' | 'info'
 *  title      {String}   — título del mensaje (opcional)
 *  message    {String}   — mensaje principal
 *  isOpen     {Boolean}  — controla si se muestra
 *  onClose    {Function} — se llama al presionar Aceptar
 *  onCancel   {Function} — (opcional) si se pasa, aparece botón Cancelar
 *  cancelText {String}   — (opcional) texto del botón cancelar, default 'Cancelar'
 *  acceptText {String}   — (opcional) texto del botón aceptar, default 'Aceptar'
 *
 * Ejemplo — solo Aceptar (comportamiento anterior, sin cambios):
 *  <Alert
 *    type="success"
 *    title="Operación exitosa"
 *    message="El libro fue asignado correctamente."
 *    isOpen={alertOpen}
 *    onClose={closeAlert}
 *  />
 *
 * Ejemplo — con Cancelar (confirmación):
 *  <Alert
 *    type="warning"
 *    title="¿Estás seguro?"
 *    message="Esta acción eliminará el registro permanentemente."
 *    isOpen={alertOpen}
 *    onClose={handleConfirm}
 *    onCancel={closeAlert}
 *  />
 *
 * Ejemplo — textos personalizados:
 *  <Alert
 *    type="warning"
 *    title="¿Estás seguro?"
 *    message="Se perderán los cambios sin guardar."
 *    isOpen={alertOpen}
 *    onClose={handleConfirm}
 *    onCancel={closeAlert}
 *    acceptText="Sí, continuar"
 *    cancelText="No, volver"
 *  />
 *
 * Uso típico con confirmación:
 *  const [alert, setAlert] = useState({
 *    isOpen: false, type: '', title: '', message: '',
 *    onClose: null, onCancel: null
 *  });
 *
 *  const showConfirm = (message, onConfirm) =>
 *    setAlert({
 *      isOpen: true, type: 'warning',
 *      title: '¿Estás seguro?', message,
 *      onClose: () => { onConfirm(); closeAlert(); },
 *      onCancel: closeAlert,
 *    });
 *
 *  const closeAlert = () =>
 *    setAlert((prev) => ({ ...prev, isOpen: false }));
 */

const CONFIG = {
  success: {
    icon:         "✓",
    iconClass:    "alert-icon--success",
    btnClass:     "alert-btn--success",
    defaultTitle: "Operación exitosa",
  },
  error: {
    icon:         "✕",
    iconClass:    "alert-icon--error",
    btnClass:     "alert-btn--error",
    defaultTitle: "Ha ocurrido un error",
  },
  warning: {
    icon:         "⚠",
    iconClass:    "alert-icon--warning",
    btnClass:     "alert-btn--warning",
    defaultTitle: "Advertencia",
  },
  info: {
    icon:         "i",
    iconClass:    "alert-icon--info",
    btnClass:     "alert-btn--info",
    defaultTitle: "Información",
  },
};

export default function Alert({
  type       = "info",
  title,
  message    = "",
  isOpen     = false,
  onClose,
  onCancel,
  cancelText = "Cancelar",
  acceptText = "Aceptar",
}) {
  if (!isOpen) return null;

  const config       = CONFIG[type] ?? CONFIG.info;
  const displayTitle = title || config.defaultTitle;

  return (
    <div className="alert-overlay">
      <div className="alert-container">

        {/* ÍCONO */}
        <div className={`alert-icon ${config.iconClass}`}>
          {config.icon}
        </div>

        {/* TÍTULO */}
        <h3 className="alert-title">{displayTitle}</h3>

        {/* MENSAJE */}
        <p className="alert-message">{message}</p>

        {/* BOTONES */}
        <div className={`alert-actions ${onCancel ? "alert-actions--two" : ""}`}>
          {onCancel && (
            <button className="alert-btn alert-btn--cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className={`alert-btn ${config.btnClass}`} onClick={onClose}>
            {acceptText}
          </button>
        </div>

      </div>
    </div>
  );
}