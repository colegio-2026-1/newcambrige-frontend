import { Routes, Route, Navigate } from "react-router-dom";

// AUTH & CORE
import LoginPage from "../modules/auth/LoginPage";
import Home from "../modules/Home/HomePage";
import Dashboard from "../modules/dashboard/DashboardPage";

// TESORERIA
import Tesoreria from "../modules/tesoreria/Tesoreria";
import TesoreriaMatricula from "../modules/tesoreria/TesoreriaMatricula";
import TesoreriaNotificaciones from "../modules/tesoreria/TesoreriaNotificaciones";
import TesoreriaEstadistica from "../modules/tesoreria/TesoreriaEstadistica";
import TesoreriaPension from "../modules/tesoreria/TesoreriaPension";
import TesoreriaPapeleria from "../modules/tesoreria/TesoreriaPapeleria";

// BANDA (Estructura actualizada)
import BandaLayout from "../modules/banda/layout/BandaLayout";
import BandaHomePage from "../modules/banda/BandaHomePage";
import InventarioPage from "../modules/banda/inventario/pages/InventarioPage";
import PrestamosPage from "../modules/banda/prestamos/pages/PrestamosPage";

// TEST
import TestPage from "../modules/test/testPage";

// ==========================================
// COMPONENTE DE PROTECCIÓN DE RUTAS
// ==========================================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ==========================================
// ENRUTADOR PRINCIPAL
// ==========================================
const AppRouter = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/test" element={<TestPage />} />

      {/* PRIVATE ROUTES (Requieren Login) */}
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      {/* MODULO TESORERIA */}
      <Route path="/tesoreria">
        <Route
          index
          element={
            <PrivateRoute>
              <Tesoreria />
            </PrivateRoute>
          }
        />
        <Route
          path="matricula"
          element={
            <PrivateRoute>
              <TesoreriaMatricula />
            </PrivateRoute>
          }
        />
        <Route
          path="notificaciones"
          element={
            <PrivateRoute>
              <TesoreriaNotificaciones />
            </PrivateRoute>
          }
        />
        <Route
          path="estadisticas"
          element={
            <PrivateRoute>
              <TesoreriaEstadistica />
            </PrivateRoute>
          }
        />
        <Route
          path="pension"
          element={
            <PrivateRoute>
              <TesoreriaPension />
            </PrivateRoute>
          }
        />
        <Route
          path="papeleria"
          element={
            <PrivateRoute>
              <TesoreriaPapeleria />
            </PrivateRoute>
          }
        />
      </Route>

      {/* MODULO BANDA (Rutas Anidadas) */}
      <Route
        path="/banda"
        element={
          <PrivateRoute>
            <BandaLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<BandaHomePage />} />
        <Route path="inventario" element={<InventarioPage />} />
        <Route path="prestamos" element={<PrestamosPage />} />
      </Route>

      {/* DASHBOARD GENERAL */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* CATCH ALL - Redirige a login si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;