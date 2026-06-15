import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import BandaHomePage from "../modules/banda/BandaHomePage";
import InventarioPage from "../modules/banda/inventario/pages/InventarioPage";
import PrestamosPage from "../modules/banda/prestamos/pages/PrestamosPage";

const BandaRouter = () => [
   <Route 
    key="banda-home" 
    path="/banda" 
    element={<ProtectedRoute allowedRoles={["admin", "banda"]}><BandaHomePage /></ProtectedRoute>} 
  />,
  <Route 
    key="banda-inv"  
    path="/banda/inventario" 
    element={<ProtectedRoute allowedRoles={["admin", "banda"]}><InventarioPage /></ProtectedRoute>} 
  />,
  <Route 
    key="banda-pre"  
    path="/banda/prestamos" 
    element={<ProtectedRoute allowedRoles={["admin", "banda"]}><PrestamosPage /></ProtectedRoute>} 
  />,
];

export default BandaRouter;