import "./Alert.css";

/**
 * Alert — componente reutilizable para mensajes al usuario
 *
 * Props:
 *  type     {String}   — 'success' | 'error' | 'warning' | 'info'
 *  title    {String}   — título del mensaje (opcional)
 *  message  {String}   — mensaje principal
 *  isOpen   {Boolean}  — controla si se muestra
 *  onClose  {Function} — se llama al presionar Aceptar
 *
 * Ejemplo — éxito:
 *  <Alert
 *    type="success"
 *    title="Operación exitosa"
 *    message="El libro fue asignado correctamente."
 *    isOpen={alertOpen}
 *    onClose={() => setAlertOpen(false)}
 *  />
 *
 * Ejemplo — error:
 *  <Alert
 *    type="error"
 *    message="Ocurrió un error al guardar. Intenta de nuevo."
 *    isOpen={alertOpen}
 *    onClose={() => setAlertOpen(false)}
 *  />
 *
 * Ejemplo — advertencia:
 *  <Alert
 *    type="warning"
 *    title="Atención"
 *    message="Este estudiante ya tiene un libro asignado."
 *    isOpen={alertOpen}
 *    onClose={() => setAlertOpen(false)}
 *  />
 *
 * Ejemplo — información:
 *  <Alert
 *    type="info"
 *    title="Información"
 *    message="El periodo activo es 2026."
 *    isOpen={alertOpen}
 *    onClose={() => setAlertOpen(false)}
 *  />
 *
 * Uso típico en un módulo:
 *  const [alert, setAlert] = useState({ isOpen: false, type: '', title: '', message: '' });
 *
 *  const showAlert = (type, message, title = '') =>
 *    setAlert({ isOpen: true, type, message, title });
 *
 *  const closeAlert = () =>
 *    setAlert((prev) => ({ ...prev, isOpen: false }));
 *
 *  // Llamadas:
 *  showAlert('success', 'Libro asignado correctamente.');
 *  showAlert('error',   'No se pudo guardar. Intenta de nuevo.');
 *  showAlert('warning', 'El estudiante ya tiene préstamo activo.', 'Atención');
 *  showAlert('info',    'Solo se muestran libros disponibles.', 'Información');
 *
 *  // En el JSX:
 *  <Alert {...alert} onClose={closeAlert} />
 */

const CONFIG = {
  success: {
    icon:       "✓",
    iconClass:  "alert-icon--success",
    btnClass:   "alert-btn--success",
    defaultTitle: "Operación exitosa",
  },
  error: {
    icon:       "✕",
    iconClass:  "alert-icon--error",
    btnClass:   "alert-btn--error",
    defaultTitle: "Ha ocurrido un error",
  },
  warning: {
    icon:       "⚠",
    iconClass:  "alert-icon--warning",
    btnClass:   "alert-btn--warning",
    defaultTitle: "Advertencia",
  },
  info: {
    icon:       "i",
    iconClass:  "alert-icon--info",
    btnClass:   "alert-btn--info",
    defaultTitle: "Información",
  },
};

export default function Alert({
  type = "info",
  title,
  message = "",
  isOpen = false,
  onClose,
}) {
  if (!isOpen) return null;

  const config = CONFIG[type] ?? CONFIG.info;
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

        {/* BOTÓN */}
        <button
          className={`alert-btn ${config.btnClass}`}
          onClick={onClose}
        >
          Aceptar
        </button>

      </div>
    </div>
  );
}