import { useAuth } from "../auth/useAuth";

const DashboardPage = () => {
    const { user, logout } = useAuth();

    return (
    <div style={{ padding: "40px" }}>
        <h1>Bienvenido, {user?.nombre ?? "Usuario"}</h1>
        <p>Correo: {user?.correo}</p>
        <button onClick={logout}>Cerrar sesión</button>
    </div>
    );
};

export default DashboardPage;