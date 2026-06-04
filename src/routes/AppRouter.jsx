import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage from "../modules/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute"

import TesoreriaRouter from "./TesoreriaRouter";

import ParametrizacionPage from '../modules/parametrizacion/ParametrizacionPage';
import UsuariosPage from '../modules/parametrizacion/UsuariosPage';
import ImportacionPage from '../modules/importacion/ImportacionPage';

import NotFound from "../modules/notFound/notFound";

import Home from "../modules/Home/HomePage";


import TestPage from "../modules/test/testPage";



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
        path="/parametrizacion/importacion" 
        element={
          <ProtectedRoute>
             <ImportacionPage />
          </ProtectedRoute>
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