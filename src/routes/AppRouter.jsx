// src/routes/AppRouter.jsx
// ⚠️  Rama: feature/jhon-dashboard
// ⚠️  ProtectedRoute desactivado temporalmente — reactivar al integrar con develop
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage      from "../modules/auth/LoginPage.tsx";
import Home          from "../modules/Home/HomePage";
import DashboardPage from "../modules/dashboard/DashboardPage";

// TODO: reactivar cuando el backend esté activo
const ProtectedRoute = ({ children }) => children;

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
