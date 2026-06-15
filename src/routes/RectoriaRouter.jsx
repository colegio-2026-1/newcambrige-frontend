import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RectoriaEstudiantes from "../modules/rectoria/RectoriaEstudiantes";
import RectoriaDocentes from "../modules/rectoria/RectoriaDocentes";
import Rectoria from "../modules/rectoria/Rectoria";
import RectoriaHome from "../modules/rectoria/RectoriaHome";


const RectoriaRoutes = () => [
  <Route key="rectoria" path="/rectoria/" element={<ProtectedRoute><Rectoria/></ProtectedRoute>} />,
  <Route key="rectoria-estudiantes" path="/rectoria/estudiantes" element={<ProtectedRoute><RectoriaEstudiantes/></ProtectedRoute>} />,
  <Route key="rectoria-docentes" path="/rectoria/docentes" element={<ProtectedRoute><RectoriaDocentes/></ProtectedRoute>} />,
  <Route key="rectoria-home" path="/rectoria/home" element={<ProtectedRoute><RectoriaHome/></ProtectedRoute>} />

];
export default RectoriaRoutes;