import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../modules/auth/LoginPage";
import Dashboard from "../modules/dashboard/DashboardPage";
import SalonPage from '../modules/salon/SalonPage';
import PupitrePage from "../modules/salon/PupitrePage";
import BibliotecaPage from "../modules/salon/BibliotecaPage";

// Protege rutas privadas
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("access_token");
    return token ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
    return (
    <Routes>
      {/* Públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/salon" element={<SalonPage />} />
        <Route path="/pupitres" element={<PupitrePage />} />
        <Route path="/biblioteca" element={<BibliotecaPage />} />

      {/* Privadas */}
        <Route path="/dashboard" element={
        <PrivateRoute>
            <Dashboard />
        </PrivateRoute>
        } />

      {/* Aquí se iran agregando los modulos */}
      {/* <Route path="/salones" element={<PrivateRoute><SalonPage /></PrivateRoute>} /> */}
      {/* <Route path="/estudiantes" element={<PrivateRoute><EstudiantesPage /></PrivateRoute>} /> */}

      {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    );
};

export default AppRouter;