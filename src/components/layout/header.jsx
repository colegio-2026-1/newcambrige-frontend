import { useEffect, useState } from "react";
import "./Header.css";

import escudo1 from "../../assets/Escudos/NCS.png";
import escudo2 from "../../assets/Escudos/UP.png";

const logos = [escudo1, escudo2];

/**
 * Header — componente reutilizable para todos los módulos
 *
 * Props:
 *  title {String} — título que se muestra en el centro
 *
 * Ejemplo de uso:
 *  <Header title="SISTEMA DE PAZ Y SALVO - NEW CAMBRIDGE SCHOOL" />
 *  <Header title="INVENTARIO DE LIBROS" />
 *  <Header title="UNIFORMES" />
 */

export default function Header({ title = "NEW CAMBRIDGE SCHOOL" }) {

    const [index, setIndex] = useState(0);

    useEffect(() => {
    const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % logos.length);
    }, 3500);
    return () => clearInterval(interval);
    }, []);

    return (
    <header className="header">

        <div className="header-logos">
        {logos.map((logo, i) => (
            <img
            key={i}
            src={logo}
            alt="Logo institucional"
            className="header-logo"
            style={{
                opacity:   index === i ? 1 : 0,
                transform: index === i ? "scale(1)" : "scale(0.96)",
            }}
            />
        ))}
        </div>

        <div className="header-title">
        <h1>{title}</h1>
        </div>

    </header>
    );
}