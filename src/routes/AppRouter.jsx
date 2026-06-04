// src/routes/AppRouter.jsx
// ⚠️  Rama: feature/jhon-dashboard
// ⚠️  Solo contiene las rutas necesarias para el módulo Dashboard.
// ⚠️  Al integrar con develop, se fusionan las rutas del equipo.
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage      from "../modules/auth/LoginPage.tsx";
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
