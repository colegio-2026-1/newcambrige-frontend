/**
 * AppRouter — rutas del módulo Dashboard.
 * Solo contiene las rutas que le corresponden a este módulo.
 * main.jsx NO se toca.
 */
import { Routes, Route } from "react-router-dom";

import LoginPage      from "../modules/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage       from "../modules/Home/HomePage";
import DashboardPage  from "../modules/dashboard/DashboardPage";
import NotFound       from "../modules/notFound/notFound";

const AppRouter = () => (
  <Routes>

    {/* LOGIN */}
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

    {/* DASHBOARD */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />

    {/* CATCH ALL */}
    <Route path="*" element={<NotFound />} />

  </Routes>
);

export default AppRouter;
