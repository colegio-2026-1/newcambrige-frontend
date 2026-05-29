import { NavLink } from "react-router-dom";

import BandaUserCard from "./BandaUserCard";

import "./BandaSidebar.css";

const BandaSidebar = () => {

  return (

    <aside className="banda-sidebar">

      {/* CONTENIDO SUPERIOR */}

      <div className="banda-sidebar__top">

        {/* BRAND */}

        <div className="banda-sidebar__brand">

          <h2 className="banda-sidebar__title">
            Banda Escolar
          </h2>

          <p className="banda-sidebar__subtitle">
            Gestión institucional
          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="banda-sidebar__nav">

          <NavLink
            to="/banda"
            end
            className={({ isActive }) =>
              isActive
                ? "banda-sidebar__link banda-sidebar__link--active"
                : "banda-sidebar__link"
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/banda/inventario"
            className={({ isActive }) =>
              isActive
                ? "banda-sidebar__link banda-sidebar__link--active"
                : "banda-sidebar__link"
            }
          >
            Inventario Banda
          </NavLink>

          <NavLink
            to="/banda/asignaciones"
            className={({ isActive }) =>
              isActive
                ? "banda-sidebar__link banda-sidebar__link--active"
                : "banda-sidebar__link"
            }
          >
            Asignaciones
          </NavLink>

        </nav>

      </div>

      {/* FOOTER USER */}

      <div className="banda-sidebar__footer">

        <BandaUserCard />

      </div>

    </aside>
  );
};

export default BandaSidebar;