/**
 * AppRouter — módulo Dashboard.
 * Sigue el patrón del equipo: importa sub-routers y los invoca como funciones.
 * main.jsx NO se toca.
 */
import { Routes, Route } from "react-router-dom";

import LoginPage      from "../modules/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage       from "../modules/Home/HomePage";
import NotFound       from "../modules/notFound/notFound";

import DashboardRouter from "./DashboardRouter";

const AppRouter = () => (
  <Routes>

    {/* PÚBLICA */}
    <Route path="/" element={<LoginPage />} />

    {/* HOME */}
    <Route
      path="/home"
      element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }
    />

    {/* DASHBOARD — sub-router del módulo */}
    {DashboardRouter()}

    {/* CATCH ALL */}
    <Route path="*" element={<NotFound />} />

  </Routes>
);

export default AppRouter;
