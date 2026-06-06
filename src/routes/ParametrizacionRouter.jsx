// src/router/ParametrizacionRouter.js
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import ParametrizacionPage from "../modules/parametrizacion/ParametrizacionPage";
import UsuariosPage from "../modules/parametrizacion/UsuariosPage";
import PruebasPage from "../modules/parametrizacion/TiposPruebaPage";
import AnioEscolarPage from "../modules/parametrizacion/AnioEscolarPage";
// import ObjetosPage from "../modules/parametrizacion/ObjetosPage"; // si está comentado, no pasa nada

/**
 * Rutas del módulo de parametrización.
 * Todas están protegidas por <ProtectedRoute />.
 */
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
  <Route
    key="parametrizacion-pruebas"
    path="/parametrizacion/pruebas"
    element={<ProtectedRoute><PruebasPage /></ProtectedRoute>}
  />,
  <Route
    key="parametrizacion-anio-escolar"
    path="/parametrizacion/anio-escolar"
    element={<ProtectedRoute><AnioEscolarPage /></ProtectedRoute>}
  />,
  // Agrega aquí más rutas cuando estén listas (ej. Instrumentos, Objetos, Libros, Titulares)
];

export default ParametrizacionRouter;