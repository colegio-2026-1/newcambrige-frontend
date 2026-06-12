import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ImportacionPage from '../modules/importacion/ImportacionPage';
import ImportacionRobotPage from '../modules/importacion/ImportacionRobotPage';
import ImportacionMasivaPage from '../modules/importacion/ImportacionMasivaPage';
import ImportacionIndividualPage from '../modules/importacion/ImportacionIndividualPage';

const ImportacionRouter = () => [
  <Route key="importacion" path="/importacion" element={<ProtectedRoute><ImportacionPage /></ProtectedRoute>} />,
  <Route key="importacion-robot" path="/importacion/:tipo" element={<ProtectedRoute><ImportacionRobotPage /></ProtectedRoute>} />,
  <Route key="importacion-masiva" path="/importacion/masiva/:tipo" element={<ProtectedRoute><ImportacionMasivaPage /></ProtectedRoute>} />,
  <Route key="importacion-individual" path="/importacion/individual/:tipo" element={<ProtectedRoute><ImportacionIndividualPage /></ProtectedRoute>} />
];
export default ImportacionRouter;
