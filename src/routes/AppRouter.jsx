import { Routes, Route, Navigate } from "react-router-dom";

// AUTH & CORE
import LoginPage from "../modules/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute"

import TesoreriaRouter from "./TesoreriaRouter";

import ParametrizacionPage from '../modules/parametrizacion/ParametrizacionPage';
import UsuariosPage from '../modules/parametrizacion/UsuariosPage';

import NotFound from "../modules/notFound/notFound";

import Home from "../modules/Home/HomePage";


import TestPage from "../modules/test/testPage";



// ==========================================
// ENRUTADOR PRINCIPAL
// ==========================================
const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/test" element={<TestPage />} />

      {/* PRIVATE ROUTES (Requieren Login) */}
      <Route
        path="/home"
        element={

          <ProtectedRoute>

            <Home />

          </ProtectedRoute>

        }
      />

      {/* ===================== */}
      {/* FUTURAS RUTAS */}
      {/* ===================== */}

      {/*
      <Route
        path="/salones"
        element={
          <PrivateRoute>
            <SalonPage />
          </PrivateRoute>
        }
      />
      */}

      {/*
      <Route
        path="/estudiantes"
        element={
          <PrivateRoute>
            <EstudiantesPage />
          </PrivateRoute>
        }
      />
      */}
    
        {TesoreriaRouter()}  
     
      
 
      <Route 
        path="/parametrizacion" 
        element={
          <ProtectedRoute>
            <ParametrizacionPage />
          </ProtectedRoute>
      } 
      />
      <Route 
        path="/parametrizacion/usuarios" 
        element={
          <ProtectedRoute>
             <UsuariosPage />
          </ProtectedRoute>
        } 
        />
      
      <Route
        path="/banda"
        element={
          <PrivateRoute>
            <BandaHomePage />
          </PrivateRoute>
        }
      />
      <Route path="/banda/inventario" element={<PrivateRoute><InventarioPage /></PrivateRoute>} />
<Route path="/banda/prestamos" element={<PrivateRoute><PrestamosPage /></PrivateRoute>} />
<Route path="/banda/auditoria" element={<PrivateRoute><AuditoriaBandaPage /></PrivateRoute>} />

      {/* ⚠️ RUTA COMENTADA TEMPORALMENTE: Depende del componente Dashboard que no existe */}
      {/* 
      <Route
        path="/dashboard"
        element={
          <NotFound />
        }
      /> 
      */}

      {/* CATCH ALL - Redirige a login si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;