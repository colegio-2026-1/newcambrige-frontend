import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "../modules/auth/LoginPage";

import Home from "../modules/Home/HomePage";

import TestPage from "../modules/test/testPage";

// BANDA
import BandaLayout from "../modules/banda/layout/BandaLayout";
import BandaHomePage from "../modules/banda/BandaHomePage";

// INVENTARIO
import InventarioPage from "../modules/banda/inventario/pages/InventarioPage";

// ASIGNACIONES
import AsignacionesPage from "../modules/banda/asignaciones/pages/AsignacionesPage";

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
      {/* HOME */}
      {/* ===================== */}

      <Route
        path="/home"
        element={

          <PrivateRoute>

            <Home />

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
      {/* ====================== */}
      {/* MODULO BANDA */}
      {/* ====================== */}

      <Route
        path="/banda"
        element={
          <PrivateRoute>
            <BandaLayout />
          </PrivateRoute>
        }
      >

        <Route
          index
          element={<BandaHomePage />}
        />

        <Route
          path="inventario"
          element={<InventarioPage />}
        />

        <Route
          path="asignaciones"
          element={<AsignacionesPage />}
        />

      </Route>

      <Route
        path="/test"
        element={
          <TestPage />
        }
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