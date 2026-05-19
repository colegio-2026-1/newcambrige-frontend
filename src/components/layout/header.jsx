import { useEffect, useState } from "react";
import "./header.css";

import escudo1 from "../../assets/Escudos/NCS.svg";
import escudo2 from "../../assets/Escudos/UP.svg";

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

export default function Header({ title = " " }) {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % logos.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
            {/* LOGOS */}
            <div className="header-logos-container">
                <div className="header-logos">
                    {logos.map((logo, i) => (
                        <img
                            key={i}
                            src={logo}
                            alt="Logo institucional"
                            className={`header-logo ${index === i ? "active" : ""}`}
                        />
                    ))}
                </div>
            </div>

            {/* TITULO */}
            <div className="header-title">
                <h1>{title}</h1>
            </div>
        </header>
    );
}