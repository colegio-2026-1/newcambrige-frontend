import { useEffect } from "react";

import { useAuth } from "../auth/useAuth";

import {
  checkSessionRequest
} from "../../api/authService";

const DashboardPage = () => {

  const {
    user,
    logout
  } = useAuth();

  // ==========================
  // VERIFICAR EXPIRACIÓN
  // ==========================

  // PILAS PELAO ESTO ES UNA PROPUESTA PARA LOGOUT FOR TIME
  // DEBES IMPLEMENTAR ESTO EN TU PAGE JUGANDO CON EL TIEMPO
  // DE ENVIO DE VERIFICACION DE SESION EN FRONT
  // Y EL TIEMPO MAXIMO DE OLGURA SETIADO EN BACK 

  useEffect(() => {

    // verificar sesión cada 10 segundos
    const interval = setInterval(
      async () => {

        try {

          // NO actualiza actividad
          await checkSessionRequest();

        } catch (error) {

          // el interceptor axios
          // hará logout automático
          console.log(
            "Sesión expirada"
          );
        }

      },
      10000
    );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div style={{ padding: "40px" }}>

      <h1>
        Bienvenido,{" "}
        {user?.nombre ?? "Usuario"}
      </h1>

      <p>
        Correo: {user?.correo}
      </p>

      <button onClick={logout}>

        Cerrar sesión

      </button>

    </div>
  );
};

export default DashboardPage;