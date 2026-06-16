import { useEffect } from "react";
import "./Modal.css"; 

export default function ParamModal({
  title = "",
  isOpen = false,
  onClose,
  children 
}) {
  
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <h2 className="modal-title">{title}</h2>

        <div className="modal-fields" style={{ display: "block" }}>
          {children}
        </div>
        
      </div>
    </div>
  );
}