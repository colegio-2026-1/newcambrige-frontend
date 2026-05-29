import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "../modules/auth/LoginPage";


import TesoreriaMatricula from "../modules/tesoreria/TesoreriaMatricula";
import TesoreriaPension from "../modules/tesoreria/TesoreriaPension";
import TesoreriaPapeleria from "../modules/tesoreria/TesoreriaPapeleria";
import Tesoreria from "../modules/tesoreria/Tesoreria";
import TesoreriaNotificaciones from "../modules/tesoreria/TesoreriaNotificaciones"


import SalonPage from "../modules/salon/SalonPage";
import PupitrePage from "../modules/salon/PupitrePage";
import BibliotecaPage from "../modules/salon/BibliotecaPage";
import PruebasPage from "../modules/salon/PruebasPage";

import Home from "../modules/Home/HomePage";


import TestPage from "../modules/test/testPage";
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

      
      
      <Route path="/salon"        element={<PrivateRoute><SalonPage /></PrivateRoute>} />
      <Route path="/pupitres"     element={<PrivateRoute><PupitrePage /></PrivateRoute>} />
      <Route path="/biblioteca/*" element={<PrivateRoute><BibliotecaPage /></PrivateRoute>} />
      <Route path="/pruebas"      element={<PrivateRoute><PruebasPage /></PrivateRoute>} />
      
      

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
        path="/tesoreria/notificaciones" 
        element={
        <PrivateRoute>
          <TesoreriaNotificaciones />
          </PrivateRoute>} />
      }
      
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