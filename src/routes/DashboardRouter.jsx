/**
 * DashboardRouter — Sub-rutas del módulo Dashboard.
 * Sigue el mismo patrón que TesoreriaRouter y SalonRouter del equipo:
 * exporta una función que devuelve un array de <Route>.
 * Se consume en AppRouter con {DashboardRouter()}.
 */
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardPage  from "../modules/dashboard/DashboardPage";

const DashboardRouter = () => [
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    }
  />,
];

export default DashboardRouter;
