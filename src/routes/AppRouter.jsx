// src/router/AppRouter.js
import { Routes, Route } from "react-router-dom";

import LoginPage from "../modules/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

import TesoreriaRouter  from "./TesoreriaRouter";
import DashboardRouter  from "./DashboardRouter";
import SalonRouter      from "./SalonRouter";
import UniformeRouter   from "./UniformeRouter";
import ParametrizacionRouter from "./ParametrizacionRouter";

import NotFound from "../modules/notFound/notFound";
import Home     from "../modules/Home/HomePage";
import TestPage from "../modules/test/testPage";
import RectoriaRoutes from "./RectoriaRouter";

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
      {RectoriaRoutes()}

      {/* RUTA DE PRUEBAS / TEST */}
      <Route path="/test" element={<TestPage />} />

      {/* RUTA CATCH ALL – 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;