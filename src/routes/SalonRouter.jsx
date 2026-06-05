
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import BibliotecaPage from "../modules/salon/BibliotecaPage";
import PupitrePage from "../modules/salon/PupitrePage";
import PruebasPage from "../modules/salon/PruebasPage";
import SalonPage from "../modules/salon/SalonPage";

const SalonRoutes = () => [
  <Route key="salon" path="/salon/" element={<ProtectedRoute><SalonPage /></ProtectedRoute>} />,
  <Route key="salon-biblioteca" path="/salon/biblioteca/*" element={<ProtectedRoute><BibliotecaPage /></ProtectedRoute>} />,
  <Route key="salon-pupitre" path="/salon/pupitre" element={<ProtectedRoute><PupitrePage /></ProtectedRoute>} />,
  <Route key="salon-pruebas" path="/salon/pruebas" element={<ProtectedRoute><PruebasPage /></ProtectedRoute>} />,
];

export default SalonRoutes;