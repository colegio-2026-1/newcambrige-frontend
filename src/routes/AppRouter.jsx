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

import ParametrizacionPage from '../modules/parametrizacion/ParametrizacionPage';
import UsuariosPage from '../modules/parametrizacion/UsuariosPage';

import NotFound from "../modules/notFound/notFound";

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
        path="/parametrizacion" 
        element={
          <PrivateRoute>
            <ParametrizacionPage />
          </PrivateRoute>
      } 
      />
      <Route 
        path="/parametrizacion/usuarios" 
        element={
          <PrivateRoute>
             <UsuariosPage />
          </PrivateRoute>
        } 
        />
      
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
          <NotFound />
        }
      />

    </Routes>
  );
};

export default AppRouter;