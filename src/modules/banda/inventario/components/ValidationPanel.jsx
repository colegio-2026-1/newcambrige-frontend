import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const ValidationPanel = ({ validaciones }) => {
  const rules = [
    { 
      label: 'Código Único', 
      valid: validaciones.codigo, 
      desc: 'Numérico y no repetido en el sistema.' 
    },
    { 
      label: 'Nombre Válido', 
      valid: validaciones.nombre, 
      desc: 'Entre 3 y 100 caracteres únicos.' 
    },
    { 
      label: 'Datos Completos', 
      valid: validaciones.datos, 
      desc: 'Categoría seleccionada y cantidad ≥ 1.' 
    }
  ];

  return (
    <div className="validation-panel">
      <h3 className="validation-title">
        <AlertCircle size={16} /> VALIDACIONES
      </h3>
      
      <div className="validation-list">
        {rules.map((rule, index) => (
          <div key={index} className={`validation-item ${rule.valid ? 'is-valid' : 'is-invalid'}`}>
            <div className="validation-icon">
              {rule.valid ? 
                <CheckCircle2 size={18} color="var(--color-success)" /> : 
                <XCircle size={18} color="var(--color-danger)" />
              }
            </div>
            <div className="validation-info">
              <span className="validation-label">{rule.label}</span>
              <p className="validation-desc">{rule.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {!validaciones.todoValido && (
        <div className="validation-footer">
          * Complete todos los puntos en verde para habilitar el guardado.
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;