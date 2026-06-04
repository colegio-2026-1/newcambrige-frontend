import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AsignacionesPage from "../modules/uniforme/pages/AsignacionesPage";
import InventarioPage from "../modules/uniforme/pages/InventarioPage";

export default function UniformesRouter() {
  return (
    <>
      <Route
        path="/uniformes"
        element={
          <Navigate
            to="/uniformes/asignaciones"
            replace
          />
        }
      />

      <Route
        path="/uniformes/inventario"
        element={
          <ProtectedRoute>
            <InventarioPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/uniformes/asignaciones"
        element={
          <ProtectedRoute>
            <AsignacionesPage />
          </ProtectedRoute>
        }
      />
    </>
  );
}