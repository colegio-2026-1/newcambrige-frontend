# 🏫 Paz Salvo Frontend

Frontend de la plataforma integral de gestión escolar **Paz Salvo**, desarrollado con **React + Vite**. La aplicación centraliza la administración de aulas (Módulo Salón) y bandas musicales (Módulo Banda), ofreciendo sub‑módulos para pupitres, pruebas, biblioteca, uniformes, usuarios, tesorería y rectoría.

## ✨ Tecnologías

- **React 18** – Biblioteca de UI declarativa.
- **Vite** – Entorno de desarrollo rápido y empaquetador.
- **React Router DOM** – Enrutamiento dinámico basado en roles.
- **Axios** – Cliente HTTP con interceptores para autenticación.
- **Zustand** – Estado global simple y liviano.

## 📁 Estructura del Proyecto
```bash
root/
├── .env # Variables de entorno (local)
├── .env.example # Ejemplo de variables requeridas
├── package.json # Dependencias y scripts
├── vite.config.js # Configuración de Vite
├── index.html # Punto de entrada HTML
└── src/
├── main.jsx # Bootstrap de React
├── App.jsx # Router principal
├── api/
│ ├── axios.js # Instancia de Axios con interceptores
│ └── endpoints.js # Centralización de URLs de API
├── store/
│ └── AuthStore.js # Estado global (Zustand) para sesión/usuario
├── modules/
│ ├── auth/
│ │ ├── LoginPage.jsx
│ │ └── useAuth.js # Hook personalizado de autenticación
│ ├── salon/
│ │ ├── SalonPage.jsx
│ │ ├── PuptrePage.jsx
│ │ ├── PruebasPage.jsx
│ │ └── BibliotecaPage.jsx
│ └── banda/
│ ├── Uniformes/
│ ├── Usuarios/
│ ├── Tesorería/
│ └── Rectoría/
├── components/
│ ├── ui/ # Botones, badges, modales, toasts
│ └── layout/ # Sidebar, header, contenedor principal
└── routes/
└── ProtectedRoute.jsx # Valida rol antes de renderizar
```

## 🚀 Instalación y uso en local

Sigue estos pasos para ejecutar el proyecto en tu entorno de desarrollo.

### Requisitos previos

- **Node.js** v16 o superior
- **npm** o **yarn**

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Software262/NewCambrige-frontend.git
   cd NewCambrige-frontend

2. **Instalar dependencias**
   ```bash
   npm install

3. **Configurar variables de entorno**: Copia el archivo de ejemplo y ajusta los valores según tu backend
   ```bash
   cp .env.example .env

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev

--prueba