import { Routes, Route, Navigate } from "react-router-dom";

// AUTH & CORE
import LoginPage from "../modules/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute"

import TesoreriaRouter from "./TesoreriaRouter";

import ParametrizacionPage from '../modules/parametrizacion/ParametrizacionPage';
import UsuariosPage from '../modules/parametrizacion/UsuariosPage';

import NotFound from "../modules/notFound/notFound";

import Home from "../modules/Home/HomePage";

// ⚠️ COMENTADO TEMPORALMENTE: El archivo DashboardPage no existe en la carpeta modules/dashboard
// Al comentar esta línea, evitamos el error de "Failed to resolve import"
// import Dashboard from "../modules/dashboard/DashboardPage"; 

// TESORERIA
import Tesoreria from "../modules/tesoreria/Tesoreria";
import TesoreriaMatricula from "../modules/tesoreria/TesoreriaMatricula";
import TesoreriaNotificaciones from "../modules/tesoreria/TesoreriaNotificaciones";
import TesoreriaEstadistica from "../modules/tesoreria/TesoreriaEstadistica";
import TesoreriaPension from "../modules/tesoreria/TesoreriaPension";
import TesoreriaPapeleria from "../modules/tesoreria/TesoreriaPapeleria";

// TEST
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

      {/* MODULO TESORERIA */}
      <Route path="/tesoreria">
        <Route
          index
          element={
            <PrivateRoute>
              <Tesoreria />
            </PrivateRoute>
          }
        />
        <Route
          path="matricula"
          element={
            <PrivateRoute>
              <TesoreriaMatricula />
            </PrivateRoute>
          }
        />
        <Route
          path="notificaciones"
          element={
            <PrivateRoute>
              <TesoreriaNotificaciones />
            </PrivateRoute>
          }
        />
        <Route
          path="estadisticas"
          element={
            <PrivateRoute>
              <TesoreriaEstadistica />
            </PrivateRoute>
          }
        />
        <Route
          path="pension"
          element={
            <PrivateRoute>
              <TesoreriaPension />
            </PrivateRoute>
          }
        />
        <Route
          path="papeleria"
          element={
            <PrivateRoute>
              <TesoreriaPapeleria />
            </PrivateRoute>
          }
        />
      </Route>
      {/* MODULO BANDA */}
      <Route
        path="/banda/*"
        element={
          <PrivateRoute>
            <BandaRouter />
          </PrivateRoute>
        }
      />
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