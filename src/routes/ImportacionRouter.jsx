import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ImportacionPage from '../modules/importacion/ImportacionPage';
import ImportacionRobotPage from '../modules/importacion/ImportacionRobotPage';
import ImportacionMasivaPage from '../modules/importacion/ImportacionMasivaPage';
import ImportacionIndividualPage from '../modules/importacion/ImportacionIndividualPage';

const ImportacionRouter = () => [
  <Route key="importacion" path="/importacion" element={<ProtectedRoute allowedRoles={['admin']}><ImportacionPage /></ProtectedRoute>} />,
  <Route key="importacion-robot" path="/importacion/:tipo" element={<ProtectedRoute allowedRoles={['admin']}><ImportacionRobotPage /></ProtectedRoute>} />,
  <Route key="importacion-masiva" path="/importacion/masiva/:tipo" element={<ProtectedRoute allowedRoles={['admin']}><ImportacionMasivaPage /></ProtectedRoute>} />,
  <Route key="importacion-individual" path="/importacion/individual/:tipo" element={<ProtectedRoute allowedRoles={['admin']}><ImportacionIndividualPage /></ProtectedRoute>} />
];
export default ImportacionRouter;
