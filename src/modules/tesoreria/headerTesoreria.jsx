import React, { useEffect, useState } from "react";


import logoColegio from "../../assets/Escudos/NCS.png";
import logoUnipamplona from "../../assets/Escudos/UP.png";


export default function Header() {
  const logos = [logoColegio, logoUnipamplona];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % logos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <header className="bg-[#8E2A25] h-20 flex items-center px-8 shadow-lg relative border-b border-white/10">
      
      {/* Contenedor de Logos con Fade */}
      <div className="relative w-32 h-12 flex items-center justify-center z-10">
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt={`Logo ${i}`}
            className={`
              absolute max-w-full max-h-full object-contain transition-opacity duration-700 ease-in-out
              ${index === i ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}
      </div>

      {/* Título Centrado (Estilo New Cambridge) */}
      <h2 className="absolute left-1/2 -translate-x-1/2 text-white text-lg font-light tracking-[0.2em] uppercase italic whitespace-nowrap">
        Sistema de Paz y Salvo — New Cambridge School
      </h2>

      {/* Espacio decorativo a la derecha para equilibrar el logo */}
      <div className="w-32 hidden md:block"></div>
    </header>
  );
}