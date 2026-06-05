import { Routes, Route, Navigate } from "react-router-dom";

// AUTH & CORE
import LoginPage from "../modules/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute"

import TesoreriaRouter from "./TesoreriaRouter";
import SalonRouter from "./SalonRouter"

import ParametrizacionPage from '../modules/parametrizacion/ParametrizacionPage';
import UsuariosPage from '../modules/parametrizacion/UsuariosPage';

import NotFound from "../modules/notFound/notFound";

import Home from "../modules/Home/HomePage";

// ✅ IMPORTAMOS TU ENRUTADOR DE BANDA
import BandaRouter from "./BandaRouter";

// TESORERIA
import Tesoreria from "../modules/tesoreria/Tesoreria";
import TesoreriaMatricula from "../modules/tesoreria/TesoreriaMatricula";
import TesoreriaNotificaciones from "../modules/tesoreria/TesoreriaNotificaciones";
import TesoreriaPension from "../modules/tesoreria/TesoreriaPension";
import TesoreriaPapeleria from "../modules/tesoreria/TesoreriaPapeleria";
// import TesoreriaEstadistica from "../modules/tesoreria/TesoreriaEstadistica"; // ⚠️ Comentado por error de import

// TEST
import TestPage from "../modules/test/testPage";

// ==========================================
// COMPONENTE DE PROTECCIÓN DE RUTAS (Local)
// ==========================================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ==========================================
// ENRUTADOR PRINCIPAL
// ==========================================
const AppRouter = () => {
  return (
    <Routes>
      {/* Públicas */}
        <Route path="/" element={<LoginPage />} />

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

      
      
      

      {/* MODULO TESORERIA (Limpiado y corregido) */}
      <Route path="/tesoreria">
        <Route index element={<PrivateRoute><Tesoreria /></PrivateRoute>} />
        <Route path="matricula" element={<PrivateRoute><TesoreriaMatricula /></PrivateRoute>} />
        <Route path="notificaciones" element={<PrivateRoute><TesoreriaNotificaciones /></PrivateRoute>} />
        <Route path="pension" element={<PrivateRoute><TesoreriaPension /></PrivateRoute>} />
        <Route path="papeleria" element={<PrivateRoute><TesoreriaPapeleria /></PrivateRoute>} />
        
        {/* ⚠️ Ruta de estadísticas comentada porque el archivo no existe */}
        {/* 
        <Route
          path="estadisticas"
          element={
            <PrivateRoute>
              <TesoreriaEstadistica />
            </PrivateRoute>
          }
        /> 
        */}
      </Route>

      {/* ✅ MODULO BANDA (Independiente) */}
      <Route
        path="/banda/*"
        element={
          <PrivateRoute>
            <BandaRouter />
          </PrivateRoute>
        }
      />
    
        {TesoreriaRouter()}  
        {SalonRouter()} 
      
 
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
        path="/test"
        element={
          <TestPage />
        }
      />

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;