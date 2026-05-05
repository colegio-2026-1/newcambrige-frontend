import { useState } from "react";
import { useAuth } from "./useAuth";
import bgImage from "../../assets/Fondo_login.jpg";
import styles from "./LoginPage.module.css";

// Definimos los tipos esperados del hook useAuth (AJUSTALO CUANDO ESTABLEZCAS EL USEAUTH CUANDO ESTE EL BACKEND)
interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
}

export default function LoginPage() {
  const [usuario, setUsuario] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // MODIFICAR SEGUN NECESITE
  const { login } = useAuth() as AuthContextType;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!usuario || !contrasena) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await login(usuario, contrasena);
      console.log("Login:", { usuario, contrasena });
      // Normalmente aquí rediriges o el hook maneja la navegación
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* El CSS se importa automáticamente gracias al CSS Module */}
      <div
        className={styles["login-root"]}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className={styles["login-card"]}>
          <h1 className={styles["login-title"]}>Iniciar Sesión</h1>

          <form onSubmit={handleSubmit} noValidate>
            {/* Usuario */}
            <div className={styles["input-group"]}>
              <span className={styles["input-icon"]}>
                <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </span>
              <input
                className={styles["input-field"]}
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Contraseña */}
            <div className={styles["input-group"]}>
              <span className={styles["input-icon"]}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z" />
                </svg>
              </span>
              <input
                className={styles["input-field"]}
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <p className={styles["login-error"]}>{error}</p>}

            <button className={styles["login-btn"]} type="submit" disabled={loading}>
              {loading && <span className={styles["btn-spinner"]} />}
              {loading ? "Accediendo..." : "Acceder"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}