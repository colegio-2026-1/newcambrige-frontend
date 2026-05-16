import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "../modules/auth/LoginPage";

import Dashboard from "../modules/dashboard/DashboardPage";
import SalonPage from '../modules/salon/SalonPage';
import PupitrePage from "../modules/salon/PupitrePage";
import BibliotecaPage from "../modules/salon/BibliotecaPage";
import PruebasPage from "../modules/salon/PruebasPage";

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
      {/* Públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/salon" element={<SalonPage />} />
        <Route path="/pupitres" element={<PupitrePage />} />
        <Route path="/biblioteca" element={<BibliotecaPage />} />
        <Route path="/pruebas" element={<PruebasPage />} />

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