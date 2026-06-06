import React from 'react';
import Icon from './Icon';

// Importación de iconos solicitados para el ejemplo
import { 
  mdiHome, 
  mdiAccount, 
  mdiTruck, 
  mdiWarehouse, 
  mdiFileDocument, 
  mdiChartBar 
} from '@mdi/js';

export default function IconExamples() {
  const exampleStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    border: '1px solid #eee',
    borderRadius: '8px',
    minWidth: '100px'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Ejemplos de Componente Icon Reutilizable (MDI)</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        
        <div style={exampleStyle}>
          <Icon icon={mdiHome} size={2} color="#4CAF50" />
          <span>Inicio</span>
        </div>

        <div style={exampleStyle}>
          <Icon icon={mdiAccount} size={2} color="#2196F3" />
          <span>Cuenta</span>
        </div>

        <div style={exampleStyle}>
          <Icon icon={mdiTruck} size={2} color="#FF9800" />
          <span>Camión</span>
        </div>

        <div style={exampleStyle}>
          <Icon icon={mdiWarehouse} size={2} color="#795548" />
          <span>Almacén</span>
        </div>

        <div style={exampleStyle}>
          <Icon icon={mdiFileDocument} size={2} color="#607D8B" />
          <span>Documento</span>
        </div>

        <div style={exampleStyle}>
          <Icon icon={mdiChartBar} size={2} color="#9C27B0" />
          <span>Reporte</span>
        </div>

      </div>
    </div>
  );
}
