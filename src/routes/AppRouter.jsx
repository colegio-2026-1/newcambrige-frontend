// src/router/AppRouter.js
import { Routes, Route } from "react-router-dom";

import LoginPage from "../modules/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

import TesoreriaRouter  from "./TesoreriaRouter";
import DashboardRouter  from "./DashboardRouter";
import SalonRouter      from "./SalonRouter";
import UniformeRouter   from "./UniformeRouter";
import ParametrizacionRouter from "./ParametrizacionRouter";

import ImportacionPage from '../modules/importacion/ImportacionPage';
import ImportacionRobotPage from '../modules/importacion/ImportacionRobotPage';
import ImportacionMasivaPage from '../modules/importacion/ImportacionMasivaPage';
import ImportacionIndividualPage from '../modules/importacion/ImportacionIndividualPage';

import NotFound from "../modules/notFound/notFound";
import Home     from "../modules/Home/HomePage";
import TestPage from "../modules/test/testPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<LoginPage />} />

      {/* HOME */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* MÓDULOS PRINCIPALES (cada uno exporta sus subrutas) */}
      {TesoreriaRouter()}
      {DashboardRouter()}
      {SalonRouter()}
      {UniformeRouter()}
      {ParametrizacionRouter()}   {/* ✅ AHORA INCLUYE todas las rutas de parametrización */}

      <Route 
        path="/importacion" 
        element={
          <ProtectedRoute>
             <ImportacionPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/importacion/:tipo" 
        element={
          <ProtectedRoute>
             <ImportacionRobotPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/importacion/masiva/:tipo" 
        element={
          <ProtectedRoute>
             <ImportacionMasivaPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/importacion/individual/:tipo" 
        element={
          <ProtectedRoute>
             <ImportacionIndividualPage />
          </ProtectedRoute>
        } 
      />

      {/* RUTA DE PRUEBAS / TEST */}
      <Route path="/test" element={<TestPage />} />

      {/* RUTA CATCH ALL – 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;