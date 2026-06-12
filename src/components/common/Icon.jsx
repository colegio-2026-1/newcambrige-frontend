import React from 'react';
import { Icon as MdiIcon } from '@mdi/react';

/**
 * Componente envoltorio reutilizable para Material Design Icons (MDI).
 * @param {string} icon - Path del icono desde @mdi/js.
 * @param {number|string} size - Tamaño del icono (multiplicador de 24px o string css).
 * @param {string} color - Color del icono.
 * @param {string} className - Clases CSS adicionales.
 */
export default function Icon({ icon, size = 1, color = 'currentColor', className = '' }) {
  if (!icon) return null;
  
  return (
    <MdiIcon 
      path={icon} 
      size={size} 
      color={color} 
      className={className} 
    />
  );
}
