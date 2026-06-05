import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import ParametrizacionPage from "../modules/parametrizacion/ParametrizacionPage";
import UsuariosPage from "../modules/parametrizacion/UsuariosPage";
import PruebasPage from "../modules/parametrizacion/TiposPruebaPage"; 
// import ObjetosPage from "../modules/parametrizacion/ObjetosPage"; 
import AnioEscolarPage from "../modules/parametrizacion/AnioEscolarPage"; 

const ParametrizacionRouter = () => [
  <Route 
    key="parametrizacion-inicio" 
    path="/parametrizacion" 
    element={<ProtectedRoute><ParametrizacionPage /></ProtectedRoute>} 
  />,
  <Route 
    key="parametrizacion-usuarios" 
    path="/parametrizacion/usuarios" 
    element={<ProtectedRoute><UsuariosPage /></ProtectedRoute>} 
  />,   
  // <Route 
  //   key="parametrizacion-objetos" 
  //   path="/parametrizacion/objetos" 
  //   element={<ProtectedRoute><ObjetosPage /></ProtectedRoute>} 
  // />,   
  <Route 
    key="parametrizacion-pruebas" 
    path="/parametrizacion/pruebas" 
    element={<ProtectedRoute><PruebasPage /></ProtectedRoute>} 
  />,   
  <Route 
    key="parametrizacion-anio-escolar" 
    path="/parametrizacion/anio-escolar" 
    element={<ProtectedRoute><AnioEscolarPage /></ProtectedRoute>} 
  />

];

export default ParametrizacionRouter;