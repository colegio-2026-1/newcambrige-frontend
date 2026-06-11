import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RectoriaEstudiantes from "../modules/Rectoria/RectoriaEstudiantes";
import RectoriaDocentes from "../modules/Rectoria/RectoriaDocentes";
import Rectoria from "../modules/rectoria/Rectoria";


const RectoriaRoutes = () => [
  <Route key="rectoria" path="/rectoria/" element={<ProtectedRoute><Rectoria/></ProtectedRoute>} />,
  <Route key="rectoria-estudiantes" path="/rectoria/estudiantes" element={<ProtectedRoute><RectoriaEstudiantes/></ProtectedRoute>} />,
  <Route key="rectoria-docentes" path="/rectoria/docentes" element={<ProtectedRoute><RectoriaDocentes/></ProtectedRoute>} />,

];
export default RectoriaRoutes;