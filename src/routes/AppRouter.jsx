import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "../modules/auth/LoginPage";

import TesoreriaMatricula from "../modules/tesoreria/TesoreriaMatricula";
import TesoreriaNotificaciones from "../modules/tesoreria/TesoreriaNotificaciones";
import TesoreriaEstadistica from "../modules/tesoreria/TesoreriaEstadistica";
import TesoreriaPension from "../modules/tesoreria/TesoreriaPension";
import TesoreriaPapeleria from "../modules/tesoreria/TesoreriaPapeleria";
import Tesoreria from "../modules/tesoreria/Tesoreria";

import Home from "../modules/Home/HomePage";


import TestPage from "../modules/test/testPage";

// BANDA
import BandaLayout from "../modules/banda/layout/BandaLayout";
import BandaHomePage from "../modules/banda/BandaHomePage";

// INVENTARIO
import InventarioPage from "../modules/banda/inventario/pages/InventarioPage";

import PrestamosPage from "../modules/banda/prestamos/pages/PrestamosPage";

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
        path="/tesoreria/" 
        element={
        <PrivateRoute>
          <Tesoreria />
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
  path="prestamos"
  element={<PrestamosPage />}
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