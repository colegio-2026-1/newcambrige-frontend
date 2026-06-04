// src/routes/AppRouter.jsx
// ⚠️  Este archivo es el AppRouter de la rama feature/jhon-dashboard
// ⚠️  Solo contiene las rutas necesarias para el módulo Dashboard.
// ⚠️  Al momento de integrar, se fusionan las rutas del equipo.
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage      from "../modules/auth/LoginPage";
import Home          from "../modules/Home/HomePage";
import DashboardPage from "../modules/dashboard/DashboardPage";

// ==============================
// ROUTER
// ==============================
const AppRouter = () => {
  return (
    <Routes>

      {/* ===================== */}
      {/* LOGIN                 */}
      {/* ===================== */}
      <Route path="/" element={<LoginPage />} />

      {/* ===================== */}
      {/* HOME                  */}
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
      {/* DASHBOARD             */}
      {/* ===================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* ===================== */}
      {/* CATCH ALL             */}
      {/* ===================== */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRouter;
