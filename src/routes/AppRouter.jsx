import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "../modules/auth/LoginPage";

import TesoreriaMatricula from "../modules/tesoreria/TesoreriaMatricula";
import Dashboard from "../modules/dashboard/DashboardPage";
import TesoreriaNotificaciones from "../modules/tesoreria/TesoreriaNotificaciones";
import TesoreriaEstadistica from "../modules/tesoreria/TesoreriaEstadistica";
import TesoreriaPension from "../modules/tesoreria/TesoreriaPension";
import TesoreriaPapeleria from "../modules/tesoreria/TesoreriaPapeleria";

import TestPage from "../modules/test/TestPage";
// ==============================
// RUTA PRIVADA
// ==============================

const PrivateRoute = ({
  children
}) => {

  const token =
    localStorage.getItem(
      "access_token"
    );

  // si no hay token
  if (!token) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

// ==============================
// ROUTER
// ==============================

const AppRouter = () => {

  return (

    <Routes>

      {/* ===================== */}
      {/* LOGIN */}
      {/* ===================== */}

      <Route
        path="/"
        element={<LoginPage />}
      />

      {/* ===================== */}
      {/* DASHBOARD */}
      {/* ===================== */}

      <Route
        path="/dashboard"
        element={

          <PrivateRoute>

            <Dashboard />

          </PrivateRoute>

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
      
  {      <Route
          path="/tesoreria/matricula"
          element={
            <PrivateRoute>
              <TesoreriaMatricula />
            </PrivateRoute>
          }
        />
}
{
        <Route 
        path="/tesoreria/notificaciones" 
        element={
        <PrivateRoute>
          <TesoreriaNotificaciones />
          </PrivateRoute>} />
      }
      {
        <Route 
        path="/tesoreria/estadisticas" 
        element={
        <PrivateRoute>
          <TesoreriaEstadistica />
          </PrivateRoute>} />
      }
      {
        <Route 
        path="/tesoreria/pension" 
        element={
        <PrivateRoute>
          <TesoreriaPension />
          </PrivateRoute>} />
      }
      {
        <Route 
        path="/tesoreria/papeleria" 
        element={
        <PrivateRoute>
          <TesoreriaPapeleria />
          </PrivateRoute>} />
      }
      
      <Route
        path="/test"
        element={<TestPage />}
      />

      {/* ===================== */}
      {/* CATCH ALL */}
      {/* ===================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRouter;