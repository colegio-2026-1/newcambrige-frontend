RESUMEN DEL PROYECTO
Sistema

Sistema Paz y Salvo — New Cambridge School.

nosostros solo estamos encargados del modulo banda

Frontend
Frontend modular construido en React + Vite
para administración de:
- Banda
- Salón
- Tesorería
- Rectoría
etc.

Stack:

React 18
Vite
Axios
Zustand
React Router

Arquitectura:

modular,
por dominio.
Módulo Banda

Actualmente implementado:

BandaLayout
BandaHomePage
InventarioPage
Diseño
Wireframes → estructura/layout
Mockups → colores/paleta

Color principal:

#8E2A25
Backend

FastAPI modular.

RBAC:

require_roles([...])

Endpoints:

categorías,
ubicaciones,
instrumentos,
préstamos,
estadísticas.
Estado actual

Frontend YA implementa:

filtros,
paginación,
CRUD,
validaciones,
modales,
badges,
toasts,
lógica de negocio parcial.

Backend todavía NO soporta:

inventario avanzado completo,
cantidades reales,
daños persistentes,
auditoría completa.

Frontend está usando tolerancia de datos para anticipar cambios.