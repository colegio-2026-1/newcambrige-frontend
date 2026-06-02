import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import TesoreriaMatricula from "../modules/tesoreria/TesoreriaMatricula";
import TesoreriaPension from "../modules/tesoreria/TesoreriaPension";
import TesoreriaPapeleria from "../modules/tesoreria/TesoreriaPapeleria";
import Tesoreria from "../modules/tesoreria/Tesoreria";
import TesoreriaNotificaciones from "../modules/tesoreria/TesoreriaNotificaciones"

const TesoreriaRoutes = () => [
  <Route key="tesoreria" path="/tesoreria/" element={<ProtectedRoute><Tesoreria /></ProtectedRoute>} />,
  <Route key="tesoreria-matricula" path="/tesoreria/matricula" element={<ProtectedRoute><TesoreriaMatricula /></ProtectedRoute>} />,
  <Route key="tesoreria-papeleria" path="/tesoreria/papeleria" element={<ProtectedRoute><TesoreriaPapeleria /></ProtectedRoute>} />,
  <Route key="tesoreria-pension" path="/tesoreria/pension" element={<ProtectedRoute><TesoreriaPension /></ProtectedRoute>} />,
  <Route key="tesoreria-notificaciones" path="/tesoreria/notificaciones" element={<ProtectedRoute><TesoreriaNotificaciones /></ProtectedRoute>} />,
];
export default TesoreriaRoutes;