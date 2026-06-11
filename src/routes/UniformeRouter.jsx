import { Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AsignacionesPage from "../modules/uniforme/AsignacionesPage";
import InventarioPage from "../modules/uniforme/InventarioPage";

const UniformesRoutes = () => [
  <Route key="uniformes" path="/uniformes" element={<Navigate to="/uniformes/asignaciones" replace />} />,
  <Route key="uniformes-inventario" path="/uniformes/inventario" element={<ProtectedRoute><InventarioPage /></ProtectedRoute>} />,
  <Route key="uniformes-asignaciones" path="/uniformes/asignaciones" element={<ProtectedRoute><AsignacionesPage /></ProtectedRoute>} />,
];

export default UniformesRoutes;